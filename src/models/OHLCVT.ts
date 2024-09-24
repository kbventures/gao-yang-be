// Timestamp Open High low Close Volume Transaction Count
export interface OHLCVT1 {
    id: number;
    timestamp: Date; // Use Date object for timestamps
    open: number;    // Decimal in PostgreSQL
    high: number;    // Decimal in PostgreSQL
    low: number;     // Decimal in PostgreSQL
    close: number;   // Decimal in PostgreSQL
    volume: number;  // Decimal in PostgreSQL
    transactionCount: number;
    createdAt: Date;
    updatedAt: Date;
    currencyPairId: string; // Foreign key to CurrencyPair
  }

export interface OHLCVT5 extends OHLCVT1{};
export interface OHLCVT15 extends OHLCVT1{};
export interface OHLCVT30 extends OHLCVT1{};
export interface OHLCVT60 extends OHLCVT1{};
export interface OHLCVT240 extends OHLCVT1{};
export interface OHLCVT720 extends OHLCVT1{};
export interface OHLCVT1440 extends OHLCVT1{};