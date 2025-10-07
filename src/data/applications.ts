import { Application, ApplicationItems } from '@src/types';

export const applications: Application[] = [
  {
    id: 1000002,
    type: 'Building Permit',
    status: 'Reviewed',
    submission_date: new Date('2024-02-20T10:00:00Z'),
    applicant_name: 'Michael Chen',
    description: 'Residential deck extension permit application.',
    reference_number: 'BP-2024-0315',
    submission_channel: 'Online Portal',
    steps: [
      {
        id: 'applicant',
        title: 'Applicant Information',
        fields: [
          { label: 'Applicant Name', value: 'Michael Chen' },
          { label: 'Email', value: 'michael.chen@example.com' },
          { label: 'Phone', value: '(202) 555-0104' },
          { label: 'Mailing Address', value: '7428 Cedar Crest Dr, Fairfax, VA 22030' },
        ],
      },
      {
        id: 'project-details',
        title: 'Project Details',
        description: 'Information about the residential deck extension.',
        fields: [
          { label: 'Property Address', value: '7428 Cedar Crest Dr, Fairfax, VA 22030' },
          { label: 'Parcel Number', value: '0123-45-6789' },
          { label: 'Construction Type', value: 'Deck Extension' },
          { label: 'Estimated Cost', value: '$18,500' },
        ],
      },
      {
        id: 'attachments',
        title: 'Supporting Documents',
        fields: [
          { label: 'Site Plan', value: 'site-plan-deck-extension.pdf' },
          { label: 'Structural Drawings', value: 'structural-drawings.pdf' },
          { label: 'Homeowners Association Approval', value: 'hoa-approval-letter.pdf' },
        ],
      },
      {
        id: 'fees',
        title: 'Fees & Payment',
        fields: [
          { label: 'Application Fee', value: '$120.00' },
          { label: 'Payment Reference', value: 'PAY-648213' },
          { label: 'Payment Date', value: '02/18/2024' },
        ],
      },
    ],
  },
  {
    id: 1000003,
    type: 'Business License',
    status: 'Submitted',
    submission_date: new Date('2024-02-28T10:00:00Z'),
    applicant_name: 'Jessica Martinez',
    description: 'New retail business license application.',
    reference_number: 'BL-2024-0442',
    submission_channel: 'Clerk Counter',
    steps: [
      {
        id: 'owner-info',
        title: 'Owner Information',
        fields: [
          { label: 'Owner Name', value: 'Jessica Martinez' },
          { label: 'Business Name', value: 'Martinez Home Goods, LLC' },
          { label: 'Email', value: 'jessica.martinez@martinezhomegoods.com' },
          { label: 'Primary Phone', value: '(571) 555-2231' },
        ],
      },
      {
        id: 'business-profile',
        title: 'Business Profile',
        description: 'Details about business operations and location.',
        fields: [
          { label: 'Business Address', value: '1180 Maple Ave, Vienna, VA 22180' },
          { label: 'Business Category', value: 'Retail - Home Goods' },
          { label: 'Projected Start Date', value: '03/15/2024' },
          { label: 'Number of Employees', value: '6' },
        ],
      },
      {
        id: 'compliance',
        title: 'Compliance & Certifications',
        fields: [
          { label: 'Zoning Clearance', value: 'Pending' },
          { label: 'Fire Inspection', value: 'Scheduled - 03/05/2024' },
          { label: 'Sales Tax Registration', value: 'VA-REG-449912' },
        ],
      },
      {
        id: 'attachments',
        title: 'Attachments',
        fields: [
          { label: 'Lease Agreement', value: 'lease-agreement.pdf' },
          { label: 'Certificate of Good Standing', value: 'certificate-good-standing.pdf' },
        ],
      },
    ],
  },
  {
    id: 1000004,
    type: 'Professional Certification',
    status: 'Approved',
    submission_date: new Date('2024-02-10T10:00:00Z'),
    applicant_name: 'David Williams',
    description: 'Professional engineer certification renewal.',
    reference_number: 'PC-2024-0198',
    submission_channel: 'Online Portal',
    steps: [
      {
        id: 'license-holder',
        title: 'License Holder',
        fields: [
          { label: 'Licensee Name', value: 'David Williams' },
          { label: 'License Number', value: 'PE-VA-55102' },
          { label: 'Email', value: 'dwilliams@engineerpros.com' },
          { label: 'Phone', value: '(703) 555-7788' },
        ],
      },
      {
        id: 'continuing-education',
        title: 'Continuing Education',
        fields: [
          { label: 'Required Credits', value: '16' },
          { label: 'Credits Submitted', value: '18' },
          { label: 'Course Provider', value: 'Virginia Professional Engineers Association' },
        ],
      },
      {
        id: 'experience',
        title: 'Professional Experience',
        fields: [
          { label: 'Primary Employer', value: 'Northern Structures, Inc.' },
          { label: 'Years of Experience', value: '12' },
          { label: 'Recent Projects', value: 'Northside Bridge Retrofit, Riverbend Dam Reinforcement' },
        ],
      },
      {
        id: 'review',
        title: 'Certification Decision',
        fields: [
          { label: 'Reviewer', value: 'Patricia Lang, Senior Engineer' },
          { label: 'Approval Date', value: '02/12/2024' },
          { label: 'License Expiration', value: '02/12/2026' },
        ],
      },
    ],
  },
  {
    id: 1000005,
    type: 'Event Permit',
    status: 'Rejected',
    submission_date: new Date('2024-01-29T10:00:00Z'),
    applicant_name: 'Alicia Thompson',
    description: 'Community festival permit for downtown park.',
    reference_number: 'EP-2024-0063',
    submission_channel: 'Online Portal',
    steps: [
      {
        id: 'organizer',
        title: 'Organizer Details',
        fields: [
          { label: 'Organization', value: 'Downtown Community Alliance' },
          { label: 'Primary Contact', value: 'Alicia Thompson' },
          { label: 'Email', value: 'athompson@dcalliance.org' },
          { label: 'Phone', value: '(202) 555-4421' },
        ],
      },
      {
        id: 'event-plan',
        title: 'Event Plan',
        fields: [
          { label: 'Event Name', value: 'Spring into the City Festival' },
          { label: 'Event Date', value: '04/27/2024' },
          { label: 'Expected Attendance', value: '2,500' },
          { label: 'Venue', value: 'Downtown Community Park' },
        ],
      },
      {
        id: 'safety',
        title: 'Safety & Logistics',
        fields: [
          { label: 'Security Plan', value: 'Submitted - SafeGuard Security Services' },
          { label: 'Medical Support', value: 'Pending confirmation with County EMS' },
          { label: 'Waste Management', value: 'GreenCity Services contract attached' },
        ],
      },
      {
        id: 'review',
        title: 'Review Outcome',
        fields: [
          { label: 'Reviewer Notes', value: 'Event exceeds noise ordinance limits for requested timeframe.' },
          { label: 'Decision Date', value: '02/05/2024' },
          { label: 'Next Steps', value: 'Resubmit with revised hours or noise mitigation plan.' },
        ],
      },
    ],
  },
  {
    id: 1000006,
    type: 'Zoning Variance',
    status: 'Rejected',
    submission_date: new Date('2024-01-12T10:00:00Z'),
    applicant_name: 'Robert Kim',
    description: 'Variance request for setback requirements.',
    reference_number: 'ZV-2024-0110',
    submission_channel: 'In Person',
    steps: [
      {
        id: 'property-owner',
        title: 'Property Owner',
        fields: [
          { label: 'Owner Name', value: 'Robert Kim' },
          { label: 'Property Address', value: '318 Ridgecrest Rd, Falls Church, VA 22046' },
          { label: 'Parcel ID', value: '0456-22-1098' },
        ],
      },
      {
        id: 'variance-request',
        title: 'Variance Request',
        fields: [
          { label: 'Requested Relief', value: 'Reduce rear setback from 25 ft to 15 ft' },
          { label: 'Justification', value: 'Irregular lot shape limits buildable area for accessible addition.' },
          { label: 'Proposed Use', value: 'Accessible in-law suite addition' },
        ],
      },
      {
        id: 'community-feedback',
        title: 'Community Feedback',
        fields: [
          { label: 'Neighborhood Association', value: 'Did not support request' },
          { label: 'Public Comments', value: '3 opposition letters received' },
          { label: 'Planning Staff Recommendation', value: 'Recommend denial' },
        ],
      },
      {
        id: 'board-decision',
        title: 'Board Decision',
        fields: [
          { label: 'Decision Date', value: '02/01/2024' },
          { label: 'Outcome', value: 'Denied - Does not meet hardship criteria' },
          { label: 'Appeal Deadline', value: '03/01/2024' },
        ],
      },
    ],
  },
  {
    id: 1000007,
    type: 'Building Permit',
    status: 'Approved',
    submission_date: new Date('2023-12-20T10:00:00Z'),
    applicant_name: 'Emily Garcia',
    description: 'Kitchen renovation building permit.',
    reference_number: 'BP-2023-0974',
    submission_channel: 'Online Portal',
    steps: [
      {
        id: 'applicant',
        title: 'Applicant Information',
        fields: [
          { label: 'Applicant Name', value: 'Emily Garcia' },
          { label: 'Email', value: 'emily.garcia@example.com' },
          { label: 'Phone', value: '(703) 555-8891' },
        ],
      },
      {
        id: 'remodel-details',
        title: 'Remodel Details',
        fields: [
          { label: 'Property Address', value: '5210 Brookside Ct, Springfield, VA 22153' },
          { label: 'Scope of Work', value: 'Full kitchen remodel with electrical upgrades' },
          { label: 'Licensed Contractor', value: 'BuildRight Contractors, License #BR-77120' },
        ],
      },
      {
        id: 'inspections',
        title: 'Inspection Schedule',
        fields: [
          { label: 'Rough-In Inspection', value: 'Completed - 01/10/2024' },
          { label: 'Final Inspection', value: 'Scheduled - 02/15/2024' },
          { label: 'Electrical Permit', value: 'Included' },
        ],
      },
      {
        id: 'approval',
        title: 'Approval Summary',
        fields: [
          { label: 'Approval Date', value: '12/28/2023' },
          { label: 'Permit Issued By', value: 'Samuel Reed, Building Official' },
          { label: 'Permit Expiration', value: '12/28/2024' },
        ],
      },
    ],
  },
];

export const applicationData: ApplicationItems = {
  items: applications,
};
