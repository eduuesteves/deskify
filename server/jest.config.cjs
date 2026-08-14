module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  transform: {
    '^.+\\.(t|s)sx?$': ['@swc/jest'],
  },
};