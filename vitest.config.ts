/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        exclude: ['.git*', 'docs', 'examples', 'node_modules', 'coverage', 'dist', '**/index.ts'],
        alias: {
            '@/*': ['./src/$1']
        },
        environment: 'jsdom',
        coverage: {
            thresholds: {
                100: true
            }
        }
    }
});
