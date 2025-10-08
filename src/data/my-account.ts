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

export interface BusinessEntityRegisteredAgentDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface BusinessEntityDetails {
  id: string;
  entityName: string;
  entityType: string;
  registrationNumber: string;
  registeredAgent: BusinessEntityRegisteredAgentDetails;
}

export interface AccountProfileData {
  name: AccountNameDetails;
  email: AccountEmailDetails;
  phone: AccountPhoneDetails;
  address: AccountAddressDetails;
  businessEntities: BusinessEntityDetails[];
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
  businessEntities: [
    {
      id: 'entity-0001',
      entityName: 'Metro Innovators LLC',
      entityType: 'Limited Liability Company',
      registrationNumber: 'LLC-123456',
      registeredAgent: {
        name: 'Jamie Rivera',
        email: 'jamie.rivera@example.gov',
        phone: '(555) 901-2345',
        address: '789 Innovation Way, Washington, DC 20001',
      },
    },
  ],
};
