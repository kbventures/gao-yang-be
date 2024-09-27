import {
  OHLCVT1,
  OHLCVT5,
  OHLCVT15,
  OHLCVT30,
  OHLCVT60,
  OHLCVT240,
  OHLCVT720,
  OHLCVT1440,
} from './OHLCVT';

export interface CurrencyPair {
  name: String;
  ohlvct1: OHLCVT1[];
  ohlvct5: OHLCVT5[];
  ohlvct15: OHLCVT15[];
  ohlvct30: OHLCVT30[];
  ohlvct60: OHLCVT60[];
  ohlvct240: OHLCVT240[];
  ohlvct720: OHLCVT720[];
  ohlvct1440: OHLCVT1440[];
}
