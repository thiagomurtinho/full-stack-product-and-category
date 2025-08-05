const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.spec.ts',
    '<rootDir>/src/**/__tests__/**/*.spec.tsx',
  ],
  collectCoverageFrom: [
    'src/data/categories/categories.api.ts',
    'src/data/categories/categories.contract.ts',
    'src/data/products/products.api.ts',
    'src/data/products/products.contract.ts',
    'src/data/shared/api.ts',
    'src/data/shared/error-handling.ts',
    'src/data/shared/validation.ts',
    'src/lib/utils.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/lib/hooks/**',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig) 