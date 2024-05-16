import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { addSymbol, getMovingAverage, hasSymbol, startScheduler } from "./service/stock";
import { getFinnHubService } from "./service/finnhub";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const finnhubService = getFinnHubService(process.env.FINNHUB_APIKEY || "");

app.route("/stock/:symbol")

  .get((req: Request, res: Response) => {
    if (!hasSymbol(req.params.symbol)) {
      res.status(404).send({
        error: `symbol: ${req.params.symbol} hasn't been registered yet`
      });
    } else {
      const avgValue = getMovingAverage(req.params.symbol);
      if (avgValue === undefined) {
        res.status(404).send({
          error: `average for symbol: ${req.params.symbol} hasn't been calculated yet`
        });
      } else {
        res.send({
          average: avgValue
        });
      }
    }
  })

  .put((req: Request, res: Response) => {
    addSymbol(req.params.symbol);
    res.sendStatus(200);
  });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

startScheduler(finnhubService);
