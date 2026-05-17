import JobListPage from './JobListPage';

export default function MernJobs() {
  return (
    <JobListPage
      title="MERN · React · Node · Full Stack · Frontend · Backend"
      filter={{ preset: 'mern-india' }}
      autoFetch={false}
    />
  );
}
