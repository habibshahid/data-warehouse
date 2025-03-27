import React from 'react';
import { formatMetricValue } from '../utils/formatters';

/**
 * Component for displaying tabular data
 */
const DataTable = ({ data, metrics }) => {
  if (!data || data.length === 0) {
    return <div className="p-4 text-center">No data available for the selected filters.</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 border text-left">Date</th>
            {metrics.map(metric => (
              <th key={metric} className="px-4 py-2 border text-left">{metric}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-4 py-2 border">{row.date}</td>
              {metrics.map(metric => (
                <td key={`${rowIndex}-${metric}`} className="px-4 py-2 border text-right">
                  {formatMetricValue(row[metric], metric)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;