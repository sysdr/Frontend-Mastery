import MetricsWidget from '../components/MetricsWidget';
import ProjectInfo from '../components/ProjectInfo';
import DashboardOperations from '../components/DashboardOperations';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-200 p-6 md:p-8">
      <Head>
        <title>SaaS Dashboard - Day 10 SWR Metrics</title>
        <meta name="description" content="SaaS Dashboard with SWR caching — real-time metrics" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Project info */}
        <ProjectInfo />

        {/* Operations bar */}
        <div className="bg-white/80 backdrop-blur rounded-xl shadow border border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-slate-600 font-medium text-sm">Operations</span>
          <DashboardOperations />
        </div>

        {/* Live metrics */}
        <MetricsWidget />
      </div>
    </div>
  );
}
