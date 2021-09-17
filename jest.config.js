module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/dist/',
    '/node_modules/',
  ],
  coverageDirectory: '<rootDir>/coverage/',
  setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less|scss)$": "identity-obj-proxy"
  },
};
