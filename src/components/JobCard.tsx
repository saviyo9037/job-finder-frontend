import { Job, JobStatus } from '../types';

const STATUSES: JobStatus[] = ['New', 'Saved', 'Applied', 'Rejected', 'Interview', 'Offer'];

interface JobCardProps {
  job: Job;
  onStatusChange: (id: string, status: JobStatus) => void;
  onToggleSave: (id: string, saved: boolean) => void;
  onDelete: (id: string) => void;
  onApplyEmail: (job: Job) => void;
}

export default function JobCard({
  job,
  onStatusChange,
  onToggleSave,
  onDelete,
  onApplyEmail,
}: JobCardProps) {
  const posted = job.postedDate
    ? new Date(job.postedDate).toLocaleDateString()
    : new Date(job.createdAt).toLocaleDateString();

  return (
    <article className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 leading-tight">{job.title}</h3>
              <p className="text-slate-600 mt-1">{job.company}</p>
            </div>
            {/* Mobile-only status dropdown (shows at top right on small screens, or below title if very small) */}
            <select
              value={job.status}
              onChange={(e) => onStatusChange(job._id, e.target.value as JobStatus)}
              className="sm:hidden text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white w-full sm:w-auto"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">{job.location}</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">{job.experience}</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">{job.jobType}</span>
            <span className="px-2 py-0.5 bg-brand-50 text-brand-700 text-xs rounded-md truncate max-w-[150px]">{job.source}</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-md">{posted}</span>
          </div>
          {job.description && (
            <p className="text-sm text-slate-500 mt-3 line-clamp-2">{job.description.replace(/<[^>]*>/g, '')}</p>
          )}
        </div>

        {/* Desktop status dropdown */}
        <select
          value={job.status}
          onChange={(e) => onStatusChange(job._id, e.target.value as JobStatus)}
          className="hidden sm:block text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white shrink-0"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 mt-4 pt-4 border-t border-slate-100">
        {job.applyLink && (
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 sm:py-1.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors text-center"
          >
            Apply Link
          </a>
        )}
        {job.recruiterEmail && (
          <button
            onClick={() => onApplyEmail(job)}
            className="px-3 py-2 sm:py-1.5 text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors text-center"
          >
            Apply by Email
          </button>
        )}
        <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 sm:ml-auto">
          <button
            onClick={() => onToggleSave(job._id, !job.saved)}
            className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 text-sm font-medium rounded-lg transition-colors text-center ${
              job.saved
                ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {job.saved ? 'Unsave' : 'Save'}
          </button>
          <button
            onClick={() => onDelete(job._id)}
            className="flex-1 sm:flex-none px-3 py-2 sm:py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-center"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
