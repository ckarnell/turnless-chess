module.exports = {
  "extends": ["eslint:recommended", "eslint-config-airbnb"],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
    }
  },
  "rules": {
    //  Override rules from base configurations
    //  Severity should be one of the following: 0 = off, 1 = warn, 2 = error
    "no-underscore-dangle": 0,
    "react/no-string-refs": 1,
    "react/forbid-prop-types": 1,
    "react/no-unused-prop-types": [1, {
      "skipShapeProps": true
    }],
    "arrow-body-style": 0,
    "jsx-a11y/no-static-element-interactions": 1,
    "import/prefer-default-export": 1,
    "import/no-unresolved": 0,
    "import/extensions": 0,
    "import/no-extraneous-dependencies": 0,
    "global-require": 1,
    "class-methods-use-this": 1,
  },
  "env": {
    "browser": true,
    "commonjs": true,
    "jest": true,
    "jasmine": true,
  },
  "globals": {
    "Raven": true
  }
}
