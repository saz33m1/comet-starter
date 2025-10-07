import { Spinner } from '@metrostar/comet-extras';
import { Card, CardBody } from '@metrostar/comet-uswds';
import useCasesApi from '@src/hooks/use-cases-api';
import useApplicationsApi from '@src/hooks/use-applications-api';
import React from 'react';
import ErrorNotification from '../../components/error-notification/error-notification';
import ApplicationsTable from './applications-table/applications-table';

export const Dashboard = (): React.ReactElement => {
  const {
    getCases: { isLoading, data: items, error, isError },
  } = useCasesApi();

  const {
    getApplications: { data: apps },
  } = useApplicationsApi();

  return (
    <div className="grid-container">
      {isError && (
        <div className="grid-row padding-bottom-2">
          <div className="grid-col">
            <ErrorNotification error={error.message} />
          </div>
        </div>
      )}

      <Card id="applications-card">
        <CardBody>
          {isLoading ? (
            <Spinner id="spinner" type="small" loadingText="Loading..." />
          ) : (
            <ApplicationsTable applications={apps} />
          )}
        </CardBody>
      </Card>
    </div>
  );
};
