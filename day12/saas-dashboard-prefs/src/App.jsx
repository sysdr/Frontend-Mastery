import React from 'react';
import { useDashboardSettings } from './hooks/useDashboardSettings';
import { SettingsPanel } from './components/SettingsPanel';

function App() {
  const [settings, updateSetting] = useDashboardSettings();

  // Generate sample items based on itemsPerPage
  const sampleItems = Array.from({ length: settings.itemsPerPage }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    desc: `Description for item ${i + 1}`
  }));

  return (
    <div className={`app-container ${settings.theme === 'dark' ? 'dark' : ''}`}>
      {/* Header */}
      <header className="header">
        <h1>SaaS Dashboard</h1>
        <div className="header-actions">
          <button 
            className="theme-toggle"
            onClick={() => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')}
          >
            {settings.theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Welcome Banner */}
        {settings.showWelcomeBanner && (
          <div className="welcome-banner">
            <div>
              <h2>Welcome back!</h2>
              <p>Your personalized dashboard is ready. All settings are saved automatically.</p>
            </div>
            <button 
              onClick={() => updateSetting('showWelcomeBanner', false)}
              style={{ 
                background: 'rgba(255,255,255,0.2)', 
                border: 'none', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon theme">🎨</div>
            <div className="stat-label">Current Theme</div>
            <div className="stat-value" style={{ textTransform: 'capitalize' }}>{settings.theme}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon layout">📊</div>
            <div className="stat-label">Layout Mode</div>
            <div className="stat-value" style={{ textTransform: 'capitalize' }}>{settings.layout}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon items">📄</div>
            <div className="stat-label">Items Per Page</div>
            <div className="stat-value">{settings.itemsPerPage}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon consent">📈</div>
            <div className="stat-label">Analytics</div>
            <div className="stat-value">{settings.analyticsConsent ? 'Enabled' : 'Disabled'}</div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Content Panel */}
          <div className="content-panel">
            <h3>📋 Content Preview ({settings.itemsPerPage} items)</h3>
            <div className={`sample-items ${settings.layout === 'grid' ? 'grid-view' : 'list-view'}`}>
              {sampleItems.map(item => (
                <div key={item.id} className="sample-item">
                  <div className="item-title">{item.title}</div>
                  <div className="item-desc">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Panel */}
          <SettingsPanel settings={settings} updateSetting={updateSetting} />
        </div>
      </main>
    </div>
  );
}

export default App;
