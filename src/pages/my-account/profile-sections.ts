export type ProfileSectionId =
  | 'profile-name'
  | 'profile-email'
  | 'profile-phone'
  | 'profile-address';

export type ProfileFieldConfig = {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
};

export type ProfileSectionConfig = {
  id: ProfileSectionId;
  heading: string;
  description: string;
  fields: ProfileFieldConfig[];
};

export const PROFILE_SECTIONS: ProfileSectionConfig[] = [
  {
    id: 'profile-name',
    heading: 'Name',
    description:
      'Review the legal and preferred names associated with your account. Ensure these details match your official documentation.',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        autoComplete: 'given-name',
      },
      {
        name: 'middleName',
        label: 'Middle Name',
        autoComplete: 'additional-name',
      },
      {
        name: 'lastName',
        label: 'Last Name',
        autoComplete: 'family-name',
      },
    ],
  },
  {
    id: 'profile-email',
    heading: 'Email',
    description:
      'Confirm your primary email address and add alternate addresses to stay informed about application updates.',
    fields: [
      {
        name: 'primaryEmail',
        label: 'Primary Email',
        type: 'email',
        autoComplete: 'email',
      },
      {
        name: 'alternateEmail',
        label: 'Alternate Email',
        type: 'email',
        autoComplete: 'email',
      },
    ],
  },
  {
    id: 'profile-phone',
    heading: 'Phone',
    description:
      'Keep your primary phone number current so our team can reach you about time-sensitive notices or approvals.',
    fields: [
      {
        name: 'primaryPhone',
        label: 'Primary Phone',
        type: 'tel',
        autoComplete: 'tel',
      },
      {
        name: 'alternatePhone',
        label: 'Alternate Phone',
        type: 'tel',
        autoComplete: 'tel',
      },
    ],
  },
  {
    id: 'profile-address',
    heading: 'Residential Address',
    description:
      'Maintain an up-to-date residential address to ensure all mailed correspondence reaches you without delay.',
    fields: [
      {
        name: 'addressLine1',
        label: 'Address Line 1',
        autoComplete: 'address-line1',
      },
      {
        name: 'addressLine2',
        label: 'Address Line 2',
        autoComplete: 'address-line2',
      },
      {
        name: 'city',
        label: 'City',
        autoComplete: 'address-level2',
      },
      {
        name: 'state',
        label: 'State',
        autoComplete: 'address-level1',
      },
      {
        name: 'postalCode',
        label: 'ZIP Code',
        autoComplete: 'postal-code',
      },
    ],
  },
];
