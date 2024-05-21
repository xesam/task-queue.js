/*
 * Eslint config file
 * Documentation: https://eslint.org/docs/user-guide/configuring/
 * Install the Eslint extension before using this feature.
 */
module.exports = {
    env: {
        es6: true,
        browser: false,
        node: true
    },
    ecmaFeatures: {
        modules: true
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    // extends: 'eslint:recommended',
    rules: {}
};
