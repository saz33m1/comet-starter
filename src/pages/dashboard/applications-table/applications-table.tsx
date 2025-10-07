import { DataTable } from '@metrostar/comet-extras';
import { Button, Icon } from '@metrostar/comet-uswds';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Case, Application } from '@src/types';
import './applications-table.scss';

export type ApplicationStatus = 'Approved' | 'Reviewed' | 'Submitted' | 'Rejected';

export interface ApplicationRow {
  id: number;
  applicationType: string;
  submissionDate: string;
  status: ApplicationStatus;
  slaStatus: string;
  detailsUrl: string;
}

interface ApplicationsTableProps {
  cases?: Case[];
  applications?: Application[];
  onNew?: () => void;
}

type ApplicationTableData = ApplicationRow;

const APPLICATION_TYPE_ORDER = [
  'Building Permit',
  'Business License',
  'Professional Certification',
  'Event Permit',
  'Zoning Variance',
];

const MAX_APPLICATION_ROWS = 6;

const SAMPLE_ROWS: ApplicationRow[] = [
  {
    id: 1000002,
    applicationType: 'Building Permit',
    submissionDate: '02/20/2024',
    status: 'Reviewed',
    slaStatus: 'In Progress (7 days left)',
    detailsUrl: '/applications/1000002',
  },
  {
    id: 1000003,
    applicationType: 'Business License',
    submissionDate: '02/28/2024',
    status: 'Submitted',
    slaStatus: 'At Risk (3 days left)',
    detailsUrl: '/applications/1000003',
  },
  {
    id: 1000004,
    applicationType: 'Professional Certification',
    submissionDate: '02/10/2024',
    status: 'Approved',
    slaStatus: 'Met',
    detailsUrl: '/applications/1000004',
  },
  {
    id: 1000005,
    applicationType: 'Event Permit',
    submissionDate: '01/29/2024',
    status: 'Rejected',
    slaStatus: 'Not Met',
    detailsUrl: '/applications/1000005',
  },
  {
    id: 1000006,
    applicationType: 'Zoning Variance',
    submissionDate: '01/12/2024',
    status: 'Rejected',
    slaStatus: 'Not Met',
    detailsUrl: '/applications/1000006',
  },
  {
    id: 1000007,
    applicationType: 'Building Permit',
    submissionDate: '12/20/2023',
    status: 'Approved',
    slaStatus: 'Met',
    detailsUrl: '/applications/1000007',
  },
];

const getStatusTag = (status: ApplicationStatus): React.ReactElement => {
  const statusClass = {
    Approved: 'bg-success-lighter text-success-darker',
    Reviewed: 'bg-success-lighter text-success-darker',
    Submitted: 'bg-warning-lighter text-warning-dark',
    Rejected: 'bg-error-lighter text-error-dark',
  }[status];

  return (
    <span className={`usa-tag text-uppercase ${statusClass}`} data-testid={`status-${status.toLowerCase()}`}>
      {status}
    </span>
  );
};

const getSlaIndicator = (slaStatus: string, key: string | number): React.ReactElement => {
  const normalized = slaStatus.toLowerCase();
  let iconType = 'check_circle';
  let iconClass = 'text-success';

  if (normalized.includes('not met')) {
    iconType = 'cancel';
    iconClass = 'text-error';
  } else if (normalized.includes('progress')) {
    iconType = 'schedule';
    iconClass = 'text-warning';
  } else if (normalized.includes('risk')) {
    iconType = 'warning';
    iconClass = 'text-warning-darker';
  }

  return (
    <span className="display-flex flex-align-center gap-1">
      <Icon id={`sla-icon-${key}`} type={iconType} className={iconClass} />
      <span>{slaStatus}</span>
    </span>
  );
};

const mapCaseStatusToApplicationStatus = (status: Case['status']): ApplicationStatus => {
  switch (status) {
    case 'Approved':
      return 'Approved';
    case 'Denied':
      return 'Rejected';
    case 'In Progress':
      return 'Reviewed';
    case 'Not Started':
    default:
      return 'Submitted';
  }
};

