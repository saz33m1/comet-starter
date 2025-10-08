import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Form,
  TextInput,
} from '@metrostar/comet-uswds';
import {
  ACCOUNT_PROFILE_DATA,
  AccountProfileData,
} from '@src/data/my-account';
import { useForm } from '@tanstack/react-form';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchAccountProfile,
  updateAccountProfileSection,
} from '@src/services/account-profile-service';
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

type SaveStatus = 'idle' | 'success';

const SUCCESS_MESSAGE_TIMEOUT = 4000;

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

const cloneProfileData = (): AccountProfileData => ({
  name: { ...ACCOUNT_PROFILE_DATA.name },
  email: { ...ACCOUNT_PROFILE_DATA.email },
  phone: { ...ACCOUNT_PROFILE_DATA.phone },
  address: { ...ACCOUNT_PROFILE_DATA.address },
});

const buildInitialSaveStatus = (): Record<ProfileSectionId, SaveStatus> =>
  profileSections.reduce((accumulator, section) => {
    accumulator[section.id] = 'idle';
    return accumulator;
  }, {} as Record<ProfileSectionId, SaveStatus>);

interface ProfileSectionCardProps {
  section: ProfileSectionConfig;
  defaultValues: Record<string, string>;
  status: SaveStatus;
  onSave: (values: Record<string, string>) => void;
}

const ProfileSectionCard = ({
  section,
  defaultValues,
  status,
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
        {status === 'success' && (
          <Alert
            id={`${section.id}-success`}
            type="success"
            heading="Success"
            className="my-account-page__status"
          >
            Changes saved successfully.
          </Alert>
        )}
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
          <form.Subscribe selector={(state) => [state.isSubmitting, state.isDirty]}>
            {([isSubmitting, isDirty]) => (
              <ButtonGroup className="my-account-page__actions">
                <Button
                  id={`${section.id}-save`}
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                >
                  Save changes
                </Button>
                <Button
                  id={`${section.id}-reset`}
                  type="button"
                  variant="secondary"
                  disabled={!isDirty}
                  onClick={() => form.reset(defaultValues)}
                >
                  Reset
                </Button>
              </ButtonGroup>
            )}
          </form.Subscribe>
        </Form>
      </CardBody>
    </Card>
  );
};

const getSectionValues = (
  sectionId: ProfileSectionId,
  data: AccountProfileData,
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
  const [profileData, setProfileData] = useState<AccountProfileData>(() =>
    cloneProfileData(),
  );
  const [saveStatus, setSaveStatus] = useState<Record<ProfileSectionId, SaveStatus>>(
    () => buildInitialSaveStatus(),
  );
  const saveTimeouts = useRef<Record<ProfileSectionId, number>>({});

  useEffect(
    () => () => {
      Object.values(saveTimeouts.current).forEach((timeoutId) =>
        window.clearTimeout(timeoutId),
      );
    },
    [],
  );

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

    setSaveStatus((previous) => ({ ...previous, [sectionId]: 'success' }));

    if (saveTimeouts.current[sectionId]) {
      window.clearTimeout(saveTimeouts.current[sectionId]);
    }

    saveTimeouts.current[sectionId] = window.setTimeout(() => {
      setSaveStatus((previous) => ({ ...previous, [sectionId]: 'idle' }));
    }, SUCCESS_MESSAGE_TIMEOUT);
  };

  const sectionDefaults = useMemo(
    () =>
      profileSections.reduce((accumulator, section) => {
        accumulator[section.id] = getSectionValues(section.id, profileData);
        return accumulator;
      }, {} as Record<ProfileSectionId, Record<string, string>>),
    [profileData],
  );

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
                defaultValues={sectionDefaults[section.id]}
                status={saveStatus[section.id]}
                onSave={(values) => handleSave(section.id, values)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
