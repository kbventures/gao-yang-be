export interface OHLCVT {
  timestamp: Date; // Use Date object for timestamps
  open: number; // Decimal in PostgreSQL
  high: number; // Decimal in PostgreSQL
  low: number; // Decimal in PostgreSQL
  close: number; // Decimal in PostgreSQL
  volume: number; // Decimal in PostgreSQL
  transactionCount: number;
}
