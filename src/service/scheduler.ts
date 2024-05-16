import cron from "node-cron";

const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_APIKEY;
const finnhubClient = new finnhub.DefaultApi();

const prices = new Map<string, number>();

const runChecks = () => {
  console.log("[scheduler] Running scheduled checks for prices");
  Array.from(prices.keys()).forEach(symbol => {
    finnhubClient.quote(symbol, (error: any, data: any, response: any) => {
      console.log(`[scheduler] Scheduled check for symbol: ${symbol}, current price: ${data.c}`);
      prices.set(symbol, data.c);
    });
  })
};

export const addSymbol = (symbol: string) => {
  prices.set(symbol, 0);
};

export const startScheduler = () => {
  cron.schedule('* * * * *', () => {
    runChecks();
  });
};
