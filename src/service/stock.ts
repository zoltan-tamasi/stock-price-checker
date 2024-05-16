import cron from "node-cron";
import { FinnhubClient } from "./finnhub";
import { FinnhubNotInitializedError } from "./errors";

let finnhubClient: FinnhubClient | null;

const prices = new Map<string, number[]>();
const movingAverageValues = new Map<string, number>();
const valueCountForMovingAverage = 10;

const sum = (a: number, b: number) => a + b;

const addNewPriceValue = (symbol: string, value: number) => {
  let pricesForSymbol = prices.get(symbol);

  if (pricesForSymbol === undefined) {
    pricesForSymbol = [];
  }

  pricesForSymbol.unshift(value);

  if (pricesForSymbol.length > valueCountForMovingAverage) {
    pricesForSymbol = pricesForSymbol.splice(valueCountForMovingAverage);
  }

  prices.set(symbol, pricesForSymbol);
  console.log(`[scheduler] Prices for symbol ${symbol}: ${pricesForSymbol}`);
};

const calculateMovingAverage = (symbol: string) => {
  let pricesForSymbol = prices.get(symbol);

  if (pricesForSymbol === undefined) {
    pricesForSymbol = [];
  }

  movingAverageValues.set(symbol, pricesForSymbol.reduce(sum) / pricesForSymbol.length);
  console.log(`[scheduler] Moving average for symbol ${symbol}: ${pricesForSymbol}`);
};

const runChecks = () => {
  console.log("[scheduler] Running scheduled checks for prices");
  Array.from(prices.keys()).forEach(symbol => {
    finnhubClient?.getQuote(symbol).then(response => {
      console.log(`[scheduler] Scheduled check for symbol: ${symbol}, current price: ${response.currentPrice}`);
      
      addNewPriceValue(symbol, response.currentPrice);
      calculateMovingAverage(symbol);
    });
  })
};

export const addSymbol = (symbol: string): Promise<void> => {
  if (finnhubClient === null) {
    return Promise.reject(new FinnhubNotInitializedError());
  }
  return finnhubClient.getQuote(symbol)
    .then(response => {
      response.currentPrice
      console.log(`[scheduler] Added symbol: ${symbol} with current price: ${response.currentPrice}`);
      prices.set(symbol, [response.currentPrice]);
      movingAverageValues.set(symbol, response.currentPrice);
    });
}


export const hasSymbol = (symbol: string) => 
  prices.has(symbol);

export const getMovingAverage = (symbol: string): number | undefined => {
  console.log(`[scheduler] Getting moving average for symbol: ${symbol}`);
  return movingAverageValues.get(symbol);
};

export const getStockService = (finnhub: FinnhubClient) => {
  finnhubClient = finnhub;

  cron.schedule('* * * * *', () => {
    runChecks();
  });
};
