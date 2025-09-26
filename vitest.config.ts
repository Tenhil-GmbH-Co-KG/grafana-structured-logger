import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node', // or 'jsdom' if testing DOM code
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
