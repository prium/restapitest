export type TransactionType = {
  Date: string;
  Ledger: string;
  Amount: string;
  Company: string;
};

export type TransactionJSONType = {
  totalCount: number;
  page: number;
  transactions: TransactionType[];
};
