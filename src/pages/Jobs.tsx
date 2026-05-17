import JobListPage from './JobListPage';

export default function Jobs() {
  return (
    <JobListPage
      title="MERN · React · Node · Full Stack · Frontend · Backend JS"
      filter={{ preset: 'mern-india' }}
      autoFetch={false}
    />
  );
}
