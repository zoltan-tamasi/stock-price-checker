import express, { Express } from "express";
import dotenv from "dotenv";
import { startScheduler } from "./service/stock";
import { getFinnHubService } from "./service/finnhub";
import router from "./router";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const finnhubService = getFinnHubService(process.env.FINNHUB_APIKEY || "");

app.use("/stock", router)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

startScheduler(finnhubService);
