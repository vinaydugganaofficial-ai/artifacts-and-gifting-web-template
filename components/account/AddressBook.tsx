"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { addressSchema, type AddressFormInput } from "@/lib/api/schemas";
import {
  createAddress as createAddressRequest,
  deleteAddress as deleteAddressRequest,
  updateAddress as updateAddressRequest,
} from "@/lib/api/client";
import type { Address } from "@/types/account";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { useUIStore } from "@/lib/store/ui";
import { cn } from "@/lib/utils";

type AddressBookProps = {
  /** Server-rendered starting point; edits are applied optimistically after. */
  initialAddresses: Address[];
  maxAddresses: number;
  defaultCountry: string;
};

const EMPTY_FORM: AddressFormInput = {
  label: "",
  recipient: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

export function AddressBook({
  initialAddresses,
  maxAddresses,
  defaultCountry,
}: AddressBookProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [editing, setEditing] = useState<Address | null>(null);
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const showToast = useUIStore((state) => state.showToast);

  const atLimit = addresses.length >= maxAddresses;
  const formOpen = adding || editing !== null;

  function closeForm() {
    setAdding(false);
    setEditing(null);
  }

  async function onDelete(address: Address) {
    setBusyId(address.id);
    const result = await deleteAddressRequest(address.id);
    setBusyId(null);

    if (!result.ok) {
      showToast(result.error.message, "error");
      return;
    }

    setAddresses((current) => {
      const remaining = current.filter((entry) => entry.id !== address.id);
      // Mirror the server's rule: never leave a book with no default.
      if (address.isDefault && remaining[0]) {
        return remaining.map((entry, index) =>
          index === 0 ? { ...entry, isDefault: true } : entry,
        );
      }
      return remaining;
    });

    showToast("Address removed", "success");
  }

  async function onMakeDefault(address: Address) {
    setBusyId(address.id);

    const result = await updateAddressRequest(address.id, {
      label: address.label,
      recipient: address.recipient,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 ?? "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: true,
    });

    setBusyId(null);

    if (!result.ok) {
      showToast(result.error.message, "error");
      return;
    }

    setAddresses((current) =>
      current
        .map((entry) => ({ ...entry, isDefault: entry.id === address.id }))
        .sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    );

    showToast("Default address updated", "success");
  }

  function onSaved(saved: Address) {
    setAddresses((current) => {
      const without = current.filter((entry) => entry.id !== saved.id);
      const next = saved.isDefault
        ? without.map((entry) => ({ ...entry, isDefault: false }))
        : without;

      return [...next, saved].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
    });

    closeForm();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta font-medium">
          {addresses.length} of {maxAddresses} saved
        </p>

        {!formOpen ? (
          <Button
            variant="outline"
            size="sm"
            disabled={atLimit}
            onClick={() => setAdding(true)}
          >
            Add an address
          </Button>
        ) : null}
      </div>

      {atLimit && !formOpen ? (
        <p className="mt-3 text-sm text-deep-brown/65">
          You have saved the maximum of {maxAddresses} addresses. Remove one to add
          another.
        </p>
      ) : null}

      {formOpen ? (
        <AddressForm
          key={editing?.id ?? "new"}
          address={editing}
          defaultCountry={defaultCountry}
          onCancel={closeForm}
          onSaved={onSaved}
        />
      ) : null}

      {addresses.length === 0 && !formOpen ? (
        <EmptyState
          className="mt-8"
          title="No addresses saved."
          description="Save an address and it will be offered at checkout, so you do not have to type it again."
          action={{ href: "/account/addresses", label: "Add your first address" }}
        />
      ) : null}

      {addresses.length > 0 ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className={cn(
                "flex flex-col justify-between border p-6",
                address.isDefault ? "border-forest bg-sand/30" : "border-deep-brown/15 bg-sand/15",
              )}
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-display text-xl text-forest">{address.label}</p>
                  {address.isDefault ? <Badge tone="terracotta">Default</Badge> : null}
                </div>

                <address className="mt-4 text-sm not-italic leading-relaxed text-deep-brown/75">
                  <span className="block font-medium text-deep-brown">{address.recipient}</span>
                  <span className="block">{address.line1}</span>
                  {address.line2 ? <span className="block">{address.line2}</span> : null}
                  <span className="block">
                    {address.city}, {address.state} {address.postalCode}
                  </span>
                  <span className="block">{address.country}</span>
                  <span className="mt-2 block text-deep-brown/60">{address.phone}</span>
                </address>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-deep-brown/15 pt-4 text-[10px] uppercase tracking-[0.2em]">
                <button
                  type="button"
                  onClick={() => {
                    setAdding(false);
                    setEditing(address);
                  }}
                  className="font-medium text-deep-brown/70 transition-colors hover:text-terracotta"
                >
                  Edit
                </button>

                {!address.isDefault ? (
                  <button
                    type="button"
                    onClick={() => onMakeDefault(address)}
                    disabled={busyId === address.id}
                    className="font-medium text-deep-brown/70 transition-colors hover:text-terracotta disabled:opacity-50"
                  >
                    Make default
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => onDelete(address)}
                  disabled={busyId === address.id}
                  className="text-deep-brown/60 transition-colors hover:text-danger disabled:opacity-50"
                >
                  {busyId === address.id ? "Working…" : "Remove"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

type AddressFormProps = {
  /** Null when adding. */
  address: Address | null;
  defaultCountry: string;
  onCancel: () => void;
  onSaved: (address: Address) => void;
};

function AddressForm({ address, defaultCountry, onCancel, onSaved }: AddressFormProps) {
  const showToast = useUIStore((state) => state.showToast);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: address
      ? {
          label: address.label,
          recipient: address.recipient,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2 ?? "",
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
          isDefault: address.isDefault,
        }
      : { ...EMPTY_FORM, country: defaultCountry },
  });

  async function onSubmit(values: AddressFormInput) {
    setSubmitError(null);

    const result = address
      ? await updateAddressRequest(address.id, values)
      : await createAddressRequest(values);

    if (!result.ok) {
      setSubmitError(result.error.message);
      return;
    }

    showToast(address ? "Address updated" : "Address saved", "success");
    onSaved(result.data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-8 border border-deep-brown/15 bg-sand/20 p-6 sm:p-8"
    >
      <h3 className="font-display text-2xl text-forest">
        {address ? "Edit address" : "New address"}
      </h3>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field
          htmlFor="addr-label"
          label="Name this address"
          error={errors.label?.message}
        >
          <Input
            id="addr-label"
            placeholder="Home / Ancestral Residence"
            invalid={Boolean(errors.label)}
            {...register("label")}
          />
        </Field>

        <Field
          htmlFor="addr-recipient"
          label="Recipient"
          error={errors.recipient?.message}
        >
          <Input
            id="addr-recipient"
            autoComplete="name"
            invalid={Boolean(errors.recipient)}
            {...register("recipient")}
          />
        </Field>

        <Field htmlFor="addr-phone" label="Phone" error={errors.phone?.message}>
          <Input
            id="addr-phone"
            type="tel"
            autoComplete="tel"
            invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
        </Field>

        <Field htmlFor="addr-country" label="Country" error={errors.country?.message}>
          <Input
            id="addr-country"
            autoComplete="country-name"
            invalid={Boolean(errors.country)}
            {...register("country")}
          />
        </Field>

        <Field
          htmlFor="addr-line1"
          label="Address"
          error={errors.line1?.message}
          className="sm:col-span-2"
        >
          <Input
            id="addr-line1"
            autoComplete="address-line1"
            invalid={Boolean(errors.line1)}
            {...register("line1")}
          />
        </Field>

        <Field
          htmlFor="addr-line2"
          label="Apartment, suite (optional)"
          error={errors.line2?.message}
          className="sm:col-span-2"
        >
          <Input
            id="addr-line2"
            autoComplete="address-line2"
            invalid={Boolean(errors.line2)}
            {...register("line2")}
          />
        </Field>

        <Field htmlFor="addr-city" label="City" error={errors.city?.message}>
          <Input
            id="addr-city"
            autoComplete="address-level2"
            invalid={Boolean(errors.city)}
            {...register("city")}
          />
        </Field>

        <Field htmlFor="addr-state" label="State or region" error={errors.state?.message}>
          <Input
            id="addr-state"
            autoComplete="address-level1"
            invalid={Boolean(errors.state)}
            {...register("state")}
          />
        </Field>

        <Field
          htmlFor="addr-postal"
          label="Postal code"
          error={errors.postalCode?.message}
        >
          <Input
            id="addr-postal"
            autoComplete="postal-code"
            invalid={Boolean(errors.postalCode)}
            {...register("postalCode")}
          />
        </Field>
      </div>

      <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm text-deep-brown/80">
        <input
          type="checkbox"
          className="size-4 accent-terracotta"
          {...register("isDefault")}
        />
        Use this as my default delivery address
      </label>

      {submitError ? (
        <p role="alert" className="mt-6 text-sm text-danger">
          {submitError}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Saving…" : address ? "Save changes" : "Save address"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
