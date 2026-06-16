export interface BirdTransaction {
  slNo: number;
  date: string;
  birds: string;
  customerName: string;
  location: string;
  status: string;
  paymentMethod: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  remarks: string;
}

export interface FeedTransaction {
  slNo: number;
  date: string;
  item: string;
  supplierName: string;
  location: string;
  status: string;
  paymentMethod: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  amount: number;
  remarks: string;
}

export interface AppData {
  birds: BirdTransaction[];
  feeds: FeedTransaction[];
}

export type TabType = 'dashboard' | 'birds' | 'feeds' | 'add';
export type TransactionType = 'sell' | 'buy';
