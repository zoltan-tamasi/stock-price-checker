/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testMatch: [ "**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)" ],
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/"],
  setupFiles: ["dotenv/config"],
  coverageReporters: [
    "json",
  ],
  collectCoverageFrom: ["src/**/*.ts"],
};
