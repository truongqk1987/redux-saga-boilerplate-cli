module.exports ={
  "root": true,
  "env": {
    "node": true,
    "commonjs": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "plugins": [],
  "rules": {
    "indent": [
      "error",
      "tab"
    ],
    "quotes": [
      "error",
      "single",
      {
        "avoidEscape": true
      }
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-unused-vars": 0,
    "no-console": 0,
    "array-callback-return": 2,
    "eqeqeq": 2,
    "no-use-before-define": [
      2,
      {
        "functions": false
      }
    ],
    "comma-style": [
      "error",
      "last"
    ],
    "comma-spacing": 2,
    "function-paren-newline": [
      "error",
      "never"
    ],
    "one-var": [
      2,
      "never"
    ],
    "semi-style": [
      2,
      "last"
    ],
    "no-const-assign": "error",
    "array-bracket-spacing": [
      "error",
      "never"
    ],
    "object-curly-spacing": [
      "error",
      "never"
    ]
  }
}