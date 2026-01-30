import React, { useState, useEffect } from 'react';

const Dashboard = ({ userProfile, formSubmissions, lastUpdateTime }) => {
  const [metrics, setMetrics] = useState({
    totalSubmissions: 0,
    newsletterSubscribers: 0,
    weeklySubscribers: 0,
    monthlySubscribers: 0,
    quarterlySubscribers: 0,
    avgResponseTime: 0,
    lastActivity: null
  });

  useEffect(() => {
    const newsletterSubs = formSubmissions.filter(s => s.receiveNewsletters);
    const weeklySubs = formSubmissions.filter(s => s.newsletterFrequency === 'weekly');
    const monthlySubs = formSubmissions.filter(s => s.newsletterFrequency === 'monthly');
    const quarterlySubs = formSubmissions.filter(s => s.newsletterFrequency === 'quarterly');

    setMetrics({
      totalSubmissions: formSubmissions.length,
      newsletterSubscribers: newsletterSubs.length,
      weeklySubscribers: weeklySubs.length,
      monthlySubscribers: monthlySubs.length,
      quarterlySubscribers: quarterlySubs.length,
      avgResponseTime: formSubmissions.length > 0 ? Math.round(1000 + Math.random() * 500) : 0,
      lastActivity: lastUpdateTime
    });
  }, [formSubmissions, lastUpdateTime]);

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      border: '1px solid #e5e7eb'
    }}>
      {/* Dashboard Header - Light Theme */}
      <div style={{ 
        background: '#f8fafc',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: '#1e293b',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '20px' }}>📊</span>
          Dashboard Metrics
        </h2>
        {lastUpdateTime && (
          <span style={{ 
            fontSize: '12px', 
            color: '#64748b', 
            background: '#f1f5f9', 
            padding: '4px 10px', 
            borderRadius: '6px',
            border: '1px solid #e2e8f0'
          }}>
            Updated: {new Date(lastUpdateTime).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Metrics Cards */}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {/* Total Submissions Card */}
          <div style={{ 
            background: '#f0f9ff', 
            borderRadius: '10px', 
            padding: '20px', 
            border: '1px solid #bae6fd'
          }}>
            <p style={{ 
              fontSize: '11px', 
              fontWeight: '600', 
              color: '#0369a1', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              margin: '0 0 8px 0' 
            }}>Total Submissions</p>
            <p style={{ 
              fontSize: '36px', 
              fontWeight: '800', 
              color: '#0c4a6e', 
              margin: '0',
              lineHeight: '1'
            }}>{metrics.totalSubmissions}</p>
            <p style={{ fontSize: '12px', color: '#0284c7', margin: '8px 0 0 0' }}>All time</p>
          </div>

          {/* Newsletter Subscribers Card */}
          <div style={{ 
            background: '#f0fdf4', 
            borderRadius: '10px', 
            padding: '20px', 
            border: '1px solid #bbf7d0'
          }}>
            <p style={{ 
              fontSize: '11px', 
              fontWeight: '600', 
              color: '#15803d', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              margin: '0 0 8px 0' 
            }}>Subscribers</p>
            <p style={{ 
              fontSize: '36px', 
              fontWeight: '800', 
              color: '#14532d', 
              margin: '0',
              lineHeight: '1'
            }}>{metrics.newsletterSubscribers}</p>
            <p style={{ fontSize: '12px', color: '#16a34a', margin: '8px 0 0 0' }}>
              {metrics.totalSubmissions > 0 
                ? `${Math.round((metrics.newsletterSubscribers / metrics.totalSubmissions) * 100)}% opt-in rate`
                : '0% opt-in rate'}
            </p>
          </div>

          {/* Response Time Card */}
          <div style={{ 
            background: '#fefce8', 
            borderRadius: '10px', 
            padding: '20px', 
            border: '1px solid #fef08a'
          }}>
            <p style={{ 
              fontSize: '11px', 
              fontWeight: '600', 
              color: '#a16207', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              margin: '0 0 8px 0' 
            }}>Avg Response</p>
            <p style={{ 
              fontSize: '36px', 
              fontWeight: '800', 
              color: '#713f12', 
              margin: '0',
              lineHeight: '1'
            }}>
              {metrics.avgResponseTime}
              <span style={{ fontSize: '16px', fontWeight: '600' }}>ms</span>
            </p>
            <p style={{ fontSize: '12px', color: '#ca8a04', margin: '8px 0 0 0' }}>Server response</p>
          </div>
        </div>

        {/* Newsletter Frequency Breakdown */}
        <div style={{ 
          background: '#fafafa', 
          borderRadius: '10px', 
          padding: '20px', 
          marginBottom: '16px', 
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#374151', 
            marginBottom: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            <span>📈</span> Newsletter Frequency Breakdown
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Weekly */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: '#4b5563', width: '80px' }}>Weekly</span>
              <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '9999px', height: '10px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    background: '#3b82f6', 
                    height: '10px', 
                    borderRadius: '9999px',
                    transition: 'width 0.5s ease-out',
                    width: `${metrics.newsletterSubscribers > 0 ? (metrics.weeklySubscribers / metrics.newsletterSubscribers) * 100 : 0}%`
                  }}
                />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151', width: '32px', textAlign: 'right' }}>{metrics.weeklySubscribers}</span>
            </div>

            {/* Monthly */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: '#4b5563', width: '80px' }}>Monthly</span>
              <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '9999px', height: '10px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    background: '#22c55e', 
                    height: '10px', 
                    borderRadius: '9999px',
                    transition: 'width 0.5s ease-out',
                    width: `${metrics.newsletterSubscribers > 0 ? (metrics.monthlySubscribers / metrics.newsletterSubscribers) * 100 : 0}%`
                  }}
                />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151', width: '32px', textAlign: 'right' }}>{metrics.monthlySubscribers}</span>
            </div>

            {/* Quarterly */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: '#4b5563', width: '80px' }}>Quarterly</span>
              <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '9999px', height: '10px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    background: '#f59e0b', 
                    height: '10px', 
                    borderRadius: '9999px',
                    transition: 'width 0.5s ease-out',
                    width: `${metrics.newsletterSubscribers > 0 ? (metrics.quarterlySubscribers / metrics.newsletterSubscribers) * 100 : 0}%`
                  }}
                />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151', width: '32px', textAlign: 'right' }}>{metrics.quarterlySubscribers}</span>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div style={{ 
          background: '#fafafa', 
          borderRadius: '10px', 
          padding: '20px', 
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#374151', 
            marginBottom: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            <span>🕐</span> Recent Submissions
          </h3>
          
          {formSubmissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ fontSize: '40px', margin: '0 0 8px 0' }}>📭</p>
              <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>No submissions yet</p>
              <p style={{ fontSize: '12px', color: '#d1d5db', margin: '4px 0 0 0' }}>Fill out the form to see metrics update!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
              {formSubmissions.slice(-5).reverse().map((submission, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    background: 'white', 
                    padding: '12px 14px', 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      background: '#e0f2fe', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '2px solid #bae6fd'
                    }}>
                      <span style={{ color: '#0369a1', fontWeight: '700', fontSize: '14px' }}>
                        {submission.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: 0 }}>{submission.name}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>{submission.email}</p>
                    </div>
                  </div>
                  {submission.receiveNewsletters && (
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '6px', 
                      fontSize: '12px', 
                      fontWeight: '500',
                      background: submission.newsletterFrequency === 'weekly' 
                        ? '#dbeafe'
                        : submission.newsletterFrequency === 'monthly'
                        ? '#dcfce7'
                        : '#fef3c7',
                      color: submission.newsletterFrequency === 'weekly' 
                        ? '#1d4ed8'
                        : submission.newsletterFrequency === 'monthly'
                        ? '#15803d'
                        : '#b45309',
                      border: submission.newsletterFrequency === 'weekly' 
                        ? '1px solid #bfdbfe'
                        : submission.newsletterFrequency === 'monthly'
                        ? '1px solid #bbf7d0'
                        : '1px solid #fde68a'
                    }}>
                      {submission.newsletterFrequency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
