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
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. PATH FIXED: Based on your image, context is directly in src/context/
import { AuthProvider } from './context/AuthContext';

// 2. PATH FIXED: Pages in src/pages/
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage.jsx';

// 3. PATH FIXED: Pages in src/components/pages/
import DataStewardDashboard from './components/pages/DataStewardDashboard';
import DataRegistrationPage from './components/pages/DataRegistrationPage';
import GovernancePolicy from './components/pages/GovernancePolicy';

function App() {
  return (
    /* The AuthProvider must wrap the Router to fix the Header error */
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<LoginPage />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DataStewardDashboard />} />
          <Route path="/register" element={<DataRegistrationPage />} />
          <Route path="/governance" element={<GovernancePolicy />} />

          {/* Fallback routes */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;