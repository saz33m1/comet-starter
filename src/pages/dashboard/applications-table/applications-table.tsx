import { DataTable } from '@metrostar/comet-extras';
import { Button } from '@metrostar/comet-uswds';
import React from 'react';
import { NavLink } from 'react-router-dom';

export type ApplicationStatus = 'Approved' | 'Pending' | 'Rejected';

export interface ApplicationRow {
  id: number;
  type: string; // Permit, License, Certification
  submissionDate: string; // MM/DD/YYYY
  status: ApplicationStatus;
  slaStatus: string; // Met, In Progress, Not Met, At Risk
  detailsUrl: string;
}

interface ApplicationsTableProps {
  items?: ApplicationRow[];
  onNew?: () => void;
}

// Basic sample data to display when no items provided
const SAMPLE_ROWS: ApplicationRow[] = [
  {
    id: 1001,
    type: 'Building Permit',
    submissionDate: '03/15/2024',
    status: 'Approved',
    slaStatus: 'Met',
    detailsUrl: '/cases/1000002',
  },
  {
    id: 1002,
    type: 'Business License',
    submissionDate: '02/20/2024',
    status: 'Pending',
    slaStatus: 'In Progress (5 days left)',
    detailsUrl: '/cases/1000003',
  },
  {
    id: 1003,
    type: 'Professional Certification',
    submissionDate: '01/10/2024',
    status: 'Rejected',
    slaStatus: 'Not Met',
    detailsUrl: '/cases/1000004',
  },
  {
    id: 1004,
    type: 'Event Permit',
    submissionDate: '12/05/2023',
    status: 'Approved',
    slaStatus: 'Met',
    detailsUrl: '/cases/1000005',
  },
  {
    id: 1005,
    type: 'Zoning Variance',
    submissionDate: '11/15/2023',
    status: 'Pending',
    slaStatus: 'At Risk (2 days left)',
    detailsUrl: '/cases/1000006',
  },
];

export const ApplicationsTable = ({ items, onNew }: ApplicationsTableProps): React.ReactElement => {
  const data = items && items.length > 0 ? items : SAMPLE_ROWS;

  const columns = [
    {
      header: 'Application Type',
      accessorKey: 'type',
      cell: (info: any) => info.getValue(),
    },
    {
      header: 'Submission Date',
      accessorKey: 'submissionDate',
      cell: (info: any) => info.getValue(),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (info: any) => info.getValue(),
    },
    {
      header: 'SLA Status',
      accessorKey: 'slaStatus',
      cell: (info: any) => info.getValue(),
    },
    {
      header: 'Actions',
      accessorKey: 'detailsUrl',
      cell: (info: any) => {
        const url = info.getValue() as string;
        return (
          <NavLink id={`application-details-${info.row.index}`} to={url}>
            View Details
          </NavLink>
        );
      },
    },
  ];

  return (
    <div>
      <div className="display-flex flex-justify">
        <div>
          <h1>My Applications</h1>
        </div>
        <div>
          <Button id="new-application" type="button">
            New Application
          </Button>
        </div>
      </div>

      <div className="margin-top-2">
        <h2>Application Summary</h2>
        <DataTable
          id="applications-table"
          className="width-full"
          columns={columns as any}
          data={data as any}
          sortable
          pageable
        />
      </div>
    </div>
  );
};

export default ApplicationsTable;
