/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
    "tests/(.*)": "<rootDir>/tests/$1",
    "\\.(css|less)$": "<rootDir>/tests/__mocks__/styleMock.js"

  },
  testMatch: [
    "**/?(*.test).ts?(x)"
  ],
  setupFiles: [
    "<rootDir>/tests/config.ts"
  ],
  transform: {
  },
};