export interface AccountNameDetails {
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface AccountEmailDetails {
  primaryEmail: string;
  alternateEmail: string;
}

export interface AccountPhoneDetails {
  primaryPhone: string;
  alternatePhone: string;
}

export interface AccountAddressDetails {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface AccountProfileData {
  name: AccountNameDetails;
  email: AccountEmailDetails;
  phone: AccountPhoneDetails;
  address: AccountAddressDetails;
}

export const ACCOUNT_PROFILE_DATA: AccountProfileData = {
  name: {
    firstName: 'Jordan',
    middleName: 'Avery',
    lastName: 'Smith',
  },
  email: {
    primaryEmail: 'jordan.smith@example.gov',
    alternateEmail: 'j.smith@agency.gov',
  },
  phone: {
    primaryPhone: '(555) 867-5309',
    alternatePhone: '(555) 555-1212',
  },
  address: {
    addressLine1: '123 Constitution Ave NW',
    addressLine2: 'Suite 400',
    city: 'Washington',
    state: 'DC',
    postalCode: '20500',
  },
};
