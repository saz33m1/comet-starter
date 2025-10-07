import { Application, ApplicationItems } from '@src/types';

export const applications: Application[] = [
  {
    id: 1000002,
    type: 'Building Permit',
    status: 'Reviewed',
    submission_date: new Date('2024-02-20T10:00:00Z'),
    applicant_name: 'Michael Chen',
    description: 'Residential deck extension permit application.',
  },
  {
    id: 1000003,
    type: 'Business License',
    status: 'Submitted',
    submission_date: new Date('2024-02-28T10:00:00Z'),
    applicant_name: 'Jessica Martinez',
    description: 'New retail business license application.',
  },
  {
    id: 1000004,
    type: 'Professional Certification',
    status: 'Approved',
    submission_date: new Date('2024-02-10T10:00:00Z'),
    applicant_name: 'David Williams',
    description: 'Professional engineer certification renewal.',
  },
  {
    id: 1000005,
    type: 'Event Permit',
    status: 'Rejected',
    submission_date: new Date('2024-01-29T10:00:00Z'),
    applicant_name: 'Alicia Thompson',
    description: 'Community festival permit for downtown park.',
  },
  {
    id: 1000006,
    type: 'Zoning Variance',
    status: 'Rejected',
    submission_date: new Date('2024-01-12T10:00:00Z'),
    applicant_name: 'Robert Kim',
    description: 'Variance request for setback requirements.',
  },
  {
    id: 1000007,
    type: 'Building Permit',
    status: 'Approved',
    submission_date: new Date('2023-12-20T10:00:00Z'),
    applicant_name: 'Emily Garcia',
    description: 'Kitchen renovation building permit.',
  },
];

export const applicationData: ApplicationItems = {
  items: applications,
};
