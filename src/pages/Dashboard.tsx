import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DashboardStats, FetchLog } from '../types';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [logs, setLogs] = useState<FetchLog[]>([]);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    const [statsData, logsData] = await Promise.all([api.getStats(), api.getFetchLogs(15)]);
    setStats(statsData);
    setLogs(logsData.logs);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const statsData = await api.getStats();
        setStats(statsData);
        const stale =
          !statsData.lastFetchedAt ||
          Date.now() - new Date(statsData.lastFetchedAt).getTime() > 6 * 60 * 60 * 1000;
        if (statsData.total === 0 || stale) {
          setFetching(true);
          const result = await api.fetchNow();
          setMessage(`Auto-fetched ${result.inserted} new jobs`);
          await load();
          setFetching(false);
        } else {
          const logsData = await api.getFetchLogs(15);
          setLogs(logsData.logs);
        }
      } catch (err) {
        console.error(err);
        setFetching(false);
      }
    };
    init();
  }, []);

  const handleFetch = async () => {
    setFetching(true);
    setMessage('');
    try {
      const result = await api.fetchNow();
      setMessage(
        `Fetched ${result.inserted} new jobs (${result.skipped} duplicates skipped)`
      );
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Fetch failed');
    } finally {
      setFetching(false);
    }
  };

  const lastFetched = stats?.lastFetchedAt
    ? new Date(stats.lastFetchedAt).toLocaleString()
    : 'Never';

  const triggerLabel = (t: string) =>
    ({ cron: 'Scheduled (6h)', manual: 'Manual', startup: 'Startup' })[t] || t;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Last fetched: {lastFetched}</p>
          <p className="text-slate-400 text-xs mt-1">
            Cron: every 6 hours · MERN · React · Node.js · Full Stack · Frontend · Backend JS
          </p>
        </div>
        <button
          onClick={handleFetch}
          disabled={fetching}
          className="w-full sm:w-auto px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
        >
          {fetching ? 'Fetching...' : 'Fetch Now'}
        </button>
      </div>

      {message && (
        <p className="mb-4 text-sm text-brand-700 bg-brand-50 px-4 py-2 rounded-lg">{message}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <StatCard label="Total Jobs" value={stats?.total ?? '—'} />
        <StatCard label="New" value={stats?.new ?? '—'} />
        <StatCard label="Saved" value={stats?.saved ?? '—'} accent="text-amber-600" />
        <StatCard label="Applied" value={stats?.applied ?? '—'} accent="text-green-600" />
        <StatCard label="Rejected" value={stats?.rejected ?? '—'} accent="text-red-500" />
        <StatCard label="Interviews" value={stats?.interviews ?? '—'} accent="text-purple-600" />
        <StatCard label="Offers" value={stats?.offers ?? '—'} accent="text-emerald-600" />
      </div>

      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Fetch Logs</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kerala · Kochi · Trivandrum · Bangalore · Chennai · Hyderabad · Remote · India
          </p>
        </div>
        {logs.length === 0 ? (
          <p className="p-4 sm:p-5 text-sm text-slate-500">No fetch logs yet. Click Fetch Now.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-4 sm:px-5 py-3 font-medium whitespace-nowrap">Time</th>
                  <th className="text-left px-4 sm:px-5 py-3 font-medium whitespace-nowrap">Trigger</th>
                  <th className="text-left px-4 sm:px-5 py-3 font-medium whitespace-nowrap">Status</th>
                  <th className="text-left px-4 sm:px-5 py-3 font-medium whitespace-nowrap">New</th>
                  <th className="text-left px-4 sm:px-5 py-3 font-medium whitespace-nowrap">Skipped</th>
                  <th className="text-left px-4 sm:px-5 py-3 font-medium whitespace-nowrap">Sources</th>
                  <th className="text-left px-4 sm:px-5 py-3 font-medium whitespace-nowrap">Duration</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 sm:px-5 py-3 text-slate-700 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 sm:px-5 py-3 whitespace-nowrap">{triggerLabel(log.trigger)}</td>
                    <td className="px-4 sm:px-5 py-3 whitespace-nowrap">
                      <span
                        className={
                          log.status === 'success'
                            ? 'text-green-600 font-medium'
                            : 'text-red-600 font-medium'
                        }
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-5 py-3 whitespace-nowrap">{log.inserted}</td>
                    <td className="px-4 sm:px-5 py-3 whitespace-nowrap">{log.skipped}</td>
                    <td className="px-4 sm:px-5 py-3 text-slate-500 max-w-xs truncate" title={log.sources?.join(', ')}>
                      {log.sources?.join(', ') || '—'}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-slate-500 whitespace-nowrap">
                      {log.durationMs ? `${(log.durationMs / 1000).toFixed(1)}s` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
