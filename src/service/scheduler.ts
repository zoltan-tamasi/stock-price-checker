import cron from "node-cron";
import { FinnhubClient } from "./finnhub";

const prices = new Map<string, number>();

let finnhubClient: FinnhubClient | null;

const runChecks = () => {
  console.log("[scheduler] Running scheduled checks for prices");
  Array.from(prices.keys()).forEach(symbol => {
    finnhubClient?.getQuote(symbol).then(response => {
      console.log(`[scheduler] Scheduled check for symbol: ${symbol}, current price: ${response.currentPrice}`);
      prices.set(symbol, response.currentPrice);
    });
  })
};

export const addSymbol = (symbol: string) => {
  console.log(`[scheduler] Added symbol: ${symbol}`);
  prices.set(symbol, 0);
};

export const startScheduler = (finnhub: FinnhubClient) => {
  finnhubClient = finnhub;

  cron.schedule('* * * * *', () => {
    runChecks();
  });
};
