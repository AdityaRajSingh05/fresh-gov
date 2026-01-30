// // App.jsx
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import DataRegistrationPage from "./components/pages/DataRegistrationPage";
// import StewardDashboard from "./components/pages/DataStewardDashboard";
// import GovernancePolicy from "./components/pages/GovernancePolicy";
// import LoginPage from "./pages/LoginPage";
// import NotFoundPage from "./pages/NotFoundPage";
// import { ProtectedRoute } from "./components/auth/ProtectedRoute";
// import { useAuth } from "./context/AuthContext";

// /**
//  * App component sets up client-side routes using React Router v6 with authentication.
//  * 
//  * Public Routes:
//  * - "/login" - Login page
//  * 
//  * Protected Routes (require authentication):
//  * - "/" - Redirects to /dashboard
//  * - "/dashboard" - Data Steward Dashboard
//  * - "/register" - Data Registration Page
//  * - "/governance" - Governance Policies Page
//  * 
//  * - "*" - 404 Not Found
//  */
// export default function App() {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-white">
//         <div className="text-center">
//           <div className="inline-block">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//           </div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/login" element={<LoginPage />} />

//       {/* Protected Routes */}
//       <Route
//         path="/"
//         element={
//           isAuthenticated ? (
//             <Navigate to="/dashboard" replace />
//           ) : (
//             <Navigate to="/login" replace />
//           )
//         }
//       />

//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <StewardDashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/register"
//         element={
//           <ProtectedRoute>
//             <DataRegistrationPage />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/governance"
//         element={
//           <ProtectedRoute>
//             <GovernancePolicy />
//           </ProtectedRoute>
//         }
//       />

//       {/* Fallback 404 route */}
//       <Route path="*" element={<NotFoundPage />} />
//     </Routes>
//   );
// }



















// NEW CODE:- 
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // 1. PATH FIXED: Based on your image, context is directly in src/context/
// import { AuthProvider } from './context/AuthContext';

// // 2. PATH FIXED: Pages in src/pages/
// import LoginPage from './pages/LoginPage';
// import NotFoundPage from './pages/NotFoundPage.jsx';

// // 3. PATH FIXED: Pages in src/components/pages/
// import DataStewardDashboard from './components/pages/DataStewardDashboard';
// import DataRegistrationPage from './components/pages/DataRegistrationPage';
// import GovernancePolicy from './components/pages/GovernancePolicy';

// function App() {
//   return (
//     /* The AuthProvider must wrap the Router to fix the Header error */
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Landing page */}
//           <Route path="/" element={<LoginPage />} />

//           {/* Dashboard routes */}
//           <Route path="/dashboard" element={<DataStewardDashboard />} />
//           <Route path="/register" element={<DataRegistrationPage />} />
//           <Route path="/governance" element={<GovernancePolicy />} />

//           {/* Fallback routes */}
//           <Route path="/404" element={<NotFoundPage />} />
//           <Route path="*" element={<Navigate to="/404" />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;










// NEW CODE 1- RESPONSIVE:-
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import LoginPage from './pages/LoginPage';
// import NotFoundPage from './pages/NotFoundPage.jsx';
// import DataStewardDashboard from './components/pages/DataStewardDashboard';
// import DataRegistrationPage from './components/pages/DataRegistrationPage';
// import GovernancePolicy from './components/pages/GovernancePolicy';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<LoginPage />} />
//           <Route path="/dashboard" element={<DataStewardDashboard />} />
//           <Route path="/register" element={<DataRegistrationPage />} />
//           <Route path="/governance" element={<GovernancePolicy />} />
//           <Route path="/404" element={<NotFoundPage />} />
//           <Route path="*" element={<Navigate to="/404" replace />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;










// NEW CODE 2 :- WITH MOCK SERVER:-

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Import your Pages/Components
import LoginPage from './pages/LoginPage';
import DataStewardDashboard from './pages/DataStewardDashboard';
import DataRegistrationPage from './pages/DataRegistrationPage';
import LineagePage from './pages/LineagePage'
import NotFoundPage from './pages/NotFoundPage';

// Import Compliance Pages
// ComplianceDashboard and Violations removed as they are unused
import GovernancePolicy from './pages/GovernancePolicy';
import CreatePolicy from './pages/CreatePolicy';
import DataQualityDashboard from './pages/DataQualityDashboard';
import QualityBatchList from './pages/QualityBatchList';
import ComplianceReporting from './pages/ComplianceReporting';


/**
 * ProtectedRoute Component
 * This component wraps any route that requires a user to be logged in.
 * If the user is not authenticated, it redirects them to the Login page.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While checking the authentication status (localStorage/Axios), show a loader
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 font-inter">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-900 font-black tracking-widest uppercase text-xs">Loading Datavista...</p>
        </div>
      </div>
    );
  }

  // If no user is logged in, redirect to the Login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user exists, render the requested page
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Route: Login Page */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected Routes: 
              These will only open if a user from your users.json 
              successfully logs in via the AuthContext.
          */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DataStewardDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <DataRegistrationPage />
              </ProtectedRoute>
            }
          />

          <Route path="/lineage"
            element={
              <ProtectedRoute>
                <LineagePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/governance"
            element={
              <ProtectedRoute>
                <GovernancePolicy />
              </ProtectedRoute>
            }
          />

          <Route
            path="/governance/create"
            element={
              <ProtectedRoute>
                <CreatePolicy />
              </ProtectedRoute>
            }
          />

          {/* Data Quality Routes */}
          <Route
            path="/quality"
            element={
              <ProtectedRoute>
                <QualityBatchList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quality/:id"
            element={
              <ProtectedRoute>
                <DataQualityDashboard />
              </ProtectedRoute>
            }
          />

          {/* Compliance Reporting Route (System Admin Only) */}
          <Route
            path="/compliance-reporting"
            element={
              <ProtectedRoute>
                <ComplianceReporting />
              </ProtectedRoute>
            }
          />

          {/* 404 & Fallback Redirects */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </AuthProvider >
  );
}

export default App;
