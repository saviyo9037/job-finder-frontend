import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';

export default function Settings() {
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFilename, setResumeFilename] = useState<string | null>(null);
  const [hasResume, setHasResume] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getProfile().then((data) => {
      setCoverLetter(data.settings.coverLetter);
      setResumeFilename(data.settings.resumeFilename);
      setHasResume(data.settings.hasResume);
    });
  }, []);

  const handleCoverLetter = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.updateCoverLetter(coverLetter);
      setMessage('Cover letter saved');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage('');
    try {
      const result = await api.uploadResume(file);
      setResumeFilename(result.resumeFilename);
      setHasResume(true);
      setMessage('Resume uploaded');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Resume & Cover Letter</h1>

      {message && (
        <p className="mb-4 text-sm text-brand-700 bg-brand-50 px-4 py-2 rounded-lg">{message}</p>
      )}

      <section className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Resume</h2>
        <p className="text-sm text-slate-500 mb-3">
          {hasResume
            ? `Current file: ${resumeFilename}`
            : 'No resume uploaded yet. PDF, DOC, or DOCX up to 5MB.'}
        </p>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleResume}
          className="text-sm"
        />
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Default Cover Letter</h2>
        <form onSubmit={handleCoverLetter}>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={14}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono"
            placeholder="Your default cover letter..."
          />
          <button
            type="submit"
            disabled={saving}
            className="mt-4 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Cover Letter'}
          </button>
        </form>
      </section>
    </div>
  );
}
