// src/components/UserProfileForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userProfileSchema, UserProfileFormData } from '../schemas';

interface SubmittedProfile {
  name: string;
  email: string;
  age: number;
  submittedAt: string;
}

const UserProfileForm: React.FC = () => {
  const [submittedProfiles, setSubmittedProfiles] = useState<SubmittedProfile[]>([]);
  const [submissionCount, setSubmissionCount] = useState(0);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
    watch
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      age: NaN
    }
  });

  const watchedValues = watch();

  const onSubmit = (data: UserProfileFormData) => {
    console.log("Form Data Submitted:", data);
    const newProfile: SubmittedProfile = {
      ...data,
      submittedAt: new Date().toLocaleString()
    };
    setSubmittedProfiles(prev => [newProfile, ...prev]);
    setSubmissionCount(prev => prev + 1);
    reset();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
        <h1 className="text-3xl font-bold">SaaS Dashboard - Day 14</h1>
        <p className="text-blue-100 mt-2">React Hook Form with Zod Validation</p>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm font-medium">Total Submissions</p>
          <p className="text-3xl font-bold text-blue-600" data-testid="submission-count">{submissionCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <p className="text-gray-500 text-sm font-medium">Profiles Created</p>
          <p className="text-3xl font-bold text-green-600" data-testid="profiles-count">{submittedProfiles.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm font-medium">Form Status</p>
          <p className="text-xl font-bold text-purple-600" data-testid="form-status">
            {isDirty ? (isValid ? 'Valid' : 'Invalid') : 'Empty'}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
          <p className="text-gray-500 text-sm font-medium">Error Count</p>
          <p className="text-3xl font-bold text-orange-600" data-testid="error-count">{Object.keys(errors).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white">
        {/* Form Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Your Profile</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className={`mt-1 block w-full border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-600 text-xs mt-1" data-testid="name-error">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`mt-1 block w-full border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="john.doe@example.com"
              />
              {errors.email && <p className="text-red-600 text-xs mt-1" data-testid="email-error">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age:</label>
              <input
                id="age"
                type="number"
                {...register('age', { valueAsNumber: true })}
                className={`mt-1 block w-full border ${errors.age ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="e.g., 30"
              />
              {errors.age && <p className="text-red-600 text-xs mt-1" data-testid="age-error">{errors.age.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white 
                ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out`}
            >
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          {/* Live Preview */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Live Preview</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Name:</strong> {watchedValues.name || '-'}</p>
              <p><strong>Email:</strong> {watchedValues.email || '-'}</p>
              <p><strong>Age:</strong> {watchedValues.age || '-'}</p>
            </div>
          </div>
        </div>

        {/* Submitted Profiles Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Submitted Profiles</h2>
          {submittedProfiles.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No profiles submitted yet.</p>
              <p className="text-sm mt-2">Fill out the form to see submissions here.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {submittedProfiles.map((profile, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500" data-testid="profile-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{profile.name}</h3>
                      <p className="text-sm text-gray-600">{profile.email}</p>
                      <p className="text-sm text-gray-600">Age: {profile.age}</p>
                    </div>
                    <span className="text-xs text-gray-400">{profile.submittedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white p-4 rounded-b-lg text-center">
        <p className="text-sm">Day 14: Form Validation with React Hook Form + Zod</p>
      </div>
    </div>
  );
};

export default UserProfileForm;
