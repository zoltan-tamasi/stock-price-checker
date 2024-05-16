import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { addSymbol, startScheduler } from "./service/scheduler";
import { getFinnHubService } from "./service/finnhub";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const finnhubService = getFinnHubService(process.env.FINNHUB_APIKEY || "");

app.route("/stock/:symbol")

  .get((req: Request, res: Response) => {
    finnhubService.getQuote(req.params.symbol)
      .then(response => {
        res.send({
          currentPrice: response.currentPrice
        })
      })
  })

  .put((req: Request, res: Response) => {
    addSymbol(req.params.symbol);
    res.sendStatus(200);
  });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

startScheduler(finnhubService);
