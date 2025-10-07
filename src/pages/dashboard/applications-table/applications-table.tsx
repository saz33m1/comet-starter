import { DataTable } from '@metrostar/comet-extras';
import { Button, Icon } from '@metrostar/comet-uswds';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Case } from '@src/types';

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
  onNew?: () => void;
}

interface ApplicationTableData {
  applicationType: string;
  submissionDate: string;
  status: React.ReactElement;
  slaStatus: React.ReactElement;
  actions: React.ReactElement;
}

const APPLICATION_TYPE_ORDER = [
  'Building Permit',
  'Business License',
  'Professional Certification',
  'Event Permit',
  'Zoning Variance',
];

const SAMPLE_ROWS: ApplicationRow[] = [
  {
    id: 1001,
    applicationType: 'Building Permit',
    submissionDate: '03/15/2024',
    status: 'Submitted',
    slaStatus: 'In Progress (7 days left)',
    detailsUrl: '/cases/1000002',
  },
  {
    id: 1002,
    applicationType: 'Business License',
    submissionDate: '02/28/2024',
    status: 'Reviewed',
    slaStatus: 'At Risk (3 days left)',
    detailsUrl: '/cases/1000003',
  },
  {
    id: 1003,
    applicationType: 'Professional Certification',
    submissionDate: '02/10/2024',
    status: 'Approved',
    slaStatus: 'Met',
    detailsUrl: '/cases/1000004',
  },
  {
    id: 1004,
    applicationType: 'Event Permit',
    submissionDate: '01/29/2024',
    status: 'Rejected',
    slaStatus: 'Not Met',
    detailsUrl: '/cases/1000005',
  },
  {
    id: 1005,
    applicationType: 'Zoning Variance',
    submissionDate: '01/12/2024',
    status: 'Reviewed',
    slaStatus: 'In Progress (4 days left)',
    detailsUrl: '/cases/1000006',
  },
  {
    id: 1006,
    applicationType: 'Building Permit',
    submissionDate: '12/20/2023',
    status: 'Approved',
    slaStatus: 'Met',
    detailsUrl: '/cases/1000007',
  },
  {
    id: 1007,
    applicationType: 'Business License',
    submissionDate: '11/30/2023',
    status: 'Submitted',
    slaStatus: 'In Progress (10 days left)',
    detailsUrl: '/cases/1000008',
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
      detailsUrl: `/cases/${caseItem.id}`,
    };
  });

export const ApplicationsTable = ({ cases, onNew }: ApplicationsTableProps): React.ReactElement => {
  const [data, setData] = useState<ApplicationTableData[]>([]);

  useEffect(() => {
    const sourceRows = cases && cases.length > 0 ? mapCasesToApplicationRows(cases) : SAMPLE_ROWS;
    const mapped = sourceRows.map((row) => ({
      applicationType: row.applicationType,
      submissionDate: row.submissionDate,
      status: getStatusTag(row.status),
      slaStatus: getSlaIndicator(row.slaStatus, row.id),
      actions: (
        <NavLink id={`application-details-${row.id}`} to={row.detailsUrl}>
          View Details
        </NavLink>
      ),
    }));
    setData(mapped);
  }, [cases]);

  const columns = useMemo<ColumnDef<ApplicationTableData>[]>(
    () => [
      {
        accessorKey: 'applicationType',
        header: 'Application Type',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'submissionDate',
        header: 'Submission Date',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'slaStatus',
        header: 'SLA Status',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: (info) => info.getValue(),
      },
    ],
    [],
  );

  return (
    <section aria-labelledby="applications-heading">
      <div className="display-flex flex-justify flex-align-center">
        <h1 id="applications-heading">My Applications</h1>
        <Button
          id="new-application"
          type="button"
          onClick={onNew}
          className="margin-left-2"
        >
          <Icon id="new-application-icon" type="add" className="margin-right-05" />
          New Application
        </Button>
      </div>

      <div className="margin-top-2">
        <h2>Application Summary</h2>
        <DataTable
          id="applications-table"
          className="width-full"
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
