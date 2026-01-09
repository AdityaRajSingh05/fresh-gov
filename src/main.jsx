// main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // Make sure Tailwind directives are in this file

/**
 * Standard React 18 entry point.
 * - Wrap App with BrowserRouter so routing works across the app.
 * - Ensure index.css imports Tailwind base/components/utilities.
 */
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
