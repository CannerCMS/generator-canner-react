module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "env": {
    browser: true,
    node: true,
    es6: true
  },
  "parserOptions": {
    "ecmaVersion": 6
  },
  "rules": {
    // 0 for closing rules
    "max-len": 0,
    "require-jsdoc": 0
  }
};
