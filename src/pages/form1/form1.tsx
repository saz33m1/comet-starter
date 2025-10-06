import { Alert, Button, ButtonGroup, Form, TextInput } from '@metrostar/comet-uswds';
import { formatFieldError } from '@src/utils/form-utils';
import { useForm } from '@tanstack/react-form';
import React, { useState } from 'react';
import { z } from 'zod';

interface Form1Input {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const Form1 = (): React.ReactElement => {
  const [submitted, setSubmitted] = useState(false);

  const formSchema = z.object({
    firstName: z.string().min(1, 'This field is required.'),
    lastName: z.string().min(1, 'This field is required.'),
    email: z
      .string()
      .min(1, 'This field is required.')
      .email('Please enter a valid email address.'),
    phone: z
      .string()
      .min(1, 'This field is required.')
      .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Please enter a valid phone number.'),
  });

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    } as Form1Input,
    validators: { onChange: formSchema },
    onSubmit: async () => {
      setSubmitted(true);
    },
  });

  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="tablet:grid-col-8">
          <h1>Form 1</h1>
          {submitted && (
            <Alert id="form1-success" type="success" heading="Success">
              Your information has been submitted.
            </Alert>
          )}
          <Form
            id="form1-form"
            className="maxw-mobile-lg"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field name="firstName">
              {(field) => (
                <TextInput
                  id="first-name"
                  name="firstName"
                  label="First Name"
                  autoComplete="given-name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  errors={
                    field.state.meta.errors.length > 0
                      ? formatFieldError(field.state.meta.errors[0])
                      : undefined
                  }
                  autoFocus
                />
              )}
            </form.Field>

            <form.Field name="lastName">
              {(field) => (
                <TextInput
                  id="last-name"
                  name="lastName"
                  label="Last Name"
                  autoComplete="family-name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  errors={
                    field.state.meta.errors.length > 0
                      ? formatFieldError(field.state.meta.errors[0])
                      : undefined
                  }
                />
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  autoComplete="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  errors={
                    field.state.meta.errors.length > 0
                      ? formatFieldError(field.state.meta.errors[0])
                      : undefined
                  }
                />
              )}
            </form.Field>

            <form.Field name="phone">
              {(field) => (
                <TextInput
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone Number"
                  autoComplete="tel"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  errors={
                    field.state.meta.errors.length > 0
                      ? formatFieldError(field.state.meta.errors[0])
                      : undefined
                  }
                />
              )}
            </form.Field>

            <ButtonGroup id="form1-button-group">
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button id="form1-submit" type="submit" disabled={isSubmitting || !canSubmit}>
                    Submit
                  </Button>
                )}
              </form.Subscribe>
              <Button
                id="form1-reset"
                type="button"
                variant="secondary"
                onClick={() => {
                  form.reset();
                  setSubmitted(false);
                }}
              >
                Reset
              </Button>
            </ButtonGroup>
          </Form>
        </div>
      </div>
    </div>
  );
};
