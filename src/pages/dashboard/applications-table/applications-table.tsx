import { DataTable } from '@metrostar/comet-extras';
import { Button, Icon } from '@metrostar/comet-uswds';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Case } from '@src/types';

export type ApplicationStatus = 'Approved' | 'Pending' | 'Rejected';

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
    status: 'Approved',
    slaStatus: 'Met',
    detailsUrl: '/cases/1000002',
  },
  {
    id: 1002,
    applicationType: 'Business License',
    submissionDate: '02/20/2024',
    status: 'Pending',
    slaStatus: 'In Progress (5 days left)',
    detailsUrl: '/cases/1000003',
  },
  {
    id: 1003,
    applicationType: 'Professional Certification',
    submissionDate: '01/10/2024',
    status: 'Rejected',
    slaStatus: 'Not Met',
    detailsUrl: '/cases/1000004',
  },
  {
    id: 1004,
    applicationType: 'Event Permit',
    submissionDate: '12/05/2023',
    status: 'Approved',
    slaStatus: 'Met',
    detailsUrl: '/cases/1000005',
  },
  {
    id: 1005,
    applicationType: 'Zoning Variance',
    submissionDate: '11/15/2023',
    status: 'Pending',
    slaStatus: 'At Risk (2 days left)',
    detailsUrl: '/cases/1000006',
  },
];

const getStatusTag = (status: ApplicationStatus): React.ReactElement => {
  const statusClass = {
    Approved: 'bg-success-darker',
    Pending: 'bg-warning-dark',
    Rejected: 'bg-error-dark',
  }[status];

  return (
    <span className={`usa-tag text-uppercase ${statusClass}`} data-testid={`status-${status.toLowerCase()}`}>
      {status}
    </span>
  );
};

const getSlaIndicator = (slaStatus: string, index: number): React.ReactElement => {
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
      <Icon id={`sla-icon-${index}`} type={iconType} className={iconClass} />
      <span>{slaStatus}</span>
    </span>
  );
};

export const ApplicationsTable = ({ items, onNew }: ApplicationsTableProps): React.ReactElement => {
  const [data, setData] = useState<ApplicationTableData[]>([]);
  const rows = items && items.length > 0 ? items : SAMPLE_ROWS;

  useEffect(() => {
    const mapped = rows.map((row, idx) => ({
      applicationType: row.applicationType,
      submissionDate: row.submissionDate,
      status: getStatusTag(row.status),
      slaStatus: getSlaIndicator(row.slaStatus, idx),
      actions: (
        <NavLink id={`application-details-${row.id}`} to={row.detailsUrl}>
          View Details
        </NavLink>
      ),
    }));
    setData(mapped);
  }, [rows]);

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
