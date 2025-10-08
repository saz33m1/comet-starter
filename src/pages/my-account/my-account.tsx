const BusinessEntityCard = ({
  entity,
  index,
  status,
  isProcessing,
  onSave,
  onRemove,
}: {
  entity: BusinessEntityState;
  index: number;
  status: SaveStatus;
  isProcessing: boolean;
  onSave: (values: BusinessEntityFormValues) => Promise<void>;
  onRemove: () => Promise<void>;
}): React.ReactElement => {
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
                    onRemove();
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
