// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DataRegistrationPage from "./DataRegistrationPage";

/**
 * App component sets up client-side routes using React Router v6.
 * - "/" redirects to /register
 * - "/register" renders the DataRegistrationPage
 * Add more routes as your app grows.
 */
export default function App() {
  return (
    <Routes>
      {/* Redirect root to register page */}
      <Route path="/" element={<Navigate to="/register" replace />} />

      {/* Main registration route */}
      <Route path="/register" element={<DataRegistrationPage />} />

      {/* Fallback 404 route (simple) */}
      <Route path="*" element={<div className="p-8">Page not found</div>} />
    </Routes>
  );
}

