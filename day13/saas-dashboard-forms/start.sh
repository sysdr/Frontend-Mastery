#!/bin/bash

# --- Configuration ---
PROJECT_NAME="saas-dashboard-forms"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=3000

# --- Helper Functions ---
log_info() {
  echo -e "\e[32m[INFO] $1\e[0m"
}

log_warn() {
  echo -e "\e[33m[WARN] $1\e[0m"
}

log_error() {
  echo -e "\e[31m[ERROR] $1\e[0m"
  exit 1
}

# --- Project Setup ---
setup_project() {
  cd "$SCRIPT_DIR" || log_error "Failed to navigate to script directory."
  
  if [ -f "package.json" ]; then
    log_warn "Project already initialized. Skipping Vite creation."
  else
    log_info "Creating React project with Vite: $PROJECT_NAME"
    # Save current scripts before Vite overwrites the directory
    cp start.sh /tmp/start.sh.bak 2>/dev/null || true
    cp stop.sh /tmp/stop.sh.bak 2>/dev/null || true
    cp test.sh /tmp/test.sh.bak 2>/dev/null || true
    
    cd ..
    rm -rf "$PROJECT_NAME"
    yes | npx create-vite@latest "$PROJECT_NAME" --template react || log_error "Failed to create Vite project."
    cd "$SCRIPT_DIR" || log_error "Failed to navigate into project directory."
    
    # Restore scripts
    cp /tmp/start.sh.bak start.sh 2>/dev/null || true
    cp /tmp/stop.sh.bak stop.sh 2>/dev/null || true
    cp /tmp/test.sh.bak test.sh 2>/dev/null || true
    chmod +x start.sh stop.sh test.sh 2>/dev/null || true
  fi

  log_info "Installing dependencies..."
  npm install || log_error "Failed to install npm dependencies."
  npm install react-hook-form || log_error "Failed to install react-hook-form."
  npm install -D tailwindcss postcss autoprefixer || log_error "Failed to install Tailwind dependencies."

  log_info "Initializing Tailwind CSS..."
  npx tailwindcss init -p 2>/dev/null || log_info "Tailwind config already exists."

  log_info "Generating source code files..."

  # Create src/components directory
  mkdir -p src/components || log_error "Failed to create src/components directory."

  # Create UserProfileForm.jsx
  cat <<'EOF' > src/components/UserProfileForm.jsx
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
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Profile updated successfully!", data);
      onSubmitSuccess(data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Profile Settings</h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          {...register("name", { required: "Name is required" })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" } })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="receiveNewsletters"
          {...register("receiveNewsletters")}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="receiveNewsletters" className="ml-2 block text-sm text-gray-900">
          Receive product newsletters and updates
        </label>
      </div>

      {receiveNewsletters && (
        <div className="pl-6 border-l-2 border-blue-200">
          <label htmlFor="newsletterFrequency" className="block text-sm font-medium text-gray-700">
            Newsletter Frequency
          </label>
          <select
            id="newsletterFrequency"
            {...register("newsletterFrequency")}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
};

export default UserProfileForm;
EOF

  # Create Dashboard.jsx for metrics display
  cat <<'EOF' > src/components/Dashboard.jsx
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
    // Calculate metrics from form submissions
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

  const MetricCard = ({ title, value, subtitle, color = 'blue' }) => (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 border-${color}-500`}>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
      <p className={`text-3xl font-bold text-${color}-600 mt-1`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-inner">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📊</span> Dashboard Metrics
        {lastUpdateTime && (
          <span className="ml-auto text-xs text-gray-400">
            Last updated: {new Date(lastUpdateTime).toLocaleTimeString()}
          </span>
        )}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <MetricCard 
          title="Total Submissions" 
          value={metrics.totalSubmissions} 
          subtitle="All time"
          color="blue"
        />
        <MetricCard 
          title="Newsletter Subscribers" 
          value={metrics.newsletterSubscribers} 
          subtitle={`${metrics.totalSubmissions > 0 ? Math.round((metrics.newsletterSubscribers / metrics.totalSubmissions) * 100) : 0}% opt-in rate`}
          color="green"
        />
        <MetricCard 
          title="Avg Response Time" 
          value={`${metrics.avgResponseTime}ms`} 
          subtitle="Server response"
          color="purple"
        />
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Newsletter Frequency Breakdown</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Weekly</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${metrics.newsletterSubscribers > 0 ? (metrics.weeklySubscribers / metrics.newsletterSubscribers) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700 w-8">{metrics.weeklySubscribers}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Monthly</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${metrics.newsletterSubscribers > 0 ? (metrics.monthlySubscribers / metrics.newsletterSubscribers) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700 w-8">{metrics.monthlySubscribers}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Quarterly</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${metrics.newsletterSubscribers > 0 ? (metrics.quarterlySubscribers / metrics.newsletterSubscribers) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700 w-8">{metrics.quarterlySubscribers}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent Submissions</h3>
        {formSubmissions.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No submissions yet. Fill out the form to see metrics update!</p>
        ) : (
          <div className="max-h-32 overflow-y-auto">
            {formSubmissions.slice(-5).reverse().map((submission, idx) => (
              <div key={idx} className="text-xs text-gray-600 py-1 border-b border-gray-100 last:border-0">
                <span className="font-medium">{submission.name}</span> - {submission.email}
                {submission.receiveNewsletters && (
                  <span className="ml-2 px-1 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                    {submission.newsletterFrequency}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
EOF

  # Modify src/App.jsx
  cat <<'EOF' > src/App.jsx
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Day 13: React Hook Form Dashboard</h1>
          <p className="text-gray-600 mt-2">Efficient form management with real-time metrics</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <UserProfileForm initialData={userProfile} onSubmitSuccess={handleProfileUpdate} />
            
            <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
              <h3 className="font-semibold text-gray-700 mb-2">Current Profile State:</h3>
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(userProfile, null, 2)}</pre>
            </div>
          </div>

          <div>
            <Dashboard 
              userProfile={userProfile} 
              formSubmissions={formSubmissions}
              lastUpdateTime={lastUpdateTime}
            />
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Submit the form multiple times to see dashboard metrics update in real-time!</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
EOF

  # Modify src/main.jsx
  cat <<'EOF' > src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
EOF

  # Modify src/index.css for Tailwind
  cat <<'EOF' > src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}
EOF

  # Update tailwind.config.js
  cat <<'EOF' > tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'border-blue-500',
    'border-green-500',
    'border-purple-500',
    'border-yellow-500',
    'text-blue-600',
    'text-green-600',
    'text-purple-600',
    'text-yellow-600',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

  log_info "Source code generation complete."
}

# --- Build and Run (Local) ---
run_local() {
  cd "$SCRIPT_DIR" || log_error "Failed to navigate to script directory."
  
  log_info "Building project locally..."
  npm run build || log_error "Failed to build project locally."

  log_info "Launching project locally. Open your browser to http://localhost:$PORT"
  npm run dev -- --host &
  NPM_PID=$!
  echo "$NPM_PID" > .npm_pid
  log_info "Vite development server started with PID: $NPM_PID"
  log_info "Press Ctrl+C to stop the server, or run stop.sh"
}

# --- Docker Setup ---
create_dockerfile() {
  log_info "Creating Dockerfile..."
  cat <<'EOF' > Dockerfile
# Stage 1: Build the React application
FROM node:20-alpine as builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
EOF
  log_info "Dockerfile created."
}

# --- Build and Run (Docker) ---
run_docker() {
  create_dockerfile
  log_info "Building Docker image: $PROJECT_NAME"
  docker build -t "$PROJECT_NAME" . || log_error "Failed to build Docker image."

  log_info "Running Docker container. Access at http://localhost:$PORT"
  docker run -d -p "$PORT":80 --name "$PROJECT_NAME-container" "$PROJECT_NAME" || log_error "Failed to run Docker container."
  log_info "Docker container '$PROJECT_NAME-container' started."
  log_info "Use 'docker stop $PROJECT_NAME-container' and 'docker rm $PROJECT_NAME-container' to stop and remove it."
}

# --- Main Logic ---
main() {
  echo "--- Modern Frontend Mastery: Building Dynamic Forms ---"
  echo "--- Day 13: React Hook Form for Efficient Input Management ---"
  echo ""

  USE_DOCKER="${1:-N}"
  
  setup_project

  if [[ "$USE_DOCKER" =~ ^[Yy]$ ]]; then
    run_docker
  else
    run_local
  fi

  log_info "Demo and verification: Open your web browser and navigate to http://localhost:$PORT"
  log_info "  - Fill the form, observe client-side validation messages."
  log_info "  - Toggle 'Receive newsletters' and see the 'Newsletter Frequency' field appear/disappear."
  log_info "  - Submit the form multiple times to see dashboard metrics update."
  log_info "  - Check the browser console for the submitted data."
}

main "$@"
