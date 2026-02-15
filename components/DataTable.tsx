
import React from 'react';
import type { Product } from '../types';

interface DataTableProps {
  data: Product[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const headers = [
    'Name', 'HSN Code', 'Category', 'Batch No.', 'Manufacturer', 'Expiry',
    'Qty', 'Purchase Price', 'Selling Price', 'GST (%)', 'Supplier', 'Low Stock'
  ];

  const formatValue = (value: any) => {
    if (value === null || typeof value === 'undefined') {
      return <span className="text-gray-400 dark:text-gray-500">-</span>;
    }
    return String(value);
  };

  if (data.length === 0) {
    return (
        <div className="text-center py-10 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">No data was extracted from the image.</p>
        </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((product, index) => (
            <tr key={index} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/30 transition-colors">
              <td className="px-4 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{formatValue(product.name)}</td>
              <td className="px-4 py-4">{formatValue(product.hsn_code)}</td>
              <td className="px-4 py-4">{formatValue(product.category)}</td>
              <td className="px-4 py-4">{formatValue(product.batch_number)}</td>
              <td className="px-4 py-4">{formatValue(product.manufacturer)}</td>
              <td className="px-4 py-4 whitespace-nowrap">{formatValue(product.expiry_date)}</td>
              <td className="px-4 py-4 text-right">{formatValue(product.quantity)}</td>
              <td className="px-4 py-4 text-right">{formatValue(product.purchase_price)}</td>
              <td className="px-4 py-4 text-right">{formatValue(product.selling_price)}</td>
              <td className="px-4 py-4 text-right">{formatValue(product.gst)}</td>
              <td className="px-4 py-4">{formatValue(product.supplier)}</td>
              <td className="px-4 py-4 text-right">{formatValue(product.low_stock_threshold)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
