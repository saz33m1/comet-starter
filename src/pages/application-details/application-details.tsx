import { Button, Card, CardBody, Icon } from '@metrostar/comet-uswds';
import useApplicationsApi from '@src/hooks/use-applications-api';
import React from 'react';
import { useParams } from 'react-router-dom';

export const ApplicationDetails = (): React.ReactElement => {
  const { id } = useParams();
  const { getApplication } = useApplicationsApi();
  const { isLoading, data } = getApplication(Number(id));

  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="grid-col">
          <div className="display-flex flex-row flex-justify">
            <div>
              <h1>Application: {id}</h1>
              <h2 style={{ fontSize: '18px' }}>Status: {data?.status ?? '—'}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col">
          {isLoading ? (
            <Spinner id="spinner" type="small" loadingText="Loading..." className="padding-top-2" />
          ) : data ? (
            <Card id="application-details-card">
              <CardBody>
                <div className="grid-row grid-gap-2">
                  <div className="grid-col-12 tablet:grid-col-6 desktop:grid-col-4 margin-bottom-2">
                    <strong>Type</strong>
                    <div>{data.type}</div>
                  </div>
                  <div className="grid-col-12 tablet:grid-col-6 desktop:grid-col-4 margin-bottom-2">
                    <strong>Submission Date</strong>
                    <div>{new Date(data.submission_date).toLocaleDateString('en-US')}</div>
                  </div>
                  <div className="grid-col-12 tablet:grid-col-6 desktop:grid-col-4 margin-bottom-2">
                    <strong>Applicant</strong>
                    <div>{data.applicant_name ?? 'N/A'}</div>
                  </div>
                  <div className="grid-col-12 margin-bottom-2">
                    <strong>Description</strong>
                    <div>{data.description ?? 'No description provided.'}</div>
                  </div>
                </div>
              </CardBody>
            </Card>
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
