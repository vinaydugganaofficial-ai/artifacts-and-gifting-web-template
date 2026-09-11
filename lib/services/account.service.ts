import "server-only";

import { addressRepository, userRepository } from "@/lib/repositories";
import { siteConfig } from "@/config/site";
import { logger } from "@/lib/observability/logger";
import type { Address, ShippingAddress, User } from "@/types/account";

/** Profile, password and address-book management for a signed-in customer. */

/* -------------------------------------------------------------------------- */
/* Profile                                                                     */
/* -------------------------------------------------------------------------- */

export type UpdateProfileInput = {
  name: string;
  /**
   * Optional contact address for order confirmations. NOT an identity — the
   * phone number is, and changing that would need its own verified flow.
   */
  email?: string;
  marketingOptIn: boolean;
};

export type UpdateProfileResult =
  { ok: true; user: User } | { ok: false; reason: string };

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<UpdateProfileResult> {
  const record = await userRepository.findById(userId);
  if (!record) return { ok: false, reason: "Account not found." };

  const updated = await userRepository.update({
    ...record,
    name: input.name.trim(),
    email: input.email?.trim().toLowerCase() || undefined,
    marketingOptIn: input.marketingOptIn,
  });

  logger.info("Profile updated", { userId });

  return {
    ok: true,
    user: {
      id: updated.id,
      phone: updated.phone,
      name: updated.name,
      email: updated.email,
      createdAt: updated.createdAt,
      marketingOptIn: updated.marketingOptIn,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Addresses                                                                   */
/* -------------------------------------------------------------------------- */

export type AddressInput = {
  label: string;
  recipient: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type AddressResult =
  { ok: true; address: Address } | { ok: false; reason: string };

export async function listAddresses(userId: string): Promise<Address[]> {
  return addressRepository.listForUser(userId);
}

export async function getDefaultAddress(userId: string): Promise<Address | null> {
  const addresses = await addressRepository.listForUser(userId);
  return addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;
}

export async function createAddress(
  userId: string,
  input: AddressInput,
): Promise<AddressResult> {
  const existing = await addressRepository.listForUser(userId);

  if (existing.length >= siteConfig.commerce.maxAddresses) {
    return {
      ok: false,
      reason: `You can save up to ${siteConfig.commerce.maxAddresses} addresses. Remove one first.`,
    };
  }

  const address: Address = {
    id: `adr_${globalThis.crypto.randomUUID()}`,
    userId,
    ...normalizeAddress(input),
    // The first address saved becomes the default whether asked for or not.
    isDefault: input.isDefault || existing.length === 0,
  };

  await addressRepository.create(address);
  logger.info("Address created", { userId, addressId: address.id });

  return { ok: true, address };
}

export async function updateAddress(
  userId: string,
  addressId: string,
  input: AddressInput,
): Promise<AddressResult> {
  const existing = await addressRepository.find(addressId);

  // Ownership is checked here, not in the route, so every caller is covered.
  if (!existing || existing.userId !== userId) {
    return { ok: false, reason: "That address could not be found." };
  }

  const updated: Address = {
    ...existing,
    ...normalizeAddress(input),
    isDefault: input.isDefault,
  };

  await addressRepository.update(updated);
  logger.info("Address updated", { userId, addressId });

  return { ok: true, address: updated };
}

export type DeleteAddressResult = { ok: true } | { ok: false; reason: string };

export async function deleteAddress(
  userId: string,
  addressId: string,
): Promise<DeleteAddressResult> {
  const existing = await addressRepository.find(addressId);

  if (!existing || existing.userId !== userId) {
    return { ok: false, reason: "That address could not be found." };
  }

  await addressRepository.delete(addressId);

  // Never leave an account with addresses but no default.
  if (existing.isDefault) {
    const remaining = await addressRepository.listForUser(userId);
    if (remaining[0]) {
      await addressRepository.update({ ...remaining[0], isDefault: true });
    }
  }

  logger.info("Address deleted", { userId, addressId });

  return { ok: true };
}

export async function setDefaultAddress(
  userId: string,
  addressId: string,
): Promise<AddressResult> {
  const existing = await addressRepository.find(addressId);

  if (!existing || existing.userId !== userId) {
    return { ok: false, reason: "That address could not be found." };
  }

  const updated = { ...existing, isDefault: true };
  await addressRepository.update(updated);

  return { ok: true, address: updated };
}

function normalizeAddress(input: AddressInput) {
  return {
    label: input.label.trim(),
    recipient: input.recipient.trim(),
    phone: input.phone.trim(),
    line1: input.line1.trim(),
    line2: input.line2?.trim() || undefined,
    city: input.city.trim(),
    state: input.state.trim(),
    postalCode: input.postalCode.trim().toUpperCase(),
    country: input.country.trim(),
  };
}

/** Strips the account-specific fields when an address is copied onto an order. */
export function toShippingAddress(address: Address): ShippingAddress {
  return {
    recipient: address.recipient,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
  };
}
