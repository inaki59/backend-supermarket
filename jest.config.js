"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Archivo de setup
    moduleDirectories: ['node_modules', 'src'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'], // Asegura que busque *.test.ts o *.spec.ts
    verbose: true,
    collectCoverage: true,
    coverageDirectory: '<rootDir>/coverage',
};
exports.default = config;
