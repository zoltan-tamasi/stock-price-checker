import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { addSymbol, startScheduler } from "./service/scheduler";
const finnhub = require('finnhub');

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_APIKEY;
const finnhubClient = new finnhub.DefaultApi();

app.route("/stock/:symbol")

  .get((req: Request, res: Response) => {
    finnhubClient.quote(req.params.symbol, (error: any, data: any, response: any) => {
      res.send(data);
    });
  })

  .put((req: Request, res: Response) => {
    addSymbol(req.params.symbol);
    res.sendStatus(200);
  });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

startScheduler();
