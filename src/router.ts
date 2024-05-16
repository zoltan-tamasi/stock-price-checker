import express, { NextFunction, Request } from "express";
import { getStockService } from "./service/stock";
import { AverageNotCalculatedError, SymbolNotRegisteredError } from "./service/errors";
import { getFinnHubService } from "./service/finnhub";

const finnhubService = getFinnHubService(process.env.FINNHUB_APIKEY || "");
const stockService = getStockService(finnhubService);

const router = express.Router();

router
  .get("/:symbol", (req: Request<{ symbol: string }>, res) => {
    if (!stockService.hasSymbol(req.params.symbol)) {
      throw new SymbolNotRegisteredError(req.params.symbol)
    } else {
      const avgValue = stockService.getMovingAverage(req.params.symbol);
      if (avgValue === undefined) {
        throw new AverageNotCalculatedError(req.params.symbol);
      } else {
        res.send({
          average: avgValue
        });
      }
    }
  })

  .put("/:symbol", (req: Request, res, next: NextFunction) => 
    stockService.addSymbol(req.params.symbol)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(next));

export default router;
