module.exports = {
  testEnvironment: 'node',
  transform: { '^.+\\.jsx?$': 'babel-jest' },
  testPathIgnorePatterns: [
    '<rootDir>/src/components/__tests__/',
    '<rootDir>/e2e/',
  ],
};
