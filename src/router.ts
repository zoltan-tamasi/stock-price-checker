import express, { NextFunction, Request } from "express";
import { getStockService } from "./service/stock";
import { AverageNotCalculatedError, SymbolNotRegisteredError } from "./service/errors";
import { getFinnHubService } from "./service/finnhub";

const finnhubService = getFinnHubService(process.env.FINNHUB_APIKEY || "");
const stockService = getStockService(finnhubService);

const router = express.Router();

type GetRequestParams = { 
  symbol: string 
};

router
  .get("/:symbol", (req: Request<GetRequestParams>, res) => {
    if (!stockService.hasSymbol(req.params.symbol)) {
      throw new SymbolNotRegisteredError(req.params.symbol)
    } 
    const avgValue = stockService.getMovingAverage(req.params.symbol);
    if (avgValue === undefined) {
      throw new AverageNotCalculatedError(req.params.symbol);
    } 
    res.send({
      average: avgValue
    });
  })

  .put("/:symbol", (req: Request, res, next: NextFunction) => 
    stockService.addSymbol(req.params.symbol)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(next));

export default router;
