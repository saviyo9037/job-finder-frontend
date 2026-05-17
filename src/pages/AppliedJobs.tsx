import JobListPage from './JobListPage';

export default function AppliedJobs() {
  return <JobListPage title="Applied Jobs" filter={{ status: 'Applied' }} />;
}
