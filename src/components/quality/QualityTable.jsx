import React, { useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiChevronDown, FiChevronUp, FiCode } from 'react-icons/fi';

const QualityTable = ({ data }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  return (
    /* 'overflow-x-auto' allows horizontal scrolling on small screens */
    <div className="overflow-x-auto w-full">
      <table className="min-w-[800px] w-full text-left">
        <thead>
          <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-50">
            <th className="px-4 md:px-8 py-5">ID</th>
            <th className="px-4 md:px-8 py-5">Field Name</th>
            <th className="px-4 md:px-8 py-5 text-center">Score</th>
            <th className="px-4 md:px-8 py-5">Status</th>
            <th className="px-4 md:px-8 py-5">Diagnostic Detail</th>
            <th className="px-4 md:px-8 py-5"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <React.Fragment key={row.id}>
              <tr onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)} 
                  className="hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors">
                <td className="px-4 md:px-8 py-6 font-mono text-xs text-slate-400">{row.id}</td>
                <td className="px-4 md:px-8 py-6 font-bold text-slate-800">{row.field}</td>
                <td className={`px-4 md:px-8 py-6 text-center font-bold ${row.score < 70 ? 'text-rose-500' : 'text-emerald-500'}`}>{row.score}%</td>
                <td className="px-4 md:px-8 py-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold ${row.status === 'FAIL' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {row.status === 'PASS' ? <FiCheckCircle size={12} /> : <FiAlertCircle size={12} />} {row.status}
                  </span>
                </td>
                <td className="px-4 md:px-8 py-6 text-sm text-slate-500 italic truncate max-w-xs">{row.details}</td>
                <td className="px-4 md:px-8 py-6 text-slate-400">{expandedRow === row.id ? <FiChevronUp /> : <FiChevronDown />}</td>
              </tr>
              {expandedRow === row.id && (
                <tr className="bg-[#0f172a]">
                  <td colSpan="6" className="px-6 md:px-12 py-8">
                    <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase mb-4"><FiCode /> Metadata View</div>
                    <pre className="text-xs font-mono text-emerald-400 bg-slate-900/50 p-4 md:p-6 rounded-xl border border-slate-800 overflow-x-auto">
                      {JSON.stringify(row.json_response, null, 2)}
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