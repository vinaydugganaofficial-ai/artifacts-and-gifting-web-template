"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  placeOrderSchema,
  PAYMENT_METHODS,
  type PlaceOrderFormInput,
} from "@/lib/api/schemas";
import { placeOrder, type PlacedOrderReceipt } from "@/lib/api/client";
import type { Address, User } from "@/types/account";
import { useCommerceStore, selectCart, type CartItem } from "@/lib/store/commerce";
import { useStoreBase } from "@/lib/use-store-base";
import { useCheckoutQuote } from "@/lib/hooks/use-checkout-quote";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { OrderPlaced } from "@/components/checkout/OrderPlaced";
import { CouponField } from "@/components/checkout/CouponField";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { useUIStore } from "@/lib/store/ui";
import { formatPhone } from "@/lib/auth/phone";
import { cn } from "@/lib/utils";

const EMPTY_CART: readonly CartItem[] = Object.freeze([]);

type CheckoutClientProps = {
  user: User | null;
  savedAddresses: Address[];
  defaultCountry: string;
  freeShippingThreshold: number;
};

export function CheckoutClient({
  user,
  savedAddresses,
  defaultCountry,
  freeShippingThreshold,
}: CheckoutClientProps) {
  const router = useRouter();
  const cart = useStoreBase(useCommerceStore, selectCart, EMPTY_CART as CartItem[]);
  const clearCart = useCommerceStore((state) => state.clearCart);
  const showToast = useUIStore((state) => state.showToast);

  const defaultAddress = savedAddresses.find((address) => address.isDefault);

  const [couponCode, setCouponCode] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    defaultAddress?.id ?? savedAddresses[0]?.id ?? "",
  );
  const [receipt, setReceipt] = useState<PlacedOrderReceipt | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { quote, loading, error } = useCheckoutQuote(cart, couponCode);

  // "new" is a sentinel for the inline address form rather than a saved id.
  const usingNewAddress = selectedAddressId === "" || selectedAddressId === "new";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlaceOrderFormInput>({
    resolver: zodResolver(placeOrderSchema),
    defaultValues: {
      // A signed-in customer's number is authoritative and set server-side;
      // this only matters for a guest.
      phone: user?.phone ?? "",
      email: user?.email ?? "",
      items: [],
      couponCode: "",
      note: "",
      addressId: "",
      paymentMethod: "card",
      saveAddress: false,
      company: "",
      shippingAddress: {
        recipient: user?.name ?? "",
        phone: user?.phone ?? "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: defaultCountry,
      },
    },
  });

  async function onSubmit(values: PlaceOrderFormInput) {
    setSubmitError(null);

    // Items are read from the live store at submit time, and the coupon from the
    // field the customer actually applied — never from stale form state.
    const result = await placeOrder({
      ...values,
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      couponCode: quote?.coupon?.code ?? "",
      addressId: usingNewAddress ? "" : selectedAddressId,
      shippingAddress: usingNewAddress ? values.shippingAddress : undefined,
      saveAddress: usingNewAddress ? values.saveAddress : false,
    });

    if (!result.ok) {
      setSubmitError(result.error.message);
      showToast("Your order could not be placed", "error");
      return;
    }

    setReceipt(result.data);
    clearCart();
    showToast("Order placed", "success");
    // Refreshes the header counts and the account section's server data.
    router.refresh();
  }

  if (receipt) {
    const method = PAYMENT_METHODS.find((entry) => entry.value === receipt.paymentMethod);

    return (
      <OrderPlaced
        receipt={receipt}
        signedIn={Boolean(user)}
        paymentLabel={method?.label ?? "Confirmed with the atelier"}
      />
    );
  }

  if (cart.length === 0) {
    return (
      <EmptyState
        className="mt-12"
        title="There is nothing to check out."
        description="Your bag is empty, so there is no order to place yet."
        action={{ href: "/shop", label: "Explore the collection" }}
      />
    );
  }

  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-xl space-y-14">
        {/* 1 — Contact */}
        <section>
          <SectionTitle step="01" title="Contact" />

          {user ? (
            <p className="mt-6 text-sm text-charcoal/70">
              Signed in as{" "}
              <span className="whitespace-nowrap text-charcoal">
                {formatPhone(user.phone)}
              </span>
              . We will confirm your order on this number.
            </p>
          ) : (
            <div className="mt-6 space-y-6">
              <Field
                htmlFor="checkout-phone"
                label="Mobile number"
                hint="How we confirm your order and how you track it later."
                error={errors.phone?.message}
              >
                <Input
                  id="checkout-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+91 98200 11223"
                  invalid={Boolean(errors.phone)}
                  aria-describedby={
                    errors.phone ? "checkout-phone-error" : "checkout-phone-hint"
                  }
                  {...register("phone")}
                />
              </Field>

              <Field
                htmlFor="checkout-email"
                label="Email"
                hint="Optional. For a written confirmation."
                error={errors.email?.message}
              >
                <Input
                  id="checkout-email"
                  type="email"
                  autoComplete="email"
                  invalid={Boolean(errors.email)}
                  {...register("email")}
                />
              </Field>

              <p className="text-xs text-charcoal/50">
                Have an account?{" "}
                <Link
                  href="/sign-in?next=%2Fcheckout"
                  className="link-underline text-charcoal/75"
                >
                  Sign in
                </Link>{" "}
                to use a saved address and member offers.
              </p>
            </div>
          )}
        </section>

        {/* 2 — Delivery */}
        <section>
          <SectionTitle step="02" title="Delivery address" />

          {savedAddresses.length > 0 ? (
            <fieldset className="mt-6">
              <legend className="sr-only">Choose a delivery address</legend>

              <div className="space-y-3">
                {savedAddresses.map((address) => (
                  <label
                    key={address.id}
                    className={cn(
                      "flex cursor-pointer gap-4 border p-5 transition-colors",
                      selectedAddressId === address.id
                        ? "border-gold/60 bg-gold/5"
                        : "border-charcoal/12 hover:border-charcoal/30",
                    )}
                  >
                    <input
                      type="radio"
                      name="delivery-address"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="mt-1 size-4 shrink-0 accent-[var(--color-gold)]"
                    />

                    <span className="min-w-0 text-sm">
                      <span className="block font-medium text-charcoal">
                        {address.label}
                        {address.isDefault ? (
                          <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-gold-muted">
                            Default
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-1 block text-charcoal/60">
                        {address.recipient}, {address.line1}
                        {address.line2 ? `, ${address.line2}` : ""}, {address.city},{" "}
                        {address.state} {address.postalCode}
                      </span>
                    </span>
                  </label>
                ))}

                <label
                  className={cn(
                    "flex cursor-pointer gap-4 border p-5 transition-colors",
                    usingNewAddress
                      ? "border-gold/60 bg-gold/5"
                      : "border-charcoal/12 hover:border-charcoal/30",
                  )}
                >
                  <input
                    type="radio"
                    name="delivery-address"
                    value="new"
                    checked={usingNewAddress}
                    onChange={() => setSelectedAddressId("new")}
                    className="mt-1 size-4 shrink-0 accent-[var(--color-gold)]"
                  />
                  <span className="text-sm text-charcoal">Send to a new address</span>
                </label>
              </div>
            </fieldset>
          ) : null}

          {usingNewAddress ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Field
                htmlFor="ship-recipient"
                label="Recipient"
                error={errors.shippingAddress?.recipient?.message}
              >
                <Input
                  id="ship-recipient"
                  autoComplete="name"
                  invalid={Boolean(errors.shippingAddress?.recipient)}
                  {...register("shippingAddress.recipient")}
                />
              </Field>

              <Field
                htmlFor="ship-phone"
                label="Phone"
                error={errors.shippingAddress?.phone?.message}
              >
                <Input
                  id="ship-phone"
                  type="tel"
                  autoComplete="tel"
                  invalid={Boolean(errors.shippingAddress?.phone)}
                  {...register("shippingAddress.phone")}
                />
              </Field>

              <Field
                htmlFor="ship-line1"
                label="Address"
                error={errors.shippingAddress?.line1?.message}
                className="sm:col-span-2"
              >
                <Input
                  id="ship-line1"
                  autoComplete="address-line1"
                  invalid={Boolean(errors.shippingAddress?.line1)}
                  {...register("shippingAddress.line1")}
                />
              </Field>

              <Field
                htmlFor="ship-line2"
                label="Apartment, suite (optional)"
                error={errors.shippingAddress?.line2?.message}
                className="sm:col-span-2"
              >
                <Input
                  id="ship-line2"
                  autoComplete="address-line2"
                  invalid={Boolean(errors.shippingAddress?.line2)}
                  {...register("shippingAddress.line2")}
                />
              </Field>

              <Field
                htmlFor="ship-city"
                label="City"
                error={errors.shippingAddress?.city?.message}
              >
                <Input
                  id="ship-city"
                  autoComplete="address-level2"
                  invalid={Boolean(errors.shippingAddress?.city)}
                  {...register("shippingAddress.city")}
                />
              </Field>

              <Field
                htmlFor="ship-state"
                label="State or region"
                error={errors.shippingAddress?.state?.message}
              >
                <Input
                  id="ship-state"
                  autoComplete="address-level1"
                  invalid={Boolean(errors.shippingAddress?.state)}
                  {...register("shippingAddress.state")}
                />
              </Field>

              <Field
                htmlFor="ship-postal"
                label="Postal code"
                error={errors.shippingAddress?.postalCode?.message}
              >
                <Input
                  id="ship-postal"
                  autoComplete="postal-code"
                  invalid={Boolean(errors.shippingAddress?.postalCode)}
                  {...register("shippingAddress.postalCode")}
                />
              </Field>

              <Field
                htmlFor="ship-country"
                label="Country"
                error={errors.shippingAddress?.country?.message}
              >
                <Input
                  id="ship-country"
                  autoComplete="country-name"
                  invalid={Boolean(errors.shippingAddress?.country)}
                  {...register("shippingAddress.country")}
                />
              </Field>

              {user ? (
                <label className="flex cursor-pointer items-center gap-3 text-sm text-charcoal/70 sm:col-span-2">
                  <input
                    type="checkbox"
                    className="size-4 accent-[var(--color-gold)]"
                    {...register("saveAddress")}
                  />
                  Save this address to my account
                </label>
              ) : null}
            </div>
          ) : null}
        </section>

        {/* 3 — Payment */}
        <section>
          <SectionTitle step="03" title="Payment" />

          <fieldset className="mt-6">
            <legend className="sr-only">Choose a payment method</legend>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.value}
                  className="flex cursor-pointer gap-4 border border-charcoal/12 p-5 transition-colors hover:border-charcoal/30 has-[:checked]:border-gold/60 has-[:checked]:bg-gold/5"
                >
                  <input
                    type="radio"
                    value={method.value}
                    className="mt-1 size-4 shrink-0 accent-[var(--color-gold)]"
                    {...register("paymentMethod")}
                  />
                  <span className="min-w-0 text-sm">
                    <span className="block font-medium text-charcoal">
                      {method.label}
                    </span>
                    <span className="mt-1 block text-charcoal/60">{method.detail}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {errors.paymentMethod ? (
            <p role="alert" className="mt-3 text-sm text-danger">
              {errors.paymentMethod.message}
            </p>
          ) : null}

          <p className="mt-5 text-xs leading-relaxed text-charcoal/50">
            Nothing is charged on this page. The atelier confirms availability, then sends
            a payment link or invoice for the method you chose.
          </p>
        </section>

        {/* 4 — Anything else */}
        <section>
          <SectionTitle step="04" title="Anything we should know" />

          <div className="mt-6">
            <Field
              htmlFor="checkout-note"
              label="Note for the atelier"
              hideLabel
              hint="Optional. A gift message, a placement, a deadline."
              error={errors.note?.message}
            >
              <Textarea
                id="checkout-note"
                rows={3}
                invalid={Boolean(errors.note)}
                {...register("note")}
              />
            </Field>
          </div>
        </section>

        {/* Honeypot */}
        <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="checkout-company">Company</label>
          <input
            id="checkout-company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("company")}
          />
        </div>

        {submitError ? (
          <p
            role="alert"
            className="border border-danger/40 bg-danger/5 px-5 py-4 text-sm text-danger"
          >
            {submitError}
          </p>
        ) : null}

        {error ? (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        ) : null}

        <div>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={loading || !quote || quote.lines.length === 0}
            className="w-full sm:w-auto sm:min-w-64"
          >
            {isSubmitting ? "Placing your order…" : "Place order"}
          </Button>

          <p className="mt-4 text-xs leading-relaxed text-charcoal/50">
            By placing this order you agree to our{" "}
            <Link href="/terms" className="link-underline text-charcoal/70">
              terms of sale
            </Link>
            .
          </p>
        </div>
      </form>

      <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
        <CheckoutSummary
          quote={quote}
          loading={loading}
          freeShippingThreshold={freeShippingThreshold}
        />

        <CouponField
          value={couponCode}
          onApply={setCouponCode}
          applied={quote?.coupon ?? null}
          errorMessage={quote?.couponError}
          signedIn={Boolean(user)}
        />
      </aside>
    </div>
  );
}

function SectionTitle({ step, title }: { step: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-charcoal/10 pb-4">
      <span aria-hidden className="font-display text-2xl text-gold/60">
        {step}
      </span>
      <h2 className="font-display text-2xl">{title}</h2>
    </div>
  );
}
