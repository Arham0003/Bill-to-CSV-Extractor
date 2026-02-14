
import type { Product } from '../types';

const escapeCsvCell = (cell: any): string => {
  if (cell === null || typeof cell === 'undefined') {
    return '';
  }
  const cellStr = String(cell);
  // If the cell contains a comma, a double quote, or a newline, wrap it in double quotes.
  // Also, any double quotes within the cell must be escaped by doubling them.
  if (/[",\n]/.test(cellStr)) {
    return `"${cellStr.replace(/"/g, '""')}"`;
  }
  return cellStr;
};

export const exportToCsv = (data: Product[], filename: string): void => {
  const headers: (keyof Product)[] = [
    'name', 'hsn_code', 'category', 'batch_number', 'manufacturer', 'expiry_date',
    'quantity', 'purchase_price', 'selling_price', 'gst', 'supplier', 'low_stock_threshold'
  ];

  const headerRow = headers.join(',');

  const rows = data.map(product =>
    headers.map(header => escapeCsvCell(product[header])).join(',')
  );

  const csvContent = [headerRow, ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.href) {
    URL.revokeObjectURL(link.href);
  }
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
