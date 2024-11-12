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

// Define a type for the valid model names in Prisma
export type CurrencyOHLCVTNames =
  | 'oHLCVT1'
  | 'oHLCVT5'
  | 'oHLCVT15'
  | 'oHLCVT30'
  | 'oHLCVT60'
  | 'oHLCVT240'
  | 'oHLCVT720'
  | 'oHLCVT1440';

// Define a generic type for the interval to index mapping
export type IntervalToIndexMap<I extends number, T extends number> = Record<
  I,
  T
>;
