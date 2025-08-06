// Setup file for Jest tests

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Mock process.env for tests
process.env.NODE_ENV = 'test'
process.env.PORT = '5000'

// Global test timeout
jest.setTimeout(10000) 