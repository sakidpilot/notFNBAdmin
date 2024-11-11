export default {
    testEnvironment: 'node', // Set the environment for Node.js
    testMatch: ['test/app.test.js'], // test files location
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
};

