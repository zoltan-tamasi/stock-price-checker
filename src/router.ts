import express, { NextFunction, Request } from "express";
import { hasSymbol, getMovingAverage, addSymbol } from "./service/stock";
import { AverageNotCalculatedError, FinnhubNotInitializedError, SymbolNotRegisteredError } from "./service/errors";

const router = express.Router();

router
  .get("/:symbol", (req: Request<{ symbol: string }>, res) => {
    if (!hasSymbol(req.params.symbol)) {
      throw new SymbolNotRegisteredError(req.params.symbol)
    } else {
      const avgValue = getMovingAverage(req.params.symbol);
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
    addSymbol(req.params.symbol)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(next));

export default router;
