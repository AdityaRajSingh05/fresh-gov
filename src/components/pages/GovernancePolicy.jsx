import React, { useState } from "react";
import HeaderClean from "../HeaderClean";
// SidebarClean removed — full-width layout used instead

const SAMPLE_POLICIES = [
    { id: "retention", title: "Data Retention Period", description: "Automated data retention and archival policies." },
    { id: "masking", title: "Masking", description: "Masks sensitive data to protect privacy." },
    { id: "gdpr", title: "GDPR Compliance", description: "Ensures all personal data processing complies with GDPR requirements." },
    { id: "iso", title: "ISO 27001", description: "Information security management system compliance." },
];

const classificationColor = (c) => {
    switch ((c || "").toLowerCase()) {
        case "sensitive":
            return "text-red-600";
        case "confidential":
            return "text-yellow-600";
        case "internal":
            return "text-green-600";
        default:
            return "text-gray-600";
    }
};

export default function GovernancePolicy({ initialName = "" }) {
    const [query, setQuery] = useState("");
    const [dataset, setDataset] = useState(initialName || "");
    const [error, setError] = useState("");
    const [placeholder, setPlaceholder] = useState("Please enter the Dataset Name");

    const handleCheck = (e) => {
        e && e.preventDefault();
        if (!query.trim()) {
            setError("Please Enter the Dataset Name");
            setDataset("");
            setPlaceholder("");
            return;
        }
        setError("");
        setDataset(query.trim());
    };

    const sampleMeta = { Domain: "Sales", Classification: "Sensitive" };

    const severityFor = (id) => {
        switch (id) {
            case 'gdpr':
            case 'retention':
                return { label: 'High', color: 'bg-red-50 text-red-700' };
            case 'masking':
                return { label: 'Medium', color: 'bg-yellow-50 text-yellow-700' };
            case 'iso':
                return { label: 'Low', color: 'bg-green-50 text-green-700' };
            default:
                return { label: 'Info', color: 'bg-gray-50 text-gray-700' };
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <HeaderClean />
            <br />
            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 py-8 px-6">
                <main className="col-span-12">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Governance Policy</h1>
                                <div className="mt-2 text-sm text-light black-250">Check dataset governance rules and compliance requirements</div>
                            </div>

                                <div className="flex items-center gap-3">
                                <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
                                    <svg className="w-5 h-5 text-blue-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <input
                                        aria-label="dataset-search"
                                        value={query}
                                        onChange={(e) => {
                                            setQuery(e.target.value);
                                            if (error) setError("");
                                            if (!placeholder) setPlaceholder("Please enter the Dataset Name");
                                        }}
                                        placeholder={placeholder}
                                        className="bg-transparent placeholder-gray-500 text-gray-900 focus:outline-none w-64"
                                    />
                                </div>

                                <button onClick={handleCheck} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md shadow-md hover:scale-[1.02] transition-transform">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12h14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 5l7 7-7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="text-white font-semibold">Check Policies</span>
                                </button>
                            </div>
                        </header>

                        {error && <div className="mt-4 text-center text-red-600 font-medium">{error}</div>}

                        {dataset ? (
                            <section className="mt-8">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="inline-flex items-center gap-3">
                                            <div className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium">Dataset</div>
                                            <div className="font-semibold text-gray-900">{dataset}</div>
                                        </div>

                                        <div className="text-sm text-gray-600">
                                            <span className="mr-4">Domain: <span className="font-medium text-gray-900">{sampleMeta.Domain}</span></span>
                                            <span>Classification: <span className={`font-medium ${classificationColor(sampleMeta.Classification)}`}>{sampleMeta.Classification}</span></span>
                                        </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {SAMPLE_POLICIES.map((p) => {
                                        const sev = severityFor(p.id);
                                        return (
                                            <article key={p.id} className="relative overflow-hidden rounded-2xl bg-white p-6 border border-gray-100 hover:shadow transition-transform hover:-translate-y-0.5">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-50">
                                                        <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M3 7h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M7 11h10v6H7z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>

                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-900">{p.title}</h3>
                                                        <p className="mt-2 text-sm text-gray-700">{p.description}</p>
                                                        <div className="mt-4 flex items-center justify-between gap-4">
                                                            <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-sm font-medium ${sev.color}`}>{sev.label}</div>
                                                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium"></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </section>
                        ) : (
                            <div className="mt-8 text-center text-gray-400">No dataset selected — enter a dataset name to check policies.</div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

