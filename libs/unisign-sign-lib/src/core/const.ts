/**
 * CAREFUL! DO NOT USE `const enum`, these enums are expected to be used by other projects which depends on the library.
 */

export enum CoinType {
  BTC,
  DOGE = 3,
  CKB = 309,
}

export enum Level {
  Trace,
  Debug,
  Info,
  Warn,
  Error,
}
