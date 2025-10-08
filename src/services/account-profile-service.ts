import {
  ACCOUNT_PROFILE_DATA,
  AccountProfileData,
  BusinessEntityDetails,
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
  business_entities: BusinessEntityRow[] | null;
};

type BusinessEntityRow = {
  id: string;
  entity_name: string;
  entity_type: string;
  registration_number: string;
  registered_agent_name: string;
  registered_agent_email: string;
  registered_agent_phone: string;
  registered_agent_address: string;
};

const TABLE_NAME = 'account_profiles';
const DEFAULT_ACCOUNT_ID = '00000000-0000-0000-0000-000000000001';

const cloneBusinessEntity = (entity: BusinessEntityDetails): BusinessEntityDetails => ({
  id: entity.id,
  entityName: entity.entityName,
  entityType: entity.entityType,
  registrationNumber: entity.registrationNumber,
  registeredAgent: { ...entity.registeredAgent },
});

const cloneBusinessEntities = (
  entities: BusinessEntityDetails[] = [],
): BusinessEntityDetails[] => entities.map(cloneBusinessEntity);

const toBusinessEntity = (row: BusinessEntityRow): BusinessEntityDetails => ({
  id: row.id,
  entityName: row.entity_name,
  entityType: row.entity_type,
  registrationNumber: row.registration_number,
  registeredAgent: {
    name: row.registered_agent_name,
    email: row.registered_agent_email,
    phone: row.registered_agent_phone,
    address: row.registered_agent_address,
  },
});

const fromBusinessEntity = (entity: BusinessEntityDetails): BusinessEntityRow => ({
  id: entity.id,
  entity_name: entity.entityName,
  entity_type: entity.entityType,
  registration_number: entity.registrationNumber,
  registered_agent_name: entity.registeredAgent.name,
  registered_agent_email: entity.registeredAgent.email,
  registered_agent_phone: entity.registeredAgent.phone,
  registered_agent_address: entity.registeredAgent.address,
});

const cloneProfileData = (
  data: AccountProfileData = ACCOUNT_PROFILE_DATA,
): AccountProfileData => ({
  name: { ...data.name },
  email: { ...data.email },
  phone: { ...data.phone },
  address: { ...data.address },
  businessEntities: cloneBusinessEntities(data.businessEntities),
});

let inMemoryProfile: AccountProfileData | null = null;

const getLocalProfile = (): AccountProfileData => {
  if (!inMemoryProfile) {
    inMemoryProfile = cloneProfileData();
  }

  return cloneProfileData(inMemoryProfile);
};

const setLocalProfile = (profile: AccountProfileData): AccountProfileData => {
  inMemoryProfile = cloneProfileData(profile);
  return cloneProfileData(inMemoryProfile);
};

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
  businessEntities: (row.business_entities ?? []).map(toBusinessEntity),
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
    return getLocalProfile();
  }

  const { data, error } = await client
    .from<AccountProfileRow>(TABLE_NAME)
    .select('*')
    .eq('id', DEFAULT_ACCOUNT_ID)
    .maybeSingle();

  if (error) {
    console.warn('Unable to fetch profile from Supabase:', error.message);
    return setLocalProfile(ACCOUNT_PROFILE_DATA);
  }

  if (!data) {
    const fallback = cloneProfileData();
    await client
      .from(TABLE_NAME)
      .upsert(toRow(fallback), { onConflict: 'id' });
    return setLocalProfile(fallback);
  }

  const domainProfile = toDomain(data);
  return setLocalProfile(domainProfile);
};

export const updateAccountProfileSection = async (
  sectionId: string,
  values: Record<string, string>,
): Promise<AccountProfileData> => {
  const client = getSupabaseClient();
  if (!client) {
    const current = getLocalProfile();
    const merged = mergeSection(sectionId, current, values);
    return setLocalProfile(merged);
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
