import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import JobCard from '../components/JobCard';
import EmailModal from '../components/EmailModal';
import AddJobModal from '../components/AddJobModal';
import { EmailPreview, Job, JobStatus } from '../types';

interface JobListPageProps {
  title: string;
  filter: Record<string, string>;
  autoFetch?: boolean;
}

export default function JobListPage({ title, filter, autoFetch }: JobListPageProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [emailPreview, setEmailPreview] = useState<EmailPreview | null>(null);
  const [emailJobId, setEmailJobId] = useState('');
  const [showAddJob, setShowAddJob] = useState(false);
  const didAutoFetch = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { ...filter, limit: '100' };
      if (search) params.search = search;
      const data = await api.getJobs(params);
      setJobs(data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    const init = async () => {
      if (autoFetch && !didAutoFetch.current) {
        didAutoFetch.current = true;
        try {
          await api.fetchNow();
        } catch (err) {
          console.error('Auto-fetch:', err);
        }
      }
      await load();
    };
    init();
  }, [load, autoFetch]);

  const handleStatus = async (id: string, status: JobStatus) => {
    const updated = await api.updateStatus(id, status);
    setJobs((prev) => prev.map((j) => (j._id === id ? updated : j)));
  };

  const handleSave = async (id: string, saved: boolean) => {
    const updated = await api.toggleSave(id, saved);
    setJobs((prev) => prev.map((j) => (j._id === id ? updated : j)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    await api.deleteJob(id);
    setJobs((prev) => prev.filter((j) => j._id !== id));
  };

  const handleApplyEmail = async (job: Job) => {
    try {
      const preview = await api.previewEmail(job._id);
      setEmailPreview(preview);
      setEmailJobId(job._id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Cannot preview email');
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">
            UI/UX Designer · MERN · React · Node.js · Full Stack · Frontend · Backend · Kerala · Bangalore · Chennai · Hyderabad · Tamil Nadu · Remote · India
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <input
            type="search"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-shadow"
          />
          <button
            onClick={() => setShowAddJob(true)}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 shadow-sm transition-colors whitespace-nowrap"
          >
            + Add Job
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-slate-500">
          No jobs match your filters yet. Go to Dashboard and click <strong>Fetch Now</strong>.
        </p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onStatusChange={handleStatus}
              onToggleSave={handleSave}
              onDelete={handleDelete}
              onApplyEmail={handleApplyEmail}
            />
          ))}
        </div>
      )}

      {emailPreview && (
        <EmailModal
          preview={emailPreview}
          jobId={emailJobId}
          onClose={() => setEmailPreview(null)}
          onSent={load}
        />
      )}

      <AddJobModal 
        isOpen={showAddJob} 
        onClose={() => setShowAddJob(false)} 
        onSuccess={load} 
      />
    </div>
  );
}
