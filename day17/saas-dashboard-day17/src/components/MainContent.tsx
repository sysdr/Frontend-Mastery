import React, { useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { ViewId } from './DashboardLayout';

interface MainContentProps {
  isSidebarOpen: boolean;
  activeView: ViewId;
}

interface Metrics {
  revenue: number;
  users: number;
  orders: number;
  conversion: number;
}

interface ReportRow {
  id: string;
  name: string;
  date: string;
  status: string;
  type: 'PDF' | 'CSV';
}

const initialRecentReports: ReportRow[] = [
  { id: '1', name: 'Monthly revenue report', date: '2025-03-15', status: 'Ready', type: 'PDF' },
  { id: '2', name: 'User acquisition summary', date: '2025-03-12', status: 'Ready', type: 'CSV' },
  { id: '3', name: 'Conversion funnel report', date: '2025-03-10', status: 'Ready', type: 'PDF' },
];

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function csvContentForReport(name: string, date: string): string {
  if (name.includes('revenue')) {
    return 'Month,Revenue,MRR,Churn\n2025-01,12400,11800,2.1\n2025-02,13100,12200,1.8\n2025-03,12450,11900,2.0';
  }
  if (name.includes('acquisition')) {
    return 'Source,Sign-ups,Clicks\nOrganic,420,2100\nPaid,380,1900\nReferral,180,600';
  }
  if (name.includes('funnel')) {
    return 'Stage,Users,Drop-off\nVisits,12840,0\nSign-up,4200,67\nTrial,2100,50\nPaid,890,58';
  }
  return `Report,Date\n${name},${date}`;
}

const MainContent: React.FC<MainContentProps> = ({ isSidebarOpen, activeView }) => {
  const [metrics, setMetrics] = useState<Metrics>({ revenue: 12450, users: 1823, orders: 392, conversion: 4.2 });
  const [demoRunning, setDemoRunning] = useState(false);
  const [recentReports, setRecentReports] = useState<ReportRow[]>(initialRecentReports);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const runDemo = useCallback(() => {
    setDemoRunning(true);
    const base = { ...metrics };
    const steps = [
      { revenue: base.revenue + 1200, users: base.users + 45, orders: base.orders + 28, conversion: base.conversion + 0.3 },
      { revenue: base.revenue + 2400, users: base.users + 89, orders: base.orders + 56, conversion: base.conversion + 0.5 },
      { revenue: base.revenue + 3800, users: base.users + 134, orders: base.orders + 91, conversion: base.conversion + 0.8 },
    ];
    let i = 0;
    const id = setInterval(() => {
      if (i < steps.length) {
        setMetrics(steps[i]);
        i++;
      } else {
        clearInterval(id);
        setDemoRunning(false);
      }
    }, 800);
  }, [metrics]);

  const handleGenerateReport = useCallback((reportId: string, title: string) => {
    setGeneratingId(reportId);
    const type: 'PDF' | 'CSV' = reportId === 'acquisition' ? 'CSV' : 'PDF';
    window.setTimeout(() => {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      setRecentReports((prev) => [
        { id: String(Date.now()), name: title, date: dateStr, status: 'Ready', type },
        ...prev,
      ]);
      setGeneratingId(null);
    }, 800);
  }, []);

  const handleDownloadReport = useCallback((report: ReportRow) => {
    const baseName = report.name.replace(/\s+/g, '-').toLowerCase();
    if (report.type === 'CSV') {
      const content = csvContentForReport(report.name, report.date);
      downloadFile(`${baseName}-${report.date}.csv`, content, 'text/csv;charset=utf-8');
    } else {
      const content = `${report.name}\nGenerated: ${report.date}\nStatus: ${report.status}\n\nThis is a placeholder. In production, this would be a PDF file.`;
      downloadFile(`${baseName}-${report.date}.txt`, content, 'text/plain;charset=utf-8');
    }
  }, []);

  if (activeView === 'analytics') {
    const sessionTrend = [
      { day: 'Mon', sessions: 1620, duration: 4.2 },
      { day: 'Tue', sessions: 1890, duration: 4.5 },
      { day: 'Wed', sessions: 2100, duration: 4.1 },
      { day: 'Thu', sessions: 1850, duration: 4.8 },
      { day: 'Fri', sessions: 2240, duration: 4.3 },
      { day: 'Sat', sessions: 1680, duration: 5.1 },
      { day: 'Sun', sessions: 1460, duration: 4.6 },
    ];
    const segmentData = [
      { name: 'Desktop', value: 5840, color: '#3b82f6' },
      { name: 'Mobile', value: 4520, color: '#6ee7b7' },
      { name: 'Tablet', value: 2480, color: '#f97316' },
    ];
    const funnelData = [
      { stage: 'Visits', count: 12840 },
      { stage: 'Sign-up', count: 4200 },
      { stage: 'Trial', count: 2100 },
      { stage: 'Paid', count: 890 },
    ];
    return (
      <main className="main-content" data-sidebar-open={isSidebarOpen}>
        <h1>Analytics</h1>
        <p>View trends, funnels, and user behavior. Charts and breakdowns by segment.</p>
        <div className="metrics-grid">
          <div className="metric-card"><span className="metric-label">Sessions</span><span className="metric-value">12,840</span></div>
          <div className="metric-card"><span className="metric-label">Avg. Duration</span><span className="metric-value">4m 32s</span></div>
          <div className="metric-card"><span className="metric-label">Bounce Rate</span><span className="metric-value">42%</span></div>
        </div>
        <div className="analytics-charts">
          <div className="chart-card">
            <h2>Sessions & duration (last 7 days)</h2>
            <div className="chart-container" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sessionTrend} margin={{ top: 12, right: 24, left: 8, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#6b7280" width={40} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#6b7280" tickFormatter={(v) => `${v}m`} width={36} />
                  <Tooltip
                    formatter={(value, name) => {
                      const isSessions = String(name) === 'sessions';
                      return [isSessions ? Number(value).toLocaleString() : `${value} min`, isSessions ? 'Sessions' : 'Avg duration'];
                    }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="sessions" name="Sessions" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line yAxisId="right" type="monotone" dataKey="duration" name="Avg duration (min)" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="chart-row">
            <div className="chart-card chart-card-half">
              <h2>Sessions by device</h2>
              <div className="chart-container" style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => Number(value).toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
              </div>
            </div>
            <div className="chart-card chart-card-half">
              <h2>Funnel</h2>
              <div className="chart-container" style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ top: 8, right: 24, left: 60, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <YAxis type="category" dataKey="stage" width={52} tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip formatter={(value) => Number(value).toLocaleString()} />
                  <Bar dataKey="count" name="Users" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (activeView === 'reports') {
    const reportTypes = [
      { id: 'revenue', title: 'Monthly revenue report', description: 'Revenue by product, region, and cohort. Includes MRR and churn.', format: 'PDF, CSV' },
      { id: 'acquisition', title: 'User acquisition summary', description: 'Sign-ups, traffic sources, and campaign performance.', format: 'PDF, CSV' },
      { id: 'funnel', title: 'Conversion funnel report', description: 'Funnel stages, drop-off rates, and conversion by segment.', format: 'PDF, CSV' },
    ];
    return (
      <main className="main-content" data-sidebar-open={isSidebarOpen}>
        <h1>Reports</h1>
        <p>Generate and download reports. Scheduled reports and exports will be managed here.</p>
        <div className="reports-cards">
          {reportTypes.map((report) => (
            <div key={report.id} className="report-card">
              <h3 className="report-card-title">{report.title}</h3>
              <p className="report-card-desc">{report.description}</p>
              <span className="report-card-format">Export: {report.format}</span>
              <button
                type="button"
                className="report-card-btn"
                disabled={generatingId !== null}
                onClick={() => handleGenerateReport(report.id, report.title)}
              >
                {generatingId === report.id ? 'Generating…' : 'Generate report'}
              </button>
            </div>
          ))}
        </div>
        <section className="reports-recent">
          <h2>Recent reports</h2>
          <div className="reports-table-wrap">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Generated</th>
                  <th>Format</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.date}</td>
                    <td>{row.type}</td>
                    <td><span className="report-status report-status-ready">{row.status}</span></td>
                    <td>
                      <button
                        type="button"
                        className="report-download-btn"
                        onClick={() => handleDownloadReport(row)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    );
  }

  if (activeView === 'settings') {
    return (
      <main className="main-content" data-sidebar-open={isSidebarOpen}>
        <h1>Settings</h1>
        <p>Manage your account, notifications, and integrations.</p>
        <div className="settings-section">
          <h2>Profile</h2>
          <p>Update your name and email.</p>
          <h2>Notifications</h2>
          <p>Choose how you receive alerts.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content" data-sidebar-open={isSidebarOpen}>
      <h1>Dashboard Overview</h1>
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Revenue</span>
          <span className="metric-value">${metrics.revenue.toLocaleString()}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Users</span>
          <span className="metric-value">{metrics.users.toLocaleString()}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Orders</span>
          <span className="metric-value">{metrics.orders.toLocaleString()}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Conversion %</span>
          <span className="metric-value">{metrics.conversion.toFixed(1)}%</span>
        </div>
      </div>
      <div className="demo-actions">
        <button className="demo-button" onClick={runDemo} disabled={demoRunning}>
          {demoRunning ? 'Updating…' : 'Run demo'}
        </button>
      </div>
      <p className="main-description">Use "Run demo" to simulate live metric updates. All values above are live and update with the demo.</p>
    </main>
  );
};

export default MainContent;
