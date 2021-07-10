module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['js'],
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/config/',
    '<rootDir>/__tests__/fixtures',
    '<rootDir>/src/models'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/config/',
    '<rootDir>/__tests__/fixtures/',
    '<rootDir>/src/models'
  ]
};

