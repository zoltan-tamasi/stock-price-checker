import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { startScheduler } from "./service/stock";
import { getFinnHubService } from "./service/finnhub";
import router from "./router";
import { CustomError } from "./service/errors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const finnhubService = getFinnHubService(process.env.FINNHUB_APIKEY || "");

app.use("/stock", router)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.use((error: Error, req: Request, res: Response, next: NextFunction): void => {
  res.status(error instanceof CustomError ? error.status : 500).send({
    error: error instanceof Error ? error.message : 'Unknown error happened' 
  });
  next();
})

startScheduler(finnhubService);
