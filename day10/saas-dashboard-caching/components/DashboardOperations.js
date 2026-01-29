const API_BASE = 'http://localhost:3001';
const API_METRICS = `${API_BASE}/api/metrics`;

const DashboardOperations = () => (
  <div className="flex flex-wrap items-center gap-3">
    <a
      href={API_METRICS}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
    >
      View API (JSON)
    </a>
    <span className="text-slate-400 text-sm">|</span>
    <span className="text-slate-500 text-sm">
      Dashboard: <code className="bg-slate-100 px-1.5 py-0.5 rounded">localhost:3000</code>
      {' · '}
      API: <code className="bg-slate-100 px-1.5 py-0.5 rounded">localhost:3001</code>
    </span>
  </div>
);

export default DashboardOperations;
