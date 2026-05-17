import JobListPage from './JobListPage';

export default function SavedJobs() {
  return <JobListPage title="Saved Jobs" filter={{ saved: 'true' }} />;
}
