declare global {
  /**
   * Number is extended in src/config/extendNative.js
   * This file merely tells TS about new methods
   */
  interface Number {
    fixFloat: (precision: number) => number;
    formatNumeral: (fmt: string) => string;
  }
}

export {};
