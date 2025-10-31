import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import { info, debug, warn, error, critical, init } from './index.js';

// Common mocks for console
const mockConsoleDebug = vi.spyOn(console, 'debug').mockImplementation(() => {});
const mockConsoleInfo = vi.spyOn(console, 'info').mockImplementation(() => {});
const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock Date for deterministic timestamps
const mockDate = new Date('2024-01-15T10:30:00.000Z');
vi.spyOn(globalThis, 'Date').mockImplementation(() => mockDate);

describe('Logging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset init state between tests
    init({ defaultLabels: {} });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Server-side (no window)', () => {
    beforeEach(() => {
      // Ensure we are simulating Node.js
      // @ts-expect-error - setting test environment
      delete globalThis.window;
    });

    it('info emits JSON via console.info', () => {
      info('Info message');

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        JSON.stringify({
          time: '2024-01-15T10:30:00.000Z',
          level: 'info',
          message: 'Info message',
        })
      );
    });

    it('debug emits JSON via console.debug', () => {
      debug('Debug message');

      expect(mockConsoleDebug).toHaveBeenCalledWith(
        JSON.stringify({
          time: '2024-01-15T10:30:00.000Z',
          level: 'debug',
          message: 'Debug message',
        })
      );
    });

    it('warn emits JSON via console.warn', () => {
      warn('Warning message');

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        JSON.stringify({
          time: '2024-01-15T10:30:00.000Z',
          level: 'warning',
          message: 'Warning message',
        })
      );
    });

    it('error with string emits JSON via console.error', () => {
      error('Error message');

      expect(mockConsoleError).toHaveBeenCalledWith(
        JSON.stringify({
          time: '2024-01-15T10:30:00.000Z',
          level: 'error',
          message: 'Error message',
        })
      );
    });

    it('error with Error emits JSON with stack', () => {
      const err = new Error('Boom');
      error(err);

      expect(mockConsoleError).toHaveBeenCalledWith(
        JSON.stringify({
          time: '2024-01-15T10:30:00.000Z',
          level: 'error',
          message: 'Boom',
          stack: err.stack,
        })
      );
    });

    it('critical with Error emits JSON with stack', () => {
      const err = new Error('Critical failure');
      critical(err);

      expect(mockConsoleError).toHaveBeenCalledWith(
        JSON.stringify({
          time: '2024-01-15T10:30:00.000Z',
          level: 'critical',
          message: 'Critical failure',
          stack: err.stack,
        })
      );
    });

    it('includes labels when provided', () => {
      info('With labels', { userId: 'u1', service: 'api' });

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        JSON.stringify({
          time: '2024-01-15T10:30:00.000Z',
          level: 'info',
          message: 'With labels',
          labels: {
            userId: 'u1',
            service: 'api',
          },
        })
      );
    });

    it('merges defaultLabels from init with provided labels', () => {
      init({ defaultLabels: { version: '1.0.0', environment: 'production' } });

      info('With labels', { userId: 'u1' });

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        JSON.stringify({
          time: '2024-01-15T10:30:00.000Z',
          level: 'info',
          message: 'With labels',
          labels: {
            version: '1.0.0',
            environment: 'production',
            userId: 'u1',
          },
        })
      );
    });

    it('provided labels override defaultLabels from init', () => {
      init({ defaultLabels: { version: '1.0.0', userId: 'default-user' } });

      info('Override test', { userId: 'specific-user' });

      expect(mockConsoleInfo).toHaveBeenCalledWith(
        JSON.stringify({
          time: '2024-01-15T10:30:00.000Z',
          level: 'info',
          message: 'Override test',
          labels: {
            version: '1.0.0',
            userId: 'specific-user',
          },
        })
      );
    });
  });

  describe('Client-side (window defined)', () => {
    beforeEach(() => {
      // Simulate browser environment
      // @ts-expect-error - setting test environment
      globalThis.window = {};
    });

    it('info emits plain string', () => {
      info('Info message');

      expect(mockConsoleInfo).toHaveBeenCalledWith('Info message');
    });

    it('debug emits plain string', () => {
      debug('Debug message');

      expect(mockConsoleDebug).toHaveBeenCalledWith('Debug message');
    });

    it('warn emits plain string', () => {
      warn('Warning message');

      expect(mockConsoleWarn).toHaveBeenCalledWith('Warning message');
    });

    it('error with string emits plain string', () => {
      error('Error message');

      expect(mockConsoleError).toHaveBeenCalledWith('Error message');
    });

    it('error with Error emits only the message', () => {
      const err = new Error('Boom');
      error(err);

      expect(mockConsoleError).toHaveBeenCalledWith('Boom');
    });

    it('critical with Error emits only the message', () => {
      const err = new Error('Critical failure');
      critical(err);

      expect(mockConsoleError).toHaveBeenCalledWith('Critical failure');
    });
  });
});