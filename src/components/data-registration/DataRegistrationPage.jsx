/**
 * DataRegistrationPage.jsx
 *
 * Data Registration page component using Tailwind CSS utilities only.
 * - All inputs start empty and include clear placeholders.
 * - "Register Dataset" button appears first, then "Create Lineage".
 * - Refresh Frequency field removed as requested.
 * - Validation rules editor with JSON preview.
 * - Create Lineage shows: "Lineage Creation is Going on Just Have Little patience."
 *
 * Place this file at:
 *   src/components/dataRegistration/DataRegistrationPage.jsx
 *
 * Note: Tailwind CSS must be available in your project for styling to work.
 */

import React, { useState } from "react";

/* Reusable select style (Tailwind utilities only) */
const SELECT_STYLE =
  "w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

/* Small labeled select component with placeholder support */
function LabeledSelect({ label, value, onChange, options, required = false }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        className={SELECT_STYLE}
        value={value}
        onChange={onChange}
        aria-label={label}
      >
        {/* Placeholder option */}
        <option value="">{`-- Select ${label} --`}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

/* DynamicList for Upstream/Downstream sources with placeholders */
function DynamicList({ title, items, setItems, options, placeholder = "Select source" }) {
  const addItem = () => setItems([...items, ""]);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx, val) => setItems(items.map((it, i) => (i === idx ? val : it)));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-indigo-600 to-blue-500 text-white rounded-md text-sm shadow-sm hover:opacity-95 focus:outline-none"
        >
          + Add
        </button>
      </div>

      {items.length === 0 && <p className="text-xs text-gray-500">No {title.toLowerCase()} added yet.</p>}

      <div className="space-y-2">
        {items.map((val, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <select
              className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={val}
              onChange={(e) => updateItem(idx, e.target.value)}
            >
              <option value="">{`-- ${placeholder} --`}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="w-9 h-9 rounded-md bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 flex items-center justify-center"
              aria-label={`Remove ${title} ${idx + 1}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ValidationRulesEditor: structured UI to add rules and preview JSON */
function ValidationRulesEditor({ rules, setRules }) {
  // Local inputs for adding a rule
  const [fieldName, setFieldName] = useState("");
  const [ruleType, setRuleType] = useState("UNIQUE_CONSTRAINT");
  const [argKey, setArgKey] = useState("");
  const [argValue, setArgValue] = useState("");

  // Add a rule to the rules object
  const addRule = () => {
    if (!fieldName.trim() || !ruleType) return;
    const newRules = { ...rules };
    const ruleObj = { args: {}, rule: ruleType };

    if (argKey.trim() !== "") {
      try {
        const parsed = JSON.parse(argValue);
        ruleObj.args[argKey] = parsed;
      } catch {
        ruleObj.args[argKey] = argValue;
      }
    }

    if (!newRules[fieldName]) newRules[fieldName] = [];
    newRules[fieldName].push(ruleObj);

    setRules(newRules);

    // reset small inputs
    setFieldName("");
    setArgKey("");
    setArgValue("");
    setRuleType("UNIQUE_CONSTRAINT");
  };

  // Remove a specific rule by index
  const removeRule = (field, idx) => {
    const newRules = { ...rules };
    newRules[field] = newRules[field].filter((_, i) => i !== idx);
    if (newRules[field].length === 0) delete newRules[field];
    setRules(newRules);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">Validation Rules</h4>
        <div className="text-xs text-gray-500">Add field-level rules (JSON preview below)</div>
      </div>

      {/* Add rule inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          className="col-span-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          placeholder="Field name (e.g., voucher_code)"
          aria-label="Field name"
        />

        <select
          className="col-span-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={ruleType}
          onChange={(e) => setRuleType(e.target.value)}
          aria-label="Rule type"
        >
          <option value="UNIQUE_CONSTRAINT">UNIQUE_CONSTRAINT</option>
          <option value="NOT_NULL">NOT_NULL</option>
          <option value="REGEX_MATCH">REGEX_MATCH</option>
          <option value="RANGE">RANGE</option>
          <option value="TYPE_CHECK">TYPE_CHECK</option>
        </select>

        <input
          className="col-span-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={argKey}
          onChange={(e) => setArgKey(e.target.value)}
          placeholder="arg key (optional)"
          aria-label="Argument key"
        />

        <input
          className="col-span-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={argValue}
          onChange={(e) => setArgValue(e.target.value)}
          placeholder='arg value (optional, JSON or string)'
          aria-label="Argument value"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={addRule}
          className="px-4 py-2 bg-linear-to-r from-indigo-600 to-blue-500 text-white rounded-md text-sm shadow-sm hover:opacity-95 focus:outline-none"
        >
          Add Rule
        </button>

        <div className="text-sm text-gray-500">Rules are shown as JSON preview below.</div>
      </div>

      {/* Rules list */}
      <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
        {Object.keys(rules).length === 0 ? (
          <div className="text-xs text-gray-500">No validation rules defined yet.</div>
        ) : (
          Object.entries(rules).map(([field, arr]) => (
            <div key={field} className="mb-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">{field}</div>
                <div className="text-xs text-gray-500">{arr.length} rule(s)</div>
              </div>

              <div className="mt-2 space-y-2">
                {arr.map((r, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 bg-white border border-gray-100 rounded-md p-2">
                    <div className="text-xs text-gray-700">
                      <div><strong>rule:</strong> {r.rule}</div>
                      <div className="text-gray-500"><strong>args:</strong> {JSON.stringify(r.args)}</div>
                    </div>
                    <button
                      onClick={() => removeRule(field, idx)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* JSON preview */}
      <div>
        <div className="text-xs text-gray-500 mb-2">JSON Preview</div>
        <pre className="bg-black text-white text-xs rounded-md p-3 overflow-auto" style={{ maxHeight: 220 }}>
          {JSON.stringify(rules, null, 2)}
        </pre>
      </div>
    </div>
  );
}

/* Main DataRegistrationPage component */
export default function DataRegistrationPage() {
  /* All inputs start empty so user fills them; placeholders guide input */
  const [owner, setOwner] = useState("");
  const [department, setDepartment] = useState("");
  const [dataSource, setDataSource] = useState("");
  const [classification, setClassification] = useState("");
  const [upstream, setUpstream] = useState([]); // user will add entries
  const [downstream, setDownstream] = useState([]); // user will add entries
  const [datasetName, setDatasetName] = useState("");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [ownerContact, setOwnerContact] = useState("");
  const [rules, setRules] = useState({}); // start empty

  /* UI state for toasts and spinner */
  const [creating, setCreating] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [registeredVisible, setRegisteredVisible] = useState(false);

  /* Option lists */
  const OWNER_OPTIONS = ["Ferrari", "Tata Motors", "Maruti Suzuki"];
  const DEPT_OPTIONS = ["Sales", "Finance", "HR"];
  const DATASOURCE_OPTIONS = ["CSV", "JSON", "XLS"];
  const CLASSIFICATION_OPTIONS = ["Public", "Internal", "confidential", "Restricted"];
  const UPSTREAM_OPTIONS = ["Data sourcing", "CRM team"];
  const DOWNSTREAM_OPTIONS = ["CRM team", "marketing", "promotions"];

  /* Create Lineage action: shows requested message */
  const handleCreateLineage = () => {
    setCreating(true);
    setMessageVisible(true);

    setTimeout(() => {
      setCreating(false);
      // message remains visible until user dismisses it
    }, 1500);
  };

  /* Register Dataset: simulate saving metadata and show success toast */
  const handleRegisterDataset = () => {
    const payload = {
      datasetName,
      owner,
      ownerContact,
      department,
      domain,
      description,
      dataSource,
      classification,
      upstream,
      downstream,
      rules,
    };

    // Log payload (replace with API call in real app)
    console.log("Registering dataset payload:", payload);

    setRegisteredVisible(true);
    setTimeout(() => setRegisteredVisible(false), 3000);
  };

  /* Reset form to empty values */
  const handleReset = () => {
    setOwner("");
    setDepartment("");
    setDataSource("");
    setClassification("");
    setUpstream([]);
    setDownstream([]);
    setDatasetName("");
    setDomain("");
    setDescription("");
    setOwnerContact("");
    setRules({});
    setMessageVisible(false);
    setRegisteredVisible(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 via-blue-100 to-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header: improved subtitle so it reads like a heading, not a button */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-4">
              <h1 className="text-2xl font-extrabold text-gray-900">Data Registration</h1>
              <p className="text-sm text-gray-600">Register dataset metadata and manage lineage</p>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Fill dataset details, add upstream/downstream sources and validation rules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-700 bg-white px-3 py-2 rounded-md shadow-sm">You (Data Steward)</div>
            <button className="px-3 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-400">Logout</button>
          </div>
        </header>

        {/* Bluish panel behind the card */}
        <div className="rounded-2xl bg-linear-to-r from-blue-50 to-blue-100 p-6 shadow-sm">
          <main className="bg-white rounded-xl p-6 shadow-lg">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Top row: Owner, Department, Data Source */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LabeledSelect
                  label="Owner"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  options={OWNER_OPTIONS}
                  required
                />

                <LabeledSelect
                  label="Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  options={DEPT_OPTIONS}
                  required
                />

                <LabeledSelect
                  label="Data Source"
                  value={dataSource}
                  onChange={(e) => setDataSource(e.target.value)}
                  options={DATASOURCE_OPTIONS}
                />
              </div>

              {/* Classification and Dataset Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LabeledSelect
                  label="Classification"
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                  options={CLASSIFICATION_OPTIONS}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Dataset Name</label>
                  <input
                    className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    placeholder="e.g., external_leads_feed"
                    aria-label="Dataset Name"
                  />
                </div>
              </div>

              {/* Domain and Short Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Domain</label>
                  <input
                    className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g., Sales"
                    aria-label="Domain"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Short Description</label>
                  <input
                    className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the dataset"
                    aria-label="Short Description"
                  />
                </div>
              </div>

              {/* Owner contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Owner Contact</label>
                  <input
                    className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={ownerContact}
                    onChange={(e) => setOwnerContact(e.target.value)}
                    placeholder="owner email or slack (e.g., data.steward@example.com)"
                    aria-label="Owner Contact"
                  />
                </div>

                {/* Empty column kept for layout balance; can be used later */}
                <div />
              </div>

              {/* Upstream / Downstream dynamic lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DynamicList
                  title="Upstream Source"
                  items={upstream}
                  setItems={setUpstream}
                  options={UPSTREAM_OPTIONS}
                  placeholder="Upstream source"
                />
                <DynamicList
                  title="Downstream Source"
                  items={downstream}
                  setItems={setDownstream}
                  options={DOWNSTREAM_OPTIONS}
                  placeholder="Downstream source"
                />
              </div>

              {/* Validation rules editor */}
              <ValidationRulesEditor rules={rules} setRules={setRules} />

              {/* Action row: Register Dataset (left) then Create Lineage (right) */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Register Dataset: primary action for saving metadata */}
                  <button
                    type="button"
                    onClick={handleRegisterDataset}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-600 to-emerald-500 text-white rounded-md shadow-sm hover:opacity-95 focus:outline-none"
                  >
                    Register Dataset
                  </button>

                  {/* Create Lineage: secondary action that triggers lineage creation message */}
                  <button
                    type="button"
                    onClick={handleCreateLineage}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-600 to-blue-500 text-white rounded-md shadow-sm hover:opacity-95 focus:outline-none"
                  >
                    {creating ? (
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.25" strokeWidth="4" />
                        <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    ) : null}
                    Create Lineage
                  </button>

                  {/* Reset button */}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Reset
                  </button>
                </div>

                <div className="text-sm text-gray-500">
                  <strong>Tip:</strong> Add multiple upstream/downstream sources and validation rules as needed.
                </div>
              </div>
            </form>
          </main>
        </div>

        {/* Lineage message toast */}
        {messageVisible && (
          <div className="fixed right-6 bottom-6 max-w-sm w-full">
            <div className="bg-white border-l-4 border-indigo-600 shadow-lg rounded-md p-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
                    i
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">Lineage Creation</div>
                  <div className="mt-1 text-sm text-gray-600">
                    Lineage Creation is Going on Just Have Little patience.
                  </div>
                </div>

                <div className="ml-3">
                  <button
                    onClick={() => setMessageVisible(false)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Close message"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registered success toast{} Registered*/}
        {registeredVisible && (
          <div className="fixed left-6 bottom-6 max-w-sm w-full">
            <div className="bg-white border-l-4 border-green-600 shadow-lg rounded-md p-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-semibold">
                    ✓
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">Dataset Registered</div>
                  <div className="mt-1 text-sm text-gray-600">Dataset metadata saved successfully.</div>
                </div>

                <div className="ml-3">
                  <button
                    onClick={() => setRegisteredVisible(false)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Close message"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer removed as requested */}
      </div>
    </div>
  );
}
