import JobListPage from './JobListPage';

export default function UiUxJobs() {
  return (
    <JobListPage
      title="UI/UX Designer · Figma · Adobe XD · Sketch"
      filter={{ preset: 'uiux-india' }}
      autoFetch={false}
    />
  );
}
