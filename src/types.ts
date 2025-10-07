export interface Applicant {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender: string;
  date_of_birth: Date;
  ssn: string;
  email?: string;
  home_phone?: string;
  mobile_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country: string;
  created_at: Date;
  updated_at?: Date;
}

export interface Case {
  id: number;
  status: 'Not Started' | 'In Progress' | 'Approved' | 'Denied';
  assigned_to?: string;
  created_at: Date;
  updated_at?: Date;
  applicant: Applicant;
}

export interface CaseItems {
  items: Case[];
  item_count: number;
  page_count: number;
  prev_page: number | null;
  next_page: number | null;
}

export interface CaseSearchFilters {
  id?: string;
  gender?: string[];
  status?: string[];
  created_before?: string; // ISO date string
  created_after?: string; // ISO date string
  q?: string; // Simple search query
}

// User Types
export interface User {
  firstName: string | undefined;
  lastName: string | undefined;
  displayName: string | undefined;
  emailAddress: string | undefined;
  phoneNumber: string | undefined;
}

// Application Types
export type ApplicationType =
  | 'Building Permit'
  | 'Business License'
  | 'Professional Certification'
  | 'Event Permit'
  | 'Zoning Variance';

export type ApplicationStatusType = 'Submitted' | 'Reviewed' | 'Approved' | 'Rejected';

export interface ApplicationStepField {
  label: string;
  value: string;
}

export interface ApplicationStep {
  id: string;
  title: string;
  description?: string;
  fields: ApplicationStepField[];
}

export interface Application {
  id: number;
  type: ApplicationType;
  status: ApplicationStatusType;
  submission_date: Date;
  applicant_name?: string;
  description?: string;
  reference_number?: string;
  submission_channel?: string;
  steps: ApplicationStep[];
}

export interface ApplicationItems {
  items: Application[];
}
