export type JobStatus = 'New' | 'Saved' | 'Applied' | 'Rejected' | 'Interview' | 'Offer';

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  jobType: 'Remote' | 'Hybrid' | 'Onsite';
  source: string;
  postedDate?: string;
  applyLink?: string;
  description: string;
  recruiterEmail?: string;
  status: JobStatus;
  saved: boolean;
  createdAt: string;
}

export interface FetchLog {
  _id: string;
  trigger: 'cron' | 'manual' | 'startup';
  status: 'success' | 'failed';
  inserted: number;
  skipped: number;
  total: number;
  durationMs?: number;
  error?: string;
  sources?: string[];
  createdAt: string;
}

export interface DashboardStats {
  total: number;
  new: number;
  applied: number;
  saved: number;
  rejected: number;
  interviews: number;
  offers: number;
  lastFetchedAt: string | null;
  lastFetch?: FetchLog | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface EmailPreview {
  to: string;
  from: string;
  subject: string;
  body: string;
  attachments: { filename: string }[];
  hasResume: boolean;
  job: { id: string; title: string; company: string };
}

export interface ProfileSettings {
  coverLetter: string;
  resumeFilename: string | null;
  hasResume: boolean;
  lastFetchedAt: string | null;
}
