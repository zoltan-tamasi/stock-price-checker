import express, { Request } from "express";
import { hasSymbol, getMovingAverage, addSymbol } from "./service/stock";

const router = express.Router();

router
  .get("/:symbol", (req: Request<{ symbol: string }>, res) => {
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

  .put("/:symbol", (req: Request, res) => 
    addSymbol(req.params.symbol)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(error => {
        console.error(error instanceof Error ? error.message : JSON.stringify(error));
        res.status(500).send({
          error: "Unknown error happened"
        })
      }))

export default router;
