import { SymbolDoesntExistError } from "./errors";

const finnhub = require('finnhub');

export type QuoteResponse = {
  currentPrice: number;
}

export type FinnhubClient = {
  getQuote: (symbol: string) => Promise<QuoteResponse>;
};

export const getFinnHubService = (finnhubApiKey: string): FinnhubClient => {
  const api_key = finnhub.ApiClient.instance.authentications['api_key'];
  api_key.apiKey = finnhubApiKey;

  const finnhubClient = new finnhub.DefaultApi();

  return {
    getQuote: (symbol: string) => {
      return new Promise((resolve, reject) => {
        finnhubClient.quote(symbol, (error: any, data: any, response: any) => {
          if (data.c === 0 || data.d === null) {
            reject(new SymbolDoesntExistError(symbol));
          } else {
            resolve({
              currentPrice: data.c
            });
          }
        });
      });
    }
  }
}
