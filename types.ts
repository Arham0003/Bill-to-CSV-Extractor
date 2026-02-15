
export interface Product {
  name: string;
  hsn_code: string | null;
  category: string | null;
  batch_number: string | null;
  manufacturer: string | null;
  expiry_date: string | null;
  quantity: number | null;
  purchase_price: number | null;
  selling_price: number | null;
  gst: number | null;
  supplier: string | null;
  low_stock_threshold: number | null;
}
