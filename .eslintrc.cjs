module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "standard-with-typescript",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react", "jest", "path"],
  settings: {
    react: {
      version: "18.2",
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "path/no-relative-imports": "error",
  },
};
