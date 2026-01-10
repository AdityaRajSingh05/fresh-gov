// // main.jsx
// import React from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import { AuthProvider } from "./context/AuthContext";
// import "./index.css"; // Make sure Tailwind directives are in this file

// /**
//  * Standard React 18 entry point.
//  * - Wrap App with BrowserRouter so routing works across the app.
//  * - Wrap with AuthProvider for authentication context.
//  * - Ensure index.css imports Tailwind base/components/utilities.
//  */
// const container = document.getElementById("root");
// const root = createRoot(container);

// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );
















// NEW CODE:-
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Make sure your tailwind styles are here

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
