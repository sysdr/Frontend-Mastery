import React from 'react';

export function SettingsPanel({ settings, updateSetting }) {
  return (
    <div className="settings-panel">
      <h3>⚙️ Dashboard Settings</h3>
      
      <div className="setting-group">
        <label>Theme</label>
        <select
          value={settings.theme}
          onChange={(e) => updateSetting('theme', e.target.value)}
        >
          <option value="light">☀️ Light Mode</option>
          <option value="dark">🌙 Dark Mode</option>
        </select>
      </div>

      <div className="setting-group">
        <label>Layout</label>
        <select
          value={settings.layout}
          onChange={(e) => updateSetting('layout', e.target.value)}
        >
          <option value="grid">📊 Grid View</option>
          <option value="list">📋 List View</option>
        </select>
      </div>

      <div className="setting-group">
        <label>Items Per Page</label>
        <input
          type="number"
          value={settings.itemsPerPage}
          onChange={(e) => updateSetting('itemsPerPage', Number(e.target.value))}
          min="5"
          max="50"
        />
      </div>

      <div className="setting-group">
        <label>Preferences</label>
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={settings.analyticsConsent}
            onChange={(e) => updateSetting('analyticsConsent', e.target.checked)}
          />
          <span>Enable Analytics Tracking</span>
        </label>
      </div>

      <div className="setting-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={settings.showWelcomeBanner}
            onChange={(e) => updateSetting('showWelcomeBanner', e.target.checked)}
          />
          <span>Show Welcome Banner</span>
        </label>
      </div>
    </div>
  );
}
