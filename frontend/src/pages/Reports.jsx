import React from 'react';
import { FileText, Download } from 'lucide-react';

const Reports = () => {
  const handleDownload = (type) => {
    const token = localStorage.getItem('token');
    // Using fetch to trigger download with Auth headers (since simple window.open won't send headers easily)
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    fetch(`${API_BASE}/reports/${type}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">System Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow text-center border-t-4 border-blue-500">
          <FileText size={48} className="mx-auto text-blue-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Inventory Stock Report</h2>
          <p className="text-gray-500 mb-6">Download a complete CSV of all current products and stock levels.</p>
          <button onClick={() => handleDownload('inventory')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 mx-auto">
            <Download size={18} /><span>Export CSV</span>
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center border-t-4 border-green-500">
          <FileText size={48} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Sales Report</h2>
          <p className="text-gray-500 mb-6">Download a complete CSV of all historical sales transactions.</p>
          <button onClick={() => handleDownload('sales')} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 mx-auto">
            <Download size={18} /><span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
