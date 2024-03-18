/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
    "tests/(.*)": "<rootDir>/tests/$1"
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