const deriveSlaStatus = (status: Case['status'], index: number): string => {
  switch (status) {
    case 'Approved':
      return 'Met';
    case 'Denied':
      return 'Not Met';
    case 'In Progress':
      return index % 2 === 0 ? 'In Progress (5 days left)' : 'At Risk (2 days left)';
    case 'Not Started':
    default:
      return 'In Progress (5 days left)';
  }
};

const mapCasesToApplicationRows = (cases: Case[]): ApplicationRow[] =>
  cases.map((caseItem, index) => {
    const label = APPLICATION_TYPE_ORDER[index % APPLICATION_TYPE_ORDER.length];
    const applicationStatus = mapCaseStatusToApplicationStatus(caseItem.status);

    return {
      id: caseItem.id,
      applicationType: label,
      submissionDate: new Date(caseItem.created_at).toLocaleDateString('en-US'),
      status: applicationStatus,
      slaStatus: deriveSlaStatus(caseItem.status, index),
      detailsUrl: `/applications/${caseItem.id}`,
    };
  });

const mapApplicationsToRows = (apps: Application[]): ApplicationRow[] =>
  apps.map((a) => ({
    id: a.id,
    applicationType: a.type,
    submissionDate: new Date(a.submission_date).toLocaleDateString('en-US'),
    status: a.status as ApplicationStatus,
    slaStatus:
      a.status === 'Approved'
        ? 'Met'
        : a.status === 'Rejected'
        ? 'Not Met'
        : 'In Progress (5 days left)',
    detailsUrl: `/applications/${a.id}`,
  }));

export const ApplicationsTable = ({ cases, applications, onNew }: ApplicationsTableProps): React.ReactElement => {
  const [data, setData] = useState<ApplicationTableData[]>([]);

  useEffect(() => {
    const fromApps = applications && applications.length > 0 ? mapApplicationsToRows(applications) : undefined;
    const fromCases = !fromApps && cases && cases.length > 0 ? mapCasesToApplicationRows(cases) : undefined;
    const sourceRows = fromApps || fromCases || SAMPLE_ROWS;
    const limited = sourceRows.slice(0, MAX_APPLICATION_ROWS);
    setData(limited);
  }, [applications, cases]);

  const columns = useMemo<ColumnDef<ApplicationTableData>[]>(
    () => [
      {
        accessorKey: 'applicationType',
        header: 'Application Type',
        cell: (info) => (
          <div className="applications-summary__cell" data-label="Application Type">
            <span>{info.getValue<string>()}</span>
          </div>
        ),
      },
      {
        accessorKey: 'submissionDate',
        header: 'Submission Date',
        cell: (info) => (
          <div className="applications-summary__cell" data-label="Submission Date">
            <span>{info.getValue<string>()}</span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <div className="applications-summary__cell" data-label="Status">
            {getStatusTag(row.original.status)}
          </div>
        ),
      },
      {
        accessorKey: 'slaStatus',
        header: 'SLA Status',
        cell: ({ row }) => (
          <div className="applications-summary__cell" data-label="SLA Status">
            {getSlaIndicator(row.original.slaStatus, row.original.id)}
          </div>
        ),
      },
      {
        accessorKey: 'detailsUrl',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="applications-summary__cell applications-summary__cell--actions" data-label="Actions">
            <NavLink id={`application-details-${row.original.id}`} to={row.original.detailsUrl}>
              View Details
            </NavLink>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <section className="applications-section" aria-labelledby="applications-heading">
      <div className="applications-header display-flex flex-align-center">
        <h1 id="applications-heading">My Applications</h1>
        <Button id="new-application" type="button" onClick={onNew} className="applications-header__cta">
          <Icon id="new-application-icon" type="add" className="margin-right-05" />
          New Application
        </Button>
      </div>

      <div className="applications-summary margin-top-2">
        <h2>Application Summary</h2>
        <DataTable
          id="applications-table"
          className="width-full applications-summary__table"
          columns={columns}
          data={data}
          sortable
          sortCol="applicationType"
          sortDir="asc"
          pageable
        />
      </div>
    </section>
  );
};

export default ApplicationsTable;
