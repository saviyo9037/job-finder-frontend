import { useState } from 'react';
import { EmailPreview } from '../types';
import { api } from '../api/client';

interface EmailModalProps {
  preview: EmailPreview;
  jobId: string;
  onClose: () => void;
  onSent: () => void;
}

export default function EmailModal({ preview, jobId, onClose, onSent }: EmailModalProps) {
  const [to, setTo] = useState(preview.to);
  const [subject, setSubject] = useState(preview.subject);
  const [body, setBody] = useState(preview.body);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleSend = async () => {
    if (!confirmed) {
      setError('Please check the confirmation box before sending.');
      return;
    }
    setSending(true);
    setError('');
    try {
      await api.sendEmail({ jobId, to, subject, body });
      onSent();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Email Preview</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase">To</label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono"
            />
          </div>
          <p className="text-sm text-slate-500">
            Attachments: {preview.hasResume ? preview.attachments.map((a) => a.filename).join(', ') : 'No resume uploaded — add one in Settings'}
          </p>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="rounded border-slate-300 text-brand-600"
            />
            <span className="text-sm text-slate-700">
              I have reviewed this email and confirm sending it
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-lg"
          >
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
}
