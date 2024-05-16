import cron from "node-cron";
import { FinnhubClient } from "./finnhub";

let finnhubClient: FinnhubClient | null;

const prices = new Map<string, number[]>();
const movingAverageValues = new Map<string, number>();
const valueCountForMovingAverage = 10;

const sum = (a: number, b: number) => a + b;

const runChecks = () => {
  console.log("[scheduler] Running scheduled checks for prices");
  Array.from(prices.keys()).forEach(symbol => {
    finnhubClient?.getQuote(symbol).then(response => {
      console.log(`[scheduler] Scheduled check for symbol: ${symbol}, current price: ${response.currentPrice}`);
      
      let pricesForSymbol = prices.get(symbol);

      if (pricesForSymbol === undefined) {
        pricesForSymbol = [];
      }

      pricesForSymbol.unshift(response.currentPrice);

      if (pricesForSymbol.length > valueCountForMovingAverage) {
        pricesForSymbol = pricesForSymbol.splice(valueCountForMovingAverage);
      }

      prices.set(symbol, pricesForSymbol);
      movingAverageValues.set(symbol, pricesForSymbol.reduce(sum) / pricesForSymbol.length);

      console.log(`[scheduler] Prices for symbol ${symbol}: ${pricesForSymbol}`);
      console.log(`[scheduler] Moving average for symbol ${symbol}: ${pricesForSymbol}`);

    });
  })
};

export const addSymbol = (symbol: string) => {
  console.log(`[scheduler] Added symbol: ${symbol}`);
  prices.set(symbol, []);
};

export const hasSymbol = (symbol: string) => 
  prices.has(symbol);

export const getMovingAverage = (symbol: string): number | undefined => {
  console.log(`[scheduler] Getting moving average for symbol: ${symbol}`);
  return movingAverageValues.get(symbol);
};

export const startScheduler = (finnhub: FinnhubClient) => {
  finnhubClient = finnhub;

  cron.schedule('* * * * *', () => {
    runChecks();
  });
};
