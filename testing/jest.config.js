/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/unit', '<rootDir>/integration'],
  testMatch: ['**/*.spec.ts', '**/*.spec.js'],
  testTimeout: 30_000,
  moduleFileExtensions: ['ts', 'js', 'mjs', 'json'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
};
