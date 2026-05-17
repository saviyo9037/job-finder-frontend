interface StatCardProps {
  label: string;
  value: number | string;
  accent?: string;
}

export default function StatCard({ label, value, accent = 'text-brand-600' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${accent}`}>{value}</p>
    </div>
  );
}
