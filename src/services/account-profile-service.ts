import {
  ACCOUNT_PROFILE_DATA,
  AccountProfileData,
} from '@src/data/my-account';
import { getSupabaseClient } from './supabase-client';

type AccountProfileRow = {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  primary_email: string;
  alternate_email: string | null;
  primary_phone: string;
  alternate_phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  updated_at: string;
};

const TABLE_NAME = 'account_profiles';
const DEFAULT_ACCOUNT_ID = '00000000-0000-0000-0000-000000000001';

const toDomain = (row: AccountProfileRow): AccountProfileData => ({
  name: {
    firstName: row.first_name,
    middleName: row.middle_name ?? '',
    lastName: row.last_name,
  },
  email: {
    primaryEmail: row.primary_email,
    alternateEmail: row.alternate_email ?? '',
  },
  phone: {
    primaryPhone: row.primary_phone,
    alternatePhone: row.alternate_phone ?? '',
  },
  address: {
    addressLine1: row.address_line1,
    addressLine2: row.address_line2 ?? '',
    city: row.city,
    state: row.state,
    postalCode: row.postal_code,
  },
});

const toRow = (payload: AccountProfileData): AccountProfileRow => ({
  id: DEFAULT_ACCOUNT_ID,
  first_name: payload.name.firstName,
  middle_name: payload.name.middleName || null,
  last_name: payload.name.lastName,
  primary_email: payload.email.primaryEmail,
  alternate_email: payload.email.alternateEmail || null,
  primary_phone: payload.phone.primaryPhone,
  alternate_phone: payload.phone.alternatePhone || null,
  address_line1: payload.address.addressLine1,
  address_line2: payload.address.addressLine2 || null,
  city: payload.address.city,
  state: payload.address.state,
  postal_code: payload.address.postalCode,
  updated_at: new Date().toISOString(),
});

const mergeSection = (
  sectionId: string,
  profile: AccountProfileData,
  values: Record<string, string>,
): AccountProfileData => {
  switch (sectionId) {
    case 'profile-name':
      return {
        ...profile,
        name: { ...profile.name, ...values },
      };
    case 'profile-email':
      return {
        ...profile,
        email: { ...profile.email, ...values },
      };
    case 'profile-phone':
      return {
        ...profile,
        phone: { ...profile.phone, ...values },
      };
    case 'profile-address':
    default:
      return {
        ...profile,
        address: { ...profile.address, ...values },
      };
  }
};

export const fetchAccountProfile = async (): Promise<AccountProfileData> => {
  const client = getSupabaseClient();
  if (!client) {
    return ACCOUNT_PROFILE_DATA;
  }

  const { data, error } = await client
    .from<AccountProfileRow>(TABLE_NAME)
    .select('*')
    .eq('id', DEFAULT_ACCOUNT_ID)
    .maybeSingle();

  if (error) {
    console.warn('Unable to fetch profile from Supabase:', error.message);
    return ACCOUNT_PROFILE_DATA;
  }

  if (!data) {
    const fallback = ACCOUNT_PROFILE_DATA;
    await client
      .from(TABLE_NAME)
      .upsert(toRow(fallback), { onConflict: 'id' });
    return fallback;
  }

  return toDomain(data);
};

export const updateAccountProfileSection = async (
  sectionId: string,
  values: Record<string, string>,
): Promise<AccountProfileData> => {
  const client = getSupabaseClient();
  if (!client) {
    return mergeSection(sectionId, ACCOUNT_PROFILE_DATA, values);
  }

  const current = await fetchAccountProfile();
  const merged = mergeSection(sectionId, current, values);

  const { data, error } = await client
    .from<AccountProfileRow>(TABLE_NAME)
    .upsert(toRow(merged), { onConflict: 'id' })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to save account profile.');
  }

  return toDomain(data);
};
