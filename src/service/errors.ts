export class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }  
}

export class SymbolDoesntExistError extends CustomError {
  constructor(symbol: string) {
    super(`Symbol: ${symbol} doesn't exist`, 404);
    this.name = "SymbolDoesntExistError";
  }
}

export class FinnhubNotInitializedError extends CustomError {
  constructor() {
    super("Finnhub client hasn't been initialized", 500);
    this.name = "FinnhubNotInitialized";
  }
}

export class SymbolNotRegisteredError extends CustomError {
  constructor(symbol: string) {
    super(`symbol: ${symbol} hasn't been registered yet`, 400);
    this.name = "SymbolNotRegistered";
  }
}

export class AverageNotCalculatedError extends CustomError {
  constructor(symbol: string) {
    super(`average for symbol: ${symbol} hasn't been calculated yet`, 404);
    this.name = "AverageNotCalculatedError";
  }
}
