import { Spinner } from '@metrostar/comet-extras';
import { Card, CardBody, Icon } from '@metrostar/comet-uswds';
import useApplicationsApi from '@src/hooks/use-applications-api';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApplicationStep, ApplicationStatusType } from '@src/types';
import './application-details.scss';

const statusClassMap: Partial<Record<ApplicationStatusType, string>> = {
  Approved: 'usa-tag bg-success-lighter text-success-darker text-uppercase',
  Reviewed: 'usa-tag bg-success-lighter text-success-darker text-uppercase',
  Submitted: 'usa-tag bg-warning-lighter text-warning-dark text-uppercase',
  Rejected: 'usa-tag bg-error-lighter text-error-dark text-uppercase',
};

export const ApplicationDetails = (): React.ReactElement => {
  const { id } = useParams();
  const { getApplication } = useApplicationsApi();
  const { isLoading, data } = getApplication(Number(id));
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);

  useEffect(() => {
    if (data?.steps?.length) {
      setExpandedSteps([data.steps[0].id]);
    } else {
      setExpandedSteps([]);
    }
  }, [data]);

  const toggleStep = (stepId: string): void => {
    setExpandedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((idValue) => idValue !== stepId) : [...prev, stepId],
    );
  };

  const formattedSteps = useMemo<ApplicationStep[]>(() => data?.steps ?? [], [data]);

  const statusClass = data?.status ? statusClassMap[data.status] ?? 'usa-tag text-uppercase' : 'usa-tag text-uppercase';

  return (
    <div className="grid-container" id="application-details">
      <div className="grid-row">
        <div className="grid-col">
          <div className="application-details__header display-flex flex-row flex-justify">
            <div>
              <h1 className="application-details__title">Application: {id}</h1>
              <div className="application-details__status-wrapper">
                <span className={statusClass} data-testid="application-status-tag">
                  {data?.status ?? 'Unknown'}
                </span>
                {data?.reference_number && (
                  <span className="application-details__reference">Reference #{data.reference_number}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col">
          {isLoading ? (
            <Spinner id="spinner" type="small" loadingText="Loading..." className="padding-top-2" />
          ) : data ? (
            <>
              <Card id="application-details-card">
                <CardBody>
                  <div className="grid-row grid-gap-2">
                    <div className="grid-col-12 tablet:grid-col-6 desktop:grid-col-3">
                      <p className="application-details__summary-label">Type</p>
                      <p className="application-details__summary-value">{data.type}</p>
                    </div>
                    <div className="grid-col-12 tablet:grid-col-6 desktop:grid-col-3">
                      <p className="application-details__summary-label">Submission Date</p>
                      <p className="application-details__summary-value">
                        {new Date(data.submission_date).toLocaleDateString('en-US')}
                      </p>
                    </div>
                    <div className="grid-col-12 tablet:grid-col-6 desktop:grid-col-3">
                      <p className="application-details__summary-label">Submitted Via</p>
                      <p className="application-details__summary-value">{data.submission_channel ?? '—'}</p>
                    </div>
                    <div className="grid-col-12 tablet:grid-col-6 desktop:grid-col-3">
                      <p className="application-details__summary-label">Applicant</p>
                      <p className="application-details__summary-value">{data.applicant_name ?? 'N/A'}</p>
                    </div>
                    <div className="grid-col-12">
                      <p className="application-details__summary-label">Summary</p>
                      <p className="application-details__summary-value">{data.description ?? 'No description provided.'}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <section aria-label="Application submission details" className="application-details__steps">
                <h2 className="application-details__steps-title">Submission Details</h2>
                <div
                  className="usa-accordion"
                  aria-multiselectable="true"
                  data-testid="application-details-accordion"
                >
                  {formattedSteps.length > 0 ? (
                    formattedSteps.map((step, index) => {
                      const isOpen = expandedSteps.includes(step.id);
                      const buttonId = `application-step-button-${step.id}`;
                      const panelId = `application-step-panel-${step.id}`;

                      return (
                        <div className="application-details__step" key={step.id}>
                          <h3 className="usa-accordion__heading">
                            <button
                              id={buttonId}
                              type="button"
                              className="usa-accordion__button"
                              aria-expanded={isOpen}
                              aria-controls={panelId}
                              onClick={() => toggleStep(step.id)}
                            >
                              <span className="application-details__step-count">Step {index + 1}</span>
                              <span className="application-details__step-title">{step.title}</span>
                            </button>
                          </h3>
                          <div
                            id={panelId}
                            className="usa-accordion__content application-details__step-content"
                            role="region"
                            aria-labelledby={buttonId}
                            hidden={!isOpen}
                          >
                            {step.description && (
                              <p className="application-details__step-description">{step.description}</p>
                            )}
                            <dl className="application-details__fields">
                              {step.fields.map((field) => (
                                <div className="application-details__field" key={`${step.id}-${field.label}`}>
                                  <dt className="application-details__field-label">{field.label}</dt>
                                  <dd className="application-details__field-value">{field.value}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="application-details__no-steps">No submission details available.</p>
                  )}
                </div>
              </section>
            </>
          ) : (
            <div className="margin-top-2">
              <Icon id="not-found-icon" type="error" className="text-error" /> Application not found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
