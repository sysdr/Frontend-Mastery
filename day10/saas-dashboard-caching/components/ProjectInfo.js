const ProjectInfo = () => (
  <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-slate-200 p-5 max-w-2xl">
    <h1 className="text-xl font-bold text-slate-800 mb-2">Day 10: Data Caching — Stale-While-Revalidate (SWR)</h1>
    <p className="text-slate-600 text-sm leading-relaxed">
      This dashboard demonstrates <strong>SWR</strong>: it shows cached data instantly, then fetches fresh metrics in the background.
      Metrics below update in real time from the API. Use <strong>Refresh now</strong> to revalidate on demand, or watch values update automatically every few seconds.
    </p>
    <ul className="mt-3 text-xs text-slate-500 space-y-1">
      <li>• <strong>SWR</strong> = show stale data first, revalidate in background, then update the UI</li>
      <li>• Red values = metric &gt; 80%; green = normal range</li>
    </ul>
  </div>
);

export default ProjectInfo;
