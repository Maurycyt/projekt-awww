module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier", "plugin:node/recommended"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "no-console": "off",
    "no-extend-native": "off",
    "max-classes-per-file": "off",
    "no-prototype-builtins": "off",
    "import/extensions": [1, "ignorePackages"],
    "max-len": ["error", { code: 200 }],
  }
};
