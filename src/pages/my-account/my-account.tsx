import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Form,
  TextInput,
} from '@metrostar/comet-uswds';
import { Spinner as CometSpinner } from '@metrostar/comet-extras';
import {
  ACCOUNT_PROFILE_DATA,
  AccountProfileData,
  BusinessEntityDetails,
} from '@src/data/my-account';
import { useForm } from '@tanstack/react-form';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchAccountProfile,
  updateAccountProfileSection,
  updateBusinessEntities,
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

type BusinessEntityFormValues = {
  entityName: string;
  entityType: string;
  registrationNumber: string;
  registeredAgentName: string;
  registeredAgentEmail: string;
  registeredAgentPhone: string;
  registeredAgentAddress: string;
};

type BusinessEntityState = BusinessEntityDetails & { isNew?: boolean };

type SaveStatus = 'idle' | 'success' | 'error';

const createEntityId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `entity-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const toEntityState = (
  entity: BusinessEntityDetails,
  isNew = false,
): BusinessEntityState => ({
  ...entity,
  registeredAgent: { ...entity.registeredAgent },
  isNew,
});

const mapEntitiesToState = (
  entities: BusinessEntityDetails[],
): BusinessEntityState[] => entities.map((entity) => toEntityState(entity));

const cloneEntityState = (entity: BusinessEntityState): BusinessEntityState =>
  toEntityState(
    {
      id: entity.id,
      entityName: entity.entityName,
      entityType: entity.entityType,
      registrationNumber: entity.registrationNumber,
      registeredAgent: { ...entity.registeredAgent },
    },
    entity.isNew ?? false,
  );

const stripBusinessEntityState = (
  entities: BusinessEntityState[],
): BusinessEntityDetails[] =>
  entities.map((entity) => ({
    id: entity.id,
    entityName: entity.entityName,
    entityType: entity.entityType,
    registrationNumber: entity.registrationNumber,
    registeredAgent: { ...entity.registeredAgent },
  }));

const createEmptyBusinessEntity = (): BusinessEntityState => ({
  id: createEntityId(),
  entityName: '',
  entityType: '',
  registrationNumber: '',
  registeredAgent: {
    name: '',
    email: '',
    phone: '',
    address: '',
  },
  isNew: true,
});

const toBusinessEntityFormValues = (
  entity: BusinessEntityDetails,
): BusinessEntityFormValues => ({
  entityName: entity.entityName,
  entityType: entity.entityType,
  registrationNumber: entity.registrationNumber,
  registeredAgentName: entity.registeredAgent.name,
  registeredAgentEmail: entity.registeredAgent.email,
  registeredAgentPhone: entity.registeredAgent.phone,
  registeredAgentAddress: entity.registeredAgent.address,
});

const fromBusinessEntityFormValues = (
  entityId: string,
  values: BusinessEntityFormValues,
): BusinessEntityDetails => ({
  id: entityId,
  entityName: values.entityName,
  entityType: values.entityType,
  registrationNumber: values.registrationNumber,
  registeredAgent: {
    name: values.registeredAgentName,
    email: values.registeredAgentEmail,
    phone: values.registeredAgentPhone,
    address: values.registeredAgentAddress,
  },
});

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
  businessEntities: ACCOUNT_PROFILE_DATA.businessEntities.map((entity) => ({
    ...entity,
    registeredAgent: { ...entity.registeredAgent },
  })),
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
  onSave: (values: Record<string, string>) => Promise<void>;
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
      await onSave(value);
    },
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <Card id={`my-account-card-${section.id}`} className="my-account-page__card">
      <CardBody>
        <h2 id={section.id}>{section.heading}</h2>
        <p>{section.description}</p>
        {status !== 'idle' && (
          <Alert
            id={`${section.id}-status`}
            type={status === 'error' ? 'error' : 'success'}
            heading={status === 'error' ? 'Save failed' : 'Success'}
            className="my-account-page__status"
          >
            {status === 'error'
              ? 'We could not save your changes. Please try again.'
              : 'Changes saved successfully.'}
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
                  variant="outline"
                  disabled={isSubmitting || !isDirty}
                >
                  Save changes
                </Button>
              </ButtonGroup>
            )}
          </form.Subscribe>
        </Form>
      </CardBody>
    </Card>
  );
};

interface BusinessEntityCardProps {
  entity: BusinessEntityState;
  index: number;
  status: SaveStatus;
  isProcessing: boolean;
  onSave: (values: BusinessEntityFormValues) => Promise<void>;
  onRemove: () => Promise<void>;
}

const BusinessEntityCard = ({
  entity,
  index,
  status,
  isProcessing,
  onSave,
  onRemove,
}: BusinessEntityCardProps): React.ReactElement => {
  const form = useForm<BusinessEntityFormValues>({
    defaultValues: toBusinessEntityFormValues(entity),
    onSubmit: async ({ value }) => {
      await onSave(value);
    },
  });

  useEffect(() => {
    form.reset(toBusinessEntityFormValues(entity));
  }, [entity, form]);

  const entityLabel = entity.entityName || `Business Entity ${index + 1}`;

  return (
    <Card
      id={`business-entity-card-${entity.id}`}
      className="my-account-page__entity-card"
      data-testid="business-entity-card"
    >
      <CardBody>
        <div className="my-account-page__entity-summary">
          <h3>{entityLabel}</h3>
        </div>
        {status !== 'idle' && (
          <Alert
            id={`business-entity-${entity.id}-status`}
            type={status === 'error' ? 'error' : 'success'}
            heading={status === 'error' ? 'Save failed' : 'Success'}
            className="my-account-page__status"
          >
            {status === 'error'
              ? 'We could not save this business entity. Please try again.'
              : 'Business entity saved successfully.'}
          </Alert>
        )}
        <Form
          id={`business-entity-form-${entity.id}`}
          className="my-account-page__entity-form"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <fieldset className="my-account-page__entity-fieldset">
            <legend>Entity information</legend>
            <form.Field name="entityName">
              {(fieldApi) => (
                <TextInput
                  id={`business-entity-${entity.id}-name`}
                  name="entityName"
                  label="Entity Name"
                  value={fieldApi.state.value}
                  onChange={(event) => fieldApi.handleChange(event.target.value)}
                  onBlur={fieldApi.handleBlur}
                />
              )}
            </form.Field>
            <form.Field name="entityType">
              {(fieldApi) => (
                <TextInput
                  id={`business-entity-${entity.id}-type`}
                  name="entityType"
                  label="Entity Type"
                  value={fieldApi.state.value}
                  onChange={(event) => fieldApi.handleChange(event.target.value)}
                  onBlur={fieldApi.handleBlur}
                />
              )}
            </form.Field>
            <form.Field name="registrationNumber">
              {(fieldApi) => (
                <TextInput
                  id={`business-entity-${entity.id}-registration`}
                  name="registrationNumber"
                  label="Registration Number"
                  value={fieldApi.state.value}
                  onChange={(event) => fieldApi.handleChange(event.target.value)}
                  onBlur={fieldApi.handleBlur}
                />
              )}
            </form.Field>
          </fieldset>
          <fieldset className="my-account-page__entity-fieldset">
            <legend>Registered agent</legend>
            <form.Field name="registeredAgentName">
              {(fieldApi) => (
                <TextInput
                  id={`business-entity-${entity.id}-agent-name`}
                  name="registeredAgentName"
                  label="Registered Agent Name"
                  value={fieldApi.state.value}
                  onChange={(event) => fieldApi.handleChange(event.target.value)}
                  onBlur={fieldApi.handleBlur}
                />
              )}
            </form.Field>
            <form.Field name="registeredAgentEmail">
              {(fieldApi) => (
                <TextInput
                  id={`business-entity-${entity.id}-agent-email`}
                  name="registeredAgentEmail"
                  label="Registered Agent Email"
                  type="email"
                  value={fieldApi.state.value}
                  onChange={(event) => fieldApi.handleChange(event.target.value)}
                  onBlur={fieldApi.handleBlur}
                />
              )}
            </form.Field>
            <form.Field name="registeredAgentPhone">
              {(fieldApi) => (
                <TextInput
                  id={`business-entity-${entity.id}-agent-phone`}
                  name="registeredAgentPhone"
                  label="Registered Agent Phone"
                  type="tel"
                  value={fieldApi.state.value}
                  onChange={(event) => fieldApi.handleChange(event.target.value)}
                  onBlur={fieldApi.handleBlur}
                />
              )}
            </form.Field>
            <form.Field name="registeredAgentAddress">
              {(fieldApi) => (
                <TextInput
                  id={`business-entity-${entity.id}-agent-address`}
                  name="registeredAgentAddress"
                  label="Registered Agent Address"
                  value={fieldApi.state.value}
                  onChange={(event) => fieldApi.handleChange(event.target.value)}
                  onBlur={fieldApi.handleBlur}
                />
              )}
            </form.Field>
          </fieldset>
          <form.Subscribe selector={(state) => [state.isSubmitting, state.isDirty]}>
            {([isSubmitting, isDirty]) => (
              <ButtonGroup className="my-account-page__entity-actions">
                <Button
                  id={`business-entity-${entity.id}-save`}
                  type="submit"
                  variant="outline"
                  disabled={isSubmitting || !isDirty || isProcessing}
                >
                  Save business entity
                </Button>
                <Button
                  id={`business-entity-${entity.id}-remove`}
                  type="button"
                  variant="secondary"
                  disabled={isSubmitting || isProcessing}
                  onClick={() => {
                    void onRemove();
                  }}
                >
                  Remove business entity
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
  const queryClient = useQueryClient();
  const [saveStatus, setSaveStatus] = useState<Record<ProfileSectionId, SaveStatus>>(
    () => buildInitialSaveStatus(),
  );
  const saveTimeouts = useRef<Record<ProfileSectionId, number>>({});
  const [businessEntities, setBusinessEntities] = useState<BusinessEntityState[]>(() =>
    mapEntitiesToState(cloneProfileData().businessEntities),
  );
  const [entitySaveStatus, setEntitySaveStatus] = useState<Record<string, SaveStatus>>({});
  const entitySaveTimeouts = useRef<Record<string, number>>({});

  useEffect(
    () => () => {
      Object.values(saveTimeouts.current).forEach((timeoutId) => window.clearTimeout(timeoutId));
    },
    [],
  );

  useEffect(
    () => () => {
      Object.values(entitySaveTimeouts.current).forEach((timeoutId) =>
        window.clearTimeout(timeoutId),
      );
    },
    [],
  );

  const { data: profileData, isLoading, isError } = useQuery({
    queryKey: ['account-profile'],
    queryFn: fetchAccountProfile,
    staleTime: 60_000,
  });

  useEffect(() => {
    const source = profileData ?? cloneProfileData();
    setBusinessEntities(mapEntitiesToState(source.businessEntities));
    setEntitySaveStatus((previous) => {
      const nextStatuses: Record<string, SaveStatus> = {};
      source.businessEntities.forEach((entity) => {
        nextStatuses[entity.id] = previous[entity.id] ?? 'idle';
      });

      Object.keys(entitySaveTimeouts.current).forEach((entityId) => {
        if (!source.businessEntities.some((entity) => entity.id === entityId)) {
          window.clearTimeout(entitySaveTimeouts.current[entityId]);
          delete entitySaveTimeouts.current[entityId];
        }
      });

      return nextStatuses;
    });
  }, [profileData]);

  const mutation = useMutation({
    mutationFn: ({
      sectionId,
      values,
    }: {
      sectionId: ProfileSectionId;
      values: Record<string, string>;
    }) => updateAccountProfileSection(sectionId, values),
    onSuccess: (updatedProfile, variables) => {
      queryClient.setQueryData(['account-profile'], updatedProfile);
      setSaveStatus((previous) => ({ ...previous, [variables.sectionId]: 'success' }));

      if (saveTimeouts.current[variables.sectionId]) {
        window.clearTimeout(saveTimeouts.current[variables.sectionId]);
      }

      saveTimeouts.current[variables.sectionId] = window.setTimeout(() => {
        setSaveStatus((previous) => ({ ...previous, [variables.sectionId]: 'idle' }));
      }, SUCCESS_MESSAGE_TIMEOUT);
    },
    onError: (_error, variables) => {
      setSaveStatus((previous) => ({ ...previous, [variables.sectionId]: 'error' }));

      if (saveTimeouts.current[variables.sectionId]) {
        window.clearTimeout(saveTimeouts.current[variables.sectionId]);
      }

      saveTimeouts.current[variables.sectionId] = window.setTimeout(() => {
        setSaveStatus((previous) => ({ ...previous, [variables.sectionId]: 'idle' }));
      }, SUCCESS_MESSAGE_TIMEOUT);
    },
  });

  const businessEntitiesMutation = useMutation({
    mutationFn: (entities: BusinessEntityDetails[]) => updateBusinessEntities(entities),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['account-profile'], updatedProfile);
      setBusinessEntities(mapEntitiesToState(updatedProfile.businessEntities));
      setEntitySaveStatus((previous) => {
        const nextStatuses: Record<string, SaveStatus> = {};
        updatedProfile.businessEntities.forEach((entity) => {
          nextStatuses[entity.id] = previous[entity.id] ?? 'idle';
        });
        return nextStatuses;
      });
    },
  });

  const setEntityStatusWithTimeout = (entityId: string, status: SaveStatus) => {
    setEntitySaveStatus((previous) => ({ ...previous, [entityId]: status }));
    if (entitySaveTimeouts.current[entityId]) {
      window.clearTimeout(entitySaveTimeouts.current[entityId]);
    }

    if (status !== 'idle') {
      entitySaveTimeouts.current[entityId] = window.setTimeout(() => {
        setEntitySaveStatus((previous) => ({ ...previous, [entityId]: 'idle' }));
        delete entitySaveTimeouts.current[entityId];
      }, SUCCESS_MESSAGE_TIMEOUT);
    } else {
      delete entitySaveTimeouts.current[entityId];
    }
  };

  const clearEntityStatus = (entityId: string) => {
    if (entitySaveTimeouts.current[entityId]) {
      window.clearTimeout(entitySaveTimeouts.current[entityId]);
      delete entitySaveTimeouts.current[entityId];
    }
    setEntitySaveStatus((previous) => {
      const { [entityId]: _removed, ...rest } = previous;
      return rest;
    });
  };

  const handleSave = async (
    sectionId: ProfileSectionId,
    values: Record<string, string>,
  ): Promise<void> => {
    await mutation.mutateAsync({ sectionId, values });
  };

  const sectionDefaults = useMemo(() => {
    const resolvedProfile = profileData ?? cloneProfileData();
    return profileSections.reduce((accumulator, section) => {
      accumulator[section.id] = getSectionValues(section.id, resolvedProfile);
      return accumulator;
    }, {} as Record<ProfileSectionId, Record<string, string>>);
  }, [profileData]);

  const handleAddEntity = (): void => {
    if (businessEntitiesMutation.isPending) {
      return;
    }
    const newEntity = createEmptyBusinessEntity();
    setBusinessEntities((previous) => [...previous, newEntity]);
    setEntitySaveStatus((previous) => ({ ...previous, [newEntity.id]: 'idle' }));
  };

  const handleSaveEntity = async (
    entityId: string,
    values: BusinessEntityFormValues,
  ): Promise<void> => {
    const previousEntities = businessEntities.map(cloneEntityState);
    const updatedDetails = fromBusinessEntityFormValues(entityId, values);
    const nextEntityState = toEntityState(updatedDetails, false);
    const nextEntities = businessEntities.map((entity) =>
      entity.id === entityId ? nextEntityState : cloneEntityState(entity),
    );

    setBusinessEntities(nextEntities);

    try {
      await businessEntitiesMutation.mutateAsync(stripBusinessEntityState(nextEntities));
      setEntityStatusWithTimeout(entityId, 'success');
    } catch (error) {
      setBusinessEntities(previousEntities);
      setEntityStatusWithTimeout(entityId, 'error');
      throw error;
    }
  };

  const handleRemoveEntity = async (entityId: string): Promise<void> => {
    const targetEntity = businessEntities.find((entity) => entity.id === entityId);
    if (!targetEntity) {
      return;
    }

    const previousEntities = businessEntities.map(cloneEntityState);
    const filteredEntities = businessEntities.filter((entity) => entity.id !== entityId);

    setBusinessEntities(filteredEntities);

    if (targetEntity.isNew) {
      clearEntityStatus(entityId);
      return;
    }

    try {
      await businessEntitiesMutation.mutateAsync(stripBusinessEntityState(filteredEntities));
      clearEntityStatus(entityId);
    } catch (error) {
      setBusinessEntities(previousEntities);
      setEntityStatusWithTimeout(entityId, 'error');
      throw error;
    }
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
              <li className="usa-sidenav__item">
                <a href="#business-entities">Business Entities</a>
              </li>
            </ul>
          </nav>
        </aside>
        <section className="grid-col-12 tablet:grid-col-8 my-account-page__content">
          <header className="my-account-page__header">
            <h1>My Account</h1>
            <p>Use this page to review and manage your account information.</p>
          </header>
          {isLoading ? (
            <div className="my-account-page__loading">
              <CometSpinner id="account-profile-loading" type="large" loadingText="Loading profile..." />
            </div>
          ) : isError ? (
            <Alert
              id="account-profile-error"
              type="error"
              heading="Unable to load profile"
              className="my-account-page__status"
            >
              We were unable to load your account information. Please verify your Supabase connection and try again.
            </Alert>
          ) : (
            <>
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
              <div id="business-entities" className="my-account-page__business-section">
                <div className="my-account-page__business-header">
                  <h2>Business Entities</h2>
                  <Button
                    id="add-business-entity"
                    type="button"
                    variant="outline"
                    onClick={handleAddEntity}
                    disabled={businessEntitiesMutation.isPending}
                  >
                    Add business entity
                  </Button>
                </div>
                <p className="my-account-page__business-description">
                  Maintain a record of the organizations you manage and keep their registered agent contact information up to date.
                </p>
                {businessEntities.length === 0 ? (
                  <p className="my-account-page__empty-entities">
                    No business entities have been added yet. Select “Add business entity” to create one.
                  </p>
                ) : (
                  <div className="my-account-page__entity-list">
                    {businessEntities.map((entity, index) => (
                      <BusinessEntityCard
                        key={entity.id}
                        entity={entity}
                        index={index}
                        status={entitySaveStatus[entity.id] ?? 'idle'}
                        isProcessing={businessEntitiesMutation.isPending}
                        onSave={(values) => handleSaveEntity(entity.id, values)}
                        onRemove={() => handleRemoveEntity(entity.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};
