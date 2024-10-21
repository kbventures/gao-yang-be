export interface OHLCVT {
  timestamp: Date; // Use Date object for timestamps
  open: number; // Decimal in PostgreSQL
  high: number; // Decimal in PostgreSQL
  low: number; // Decimal in PostgreSQL
  close: number; // Decimal in PostgreSQL
  volume: number; // Decimal in PostgreSQL
  transactionCount: number;
}

// Tuple type with the same count of properties as OHLCVT, all as strings
export type OHLCVTStrings = [
  string, // timestamp
  string, // open
  string, // high
  string, // low
  string, // close
  string, // volume
  string, // transactionCount
];

export interface KrakenResponse {
  result: Record<string, Array<string>>;
  error: string[];
}

export type TickDataArray = [
  number, // Time (timestamp as an integer)
  string, // Open price
  string, // High price
  string, // Low price
  string, // Close price
  string, // VWAP price
  string, // Volume
  number, // Transaction count (as an integer)
];
