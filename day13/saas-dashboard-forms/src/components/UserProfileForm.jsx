import React from 'react';
import { useForm } from 'react-hook-form';

const UserProfileForm = ({ initialData, onSubmitSuccess }) => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initialData || { name: '', email: '', receiveNewsletters: false }
  });

  const receiveNewsletters = watch('receiveNewsletters');

  const onSubmit = async (data) => {
    console.log("Submitting form data:", data);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Profile updated successfully!", data);
      onSubmitSuccess(data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    background: 'white'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      border: '1px solid #e5e7eb'
    }}>
      {/* Form Header - Light Theme */}
      <div style={{
        background: '#f8fafc',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontSize: '20px' }}>👤</span>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: '#1e293b',
          margin: 0
        }}>User Profile Settings</h2>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '24px' }}>
        {/* Name Field */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="name" style={labelStyle}>
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Name is required" })}
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
            placeholder="Enter your name"
          />
          {errors.name && (
            <p style={{ 
              marginTop: '6px', 
              fontSize: '13px', 
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>⚠️</span> {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={labelStyle}>
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { 
              required: "Email is required", 
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" } 
            })}
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p style={{ 
              marginTop: '6px', 
              fontSize: '13px', 
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>⚠️</span> {errors.email.message}
            </p>
          )}
        </div>

        {/* Newsletter Checkbox */}
        <div style={{ 
          marginBottom: '20px',
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            cursor: 'pointer',
            gap: '12px'
          }}>
            <input
              type="checkbox"
              id="receiveNewsletters"
              {...register("receiveNewsletters")}
              style={{
                width: '18px',
                height: '18px',
                accentColor: '#3b82f6',
                cursor: 'pointer',
                marginTop: '2px'
              }}
            />
            <div>
              <span style={{ 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#1f2937',
                display: 'block'
              }}>
                Receive product newsletters and updates
              </span>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                Stay updated with our latest features and news
              </span>
            </div>
          </label>
        </div>

        {/* Newsletter Frequency (Conditional) */}
        {receiveNewsletters && (
          <div style={{ 
            marginBottom: '20px',
            padding: '16px',
            background: '#f0f9ff',
            borderRadius: '8px',
            borderLeft: '4px solid #3b82f6'
          }}>
            <label htmlFor="newsletterFrequency" style={{
              ...labelStyle,
              color: '#0369a1'
            }}>
              Newsletter Frequency
            </label>
            <select
              id="newsletterFrequency"
              {...register("newsletterFrequency")}
              style={{
                ...inputStyle,
                background: 'white',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="weekly">Weekly - Get updates every week</option>
              <option value="monthly">Monthly - Once a month digest</option>
              <option value="quarterly">Quarterly - Every 3 months</option>
            </select>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '14px 24px',
            fontSize: '15px',
            fontWeight: '600',
            color: 'white',
            background: isSubmitting ? '#9ca3af' : '#3b82f6',
            border: 'none',
            borderRadius: '8px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, transform 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.target.style.background = '#2563eb';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.target.style.background = '#3b82f6';
            }
          }}
        >
          {isSubmitting ? (
            <>
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid white',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></span>
              Saving...
            </>
          ) : (
            <>
              Save Profile
            </>
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserProfileForm;
