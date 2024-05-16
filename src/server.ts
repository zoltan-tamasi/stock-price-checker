import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
const finnhub = require('finnhub');

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_APIKEY;
const finnhubClient = new finnhub.DefaultApi();

app.get("/:symbol", (req: Request, res: Response) => {
  finnhubClient.quote(req.params.symbol, (error: any, data: any, response: any) => {
    res.send(data);
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
