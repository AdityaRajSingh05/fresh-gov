import React, { useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiChevronDown, FiChevronUp, FiCode } from 'react-icons/fi';

const QualityTable = ({ data }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  if (data.length === 0) return (
    <div className="p-20 text-center text-muted-foreground font-medium">No data quality issues match your filter.</div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th className="col-id">ID</th>
            <th className="col-name">Field Name</th>
            <th className="col-type text-center">Score</th>
            <th className="col-status">Status</th>
            <th className="col-name">Diagnostic Detail</th>
            <th className="col-actions"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <React.Fragment key={row.id}>
              <tr
                onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                className="hover:bg-muted/50 transition-all cursor-pointer"
              >
                <td className="font-mono text-xs text-muted-foreground col-id">{row.id}</td>
                <td className="font-semibold col-name">{row.field}</td>
                <td className={`text-center font-bold col-type ${row.score < 70 ? 'text-red-600' : 'text-green-600'}`}>{row.score}%</td>
                <td className="col-status">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium ${row.status === 'FAIL' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {row.status === 'PASS' ? <FiCheckCircle size={12} /> : <FiAlertCircle size={12} />} {row.status}
                  </div>
                </td>
                <td className="text-sm text-muted-foreground col-name">
                  {row.details || <span className="text-muted-foreground/50 flex items-center gap-1"><FiInfo size={14} /> — Not Available</span>}
                </td>
                <td className="text-muted-foreground col-actions">
                  {expandedRow === row.id ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                </td>
              </tr>

              {/* JSON TECHNICAL RESPONSE VIEW */}
              {expandedRow === row.id && (
                <tr className="bg-slate-900">
                  <td colSpan="6" className="px-10 py-6">
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase mb-4">
                      <FiCode size={14} /> Rule Metadata JSON Response
                    </div>
                    <pre className="text-xs font-mono text-green-400 leading-relaxed overflow-x-auto">
                      {row.json_response ? JSON.stringify(row.json_response, null, 2) : "// No JSON payload generated for this run."}
                    </pre>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QualityTable;