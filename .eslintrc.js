module.exports = {
    env: {
        es6: true,
        'react-native/react-native': true,
    },
    extends: ['standard', 'plugin:react-native/all'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['react', 'react-native'],
    rules: {
        'react-native/no-unused-styles': 0,
        'react-native/split-platform-components': 0,
        'react-native/no-inline-styles': 0,
        'react-native/no-color-literals': 0,
        'react-native/no-raw-text': 0,
        'react-native/no-single-element-style-arrays': 0,
        indent: ['error', 4],
        semi: ['error', 'always'],
        'no-unused-vars': 0,
        'camelcase': 0,
        'no-useless-call': 0,
        'comma-dangle': 0,
        'no-undef': 0,
        'no-return-assign': 0,
    },
};
