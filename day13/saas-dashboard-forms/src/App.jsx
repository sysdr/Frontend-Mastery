import React, { useState } from 'react';
import UserProfileForm from './components/UserProfileForm';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [userProfile, setUserProfile] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    receiveNewsletters: true,
    newsletterFrequency: 'monthly',
  });

  const [formSubmissions, setFormSubmissions] = useState([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  const handleProfileUpdate = (updatedData) => {
    setUserProfile(updatedData);
    setFormSubmissions(prev => [...prev, updatedData]);
    setLastUpdateTime(Date.now());
    console.log('Profile updated:', updatedData);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f1f5f9',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ 
          textAlign: 'center', 
          marginBottom: '32px',
          padding: '32px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '12px',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '40px' }}>⚛️</span>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '800', 
              color: '#1e293b',
              margin: 0
            }}>
              Day 13: React Hook Form Dashboard
            </h1>
          </div>
          <p style={{ 
            color: '#64748b', 
            fontSize: '16px',
            margin: '8px 0 0 0'
          }}>
            Efficient form management with real-time metrics
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginTop: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: '#64748b',
              background: '#f8fafc',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <span style={{ color: '#22c55e' }}>●</span> Live Updates
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: '#64748b',
              background: '#f8fafc',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <span style={{ color: '#3b82f6' }}>●</span> Form Validation
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: '#64748b',
              background: '#f8fafc',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <span style={{ color: '#f59e0b' }}>●</span> Real-time Metrics
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '24px'
        }}>
          {/* Left Column - Form */}
          <div>
            <UserProfileForm initialData={userProfile} onSubmitSuccess={handleProfileUpdate} />
            
            {/* Current Profile State */}
            <div style={{ 
              marginTop: '16px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                background: '#f8fafc',
                borderBottom: '1px solid #e5e7eb',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '16px' }}>💾</span>
                <h3 style={{ 
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0
                }}>Current Profile State</h3>
              </div>
              <div style={{ padding: '16px' }}>
                <pre style={{ 
                  fontSize: '12px',
                  background: '#f8fafc',
                  padding: '12px',
                  borderRadius: '8px',
                  overflow: 'auto',
                  margin: 0,
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  lineHeight: '1.5'
                }}>
                  {JSON.stringify(userProfile, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard */}
          <div>
            <Dashboard 
              userProfile={userProfile} 
              formSubmissions={formSubmissions}
              lastUpdateTime={lastUpdateTime}
            />
          </div>
        </div>

        {/* Footer */}
        <footer style={{ 
          marginTop: '32px', 
          textAlign: 'center',
          padding: '20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ 
            fontSize: '14px', 
            color: '#64748b',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span>💡</span>
            Submit the form multiple times to see dashboard metrics update in real-time!
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
