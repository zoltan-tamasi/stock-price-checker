import { getStockService } from "./stock";

const mockFinnhub = {
  getQuote: (symbol: string) => {
    return Promise.resolve({
      currentPrice: 2
    });
  }
};

const stockService = getStockService(mockFinnhub);

describe("Stock service test", () => {
  test("test average calculation", async () => {
    stockService.addNewPriceValue("a", 1);
    stockService.addNewPriceValue("a", 2);
    stockService.addNewPriceValue("a", 3);
    expect(stockService.calculateMovingAverage("a")).toEqual(2);

    stockService.addNewPriceValue("a", 4);
    stockService.addNewPriceValue("a", 5);
    stockService.addNewPriceValue("a", 6);
    stockService.addNewPriceValue("a", 7);
    stockService.addNewPriceValue("a", 8);
    stockService.addNewPriceValue("a", 9);
    stockService.addNewPriceValue("a", 10);
    expect(stockService.calculateMovingAverage("a")).toEqual(5.5);

    stockService.addNewPriceValue("a", 11);
    expect(stockService.calculateMovingAverage("a")).toEqual(6.5);
  });
});

afterAll(() => {
  stockService.stopService();
});
