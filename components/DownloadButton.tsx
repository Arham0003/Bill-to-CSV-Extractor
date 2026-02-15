
import React from 'react';
import type { Product } from '../types';
import { exportToCsv } from '../utils/csvExporter';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  data: Product[];
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ data }) => {
  const handleDownload = () => {
    const filename = `bill_data_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCsv(data, filename);
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
    >
      <Download className="w-4 h-4 mr-2" />
      Download CSV
    </button>
  );
};

export default DownloadButton;
