import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Form,
  TextInput,
} from '@metrostar/comet-uswds';
import { ACCOUNT_PROFILE_DATA } from '@src/data/my-account';
import { useForm } from '@tanstack/react-form';
import React, { useEffect, useState } from 'react';
import './my-account.scss';

type ProfileSectionId =
  | 'profile-name'
  | 'profile-email'
  | 'profile-phone'
  | 'profile-address';

type ProfileFieldConfig = {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
};

type ProfileSectionConfig = {
  id: ProfileSectionId;
  heading: string;
  description: string;
  fields: ProfileFieldConfig[];
};

const profileSections: ProfileSectionConfig[] = [
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

interface ProfileSectionCardProps {
  section: ProfileSectionConfig;
  defaultValues: Record<string, string>;
  onSave: (values: Record<string, string>) => void;
}

const ProfileSectionCard = ({
  section,
  defaultValues,
  onSave,
}: ProfileSectionCardProps): React.ReactElement => {
  const form = useForm<Record<string, string>>({
    defaultValues,
    onSubmit: async ({ value }) => {
      onSave(value);
    },
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <Card
      id={`my-account-card-${section.id}`}
      className="my-account-page__card"
    >
      <CardBody>
        <h2 id={section.id}>{section.heading}</h2>
        <p>{section.description}</p>
        <Form
          id={`${section.id}-form`}
          className="my-account-page__form"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          {section.fields.map((field) => (
            <form.Field key={field.name} name={field.name}>
              {(fieldApi) => (
                <TextInput
                  id={`${section.id}-${field.name}`}
                  name={field.name}
                  label={field.label}
                  type={field.type ?? 'text'}
                  autoComplete={field.autoComplete}
                  value={fieldApi.state.value}
                  onChange={(event) => fieldApi.handleChange(event.target.value)}
                  onBlur={fieldApi.handleBlur}
                />
              )}
            </form.Field>
          ))}
          <ButtonGroup className="my-account-page__actions">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  id={`${section.id}-save`}
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                >
                  Save changes
                </Button>
              )}
            </form.Subscribe>
            <Button
              id={`${section.id}-reset`}
              type="button"
              variant="secondary"
              onClick={() => form.reset(defaultValues)}
            >
              Reset
            </Button>
          </ButtonGroup>
        </Form>
      </CardBody>
    </Card>
  );
};

const getSectionValues = (
  sectionId: ProfileSectionId,
  data: typeof ACCOUNT_PROFILE_DATA,
): Record<string, string> => {
  switch (sectionId) {
    case 'profile-name':
      return { ...data.name };
    case 'profile-email':
      return { ...data.email };
    case 'profile-phone':
      return { ...data.phone };
    case 'profile-address':
    default:
      return { ...data.address };
  }
};

export const MyAccount = (): React.ReactElement => {
  const [profileData, setProfileData] = useState(ACCOUNT_PROFILE_DATA);

  const handleSave = (
    sectionId: ProfileSectionId,
    values: Record<string, string>,
  ): void => {
    setProfileData((previous) => {
      switch (sectionId) {
        case 'profile-name':
          return { ...previous, name: { ...previous.name, ...values } };
        case 'profile-email':
          return { ...previous, email: { ...previous.email, ...values } };
        case 'profile-phone':
          return { ...previous, phone: { ...previous.phone, ...values } };
        case 'profile-address':
        default:
          return { ...previous, address: { ...previous.address, ...values } };
      }
    });
  };

  return (
    <div className="grid-container my-account-page">
      <div className="grid-row grid-gap-4 my-account-page__layout">
        <aside className="grid-col-12 tablet:grid-col-4 my-account-page__sidenav">
          <nav className="usa-sidenav" aria-label="Account navigation">
            <ul className="usa-sidenav__list">
              {profileSections.map((section, index) => (
                <li key={section.id} className="usa-sidenav__item">
                  <a
                    className={index === 0 ? 'usa-current' : ''}
                    href={`#${section.id}`}
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <section className="grid-col-12 tablet:grid-col-8 my-account-page__content">
          <header className="my-account-page__header">
            <h1>My Account</h1>
            <p>Use this page to review and manage your account information.</p>
          </header>
          <div className="my-account-page__cards">
            {profileSections.map((section) => (
              <ProfileSectionCard
                key={section.id}
                section={section}
                defaultValues={getSectionValues(section.id, profileData)}
                onSave={(values) => handleSave(section.id, values)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
