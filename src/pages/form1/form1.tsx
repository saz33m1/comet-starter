import { Alert, Button, ButtonGroup, Checkbox, Form, TextInput } from '@metrostar/comet-uswds';
import { formatFieldError } from '@src/utils/form-utils';
import { useForm } from '@tanstack/react-form';
import React, { useState } from 'react';
import { z } from 'zod';

interface Form1Input {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zip?: string;
  attachmentUrl?: string;
  paymentReference?: string;
  certifyAcknowledgement?: boolean;
}

export const Form1 = (): React.ReactElement => {
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { id: 'applicant', label: 'Applicant Information' },
    { id: 'business', label: 'Business / Facility Details' },
    { id: 'attachments', label: 'Attachments' },
    { id: 'payment', label: 'Fees & Payment' },
    { id: 'review', label: 'Review & Submit' },
  ];
  const handleNext = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Final step submits the form
      // Using tanstack form submit handler
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      form.handleSubmit();
    }
  };

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
    businessName: z.string().optional().or(z.literal('')),
    addressLine1: z.string().optional().or(z.literal('')),
    city: z.string().optional().or(z.literal('')),
    state: z.string().optional().or(z.literal('')),
    zip: z.string().optional().or(z.literal('')),
    attachmentUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
    paymentReference: z.string().optional().or(z.literal('')),
    certifyAcknowledgement: z.boolean().optional(),
  });

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      businessName: '',
      addressLine1: '',
      city: '',
      state: '',
      zip: '',
      attachmentUrl: '',
      paymentReference: '',
      certifyAcknowledgement: false,
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
          <div id="form1-steps" className="usa-step-indicator" aria-label="progress">
            <ol className="usa-step-indicator__segments">
              {steps.map((s, idx) => (
                <li
                  key={s.id}
                  id={`step-${s.id}`}
                  className={`usa-step-indicator__segment ${idx < currentStep ? 'usa-step-indicator__segment--complete' : ''} ${idx === currentStep ? 'usa-current' : ''}`}
                  aria-current={idx === currentStep ? 'true' : undefined}
                >
                  <span className="usa-step-indicator__segment-label">{s.label}</span>
                </li>
              ))}
            </ol>
          </div>
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
            {currentStep === 0 && (
              <>
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
              </>
            )}

            <div className={currentStep === 1 ? '' : 'display-none'}>
            <h2 id="business-details-heading" className="margin-top-2">Business / Facility Details</h2>
            <form.Field name="businessName">
              {(field) => (
                <TextInput
                  id="business-name"
                  name="businessName"
                  label="Business or Facility Name"
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
            <form.Field name="addressLine1">
              {(field) => (
                <TextInput
                  id="address-line1"
                  name="addressLine1"
                  label="Street Address"
                  autoComplete="address-line1"
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
            <div className="grid-row grid-gap">
              <div className="grid-col-6">
                <form.Field name="city">
                  {(field) => (
                    <TextInput
                      id="city"
                      name="city"
                      label="City"
                      autoComplete="address-level2"
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
              </div>
              <div className="grid-col-3">
                <form.Field name="state">
                  {(field) => (
                    <TextInput
                      id="state"
                      name="state"
                      label="State"
                      autoComplete="address-level1"
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
              </div>
              <div className="grid-col-3">
                <form.Field name="zip">
                  {(field) => (
                    <TextInput
                      id="zip"
                      name="zip"
                      label="ZIP Code"
                      autoComplete="postal-code"
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
              </div>
            </div>
            </div>

            <div className={currentStep === 2 ? '' : 'display-none'}>
            <h2 id="attachments-heading" className="margin-top-2">Attachments</h2>
            <form.Field name="attachmentUrl">
              {(field) => (
                <TextInput
                  id="attachment-url"
                  name="attachmentUrl"
                  type="url"
                  label="Attachment URL"
                  hint="Provide a link to supporting documents (PDF, images)"
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
            </div>

            <div className={currentStep === 3 ? '' : 'display-none'}>
            <h2 id="payment-heading" className="margin-top-2">Fees & Payment</h2>
            <form.Field name="paymentReference">
              {(field) => (
                <TextInput
                  id="payment-reference"
                  name="paymentReference"
                  label="Payment Reference Number"
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
            </div>

            <div className={currentStep === 4 ? '' : 'display-none'}>
            <h2 id="review-heading" className="margin-top-2">Review & Submit</h2>
            <form.Field name="certifyAcknowledgement">
              {(field) => (
                <Checkbox
                  id="certify-ack"
                  name="certifyAcknowledgement"
                  label="I certify the information provided is true and correct."
                  checked={Boolean(field.state.value)}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
              )}
            </form.Field>
            </div>

            <ButtonGroup id="form1-button-group">
              <form.Subscribe selector={(state) => [state.isSubmitting]}>
                {([isSubmitting]) => (
                  <Button id="form1-next" type="button" onClick={handleNext} disabled={isSubmitting}>
                    {currentStep < steps.length - 1 ? 'Next' : 'Submit'}
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
