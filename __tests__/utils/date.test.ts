import { formatDate, formatShortDate, formatRelativeDate, toISOString } from '../../src/utils/date';

describe('formatDate', () => {
  it('formats a date in Ukrainian locale', () => {
    const result = formatDate('2024-06-15T00:00:00.000Z', 'uk');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('formats a date in English locale', () => {
    const result = formatDate('2024-06-15T00:00:00.000Z', 'en');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});

describe('formatShortDate', () => {
  it('returns a short date string', () => {
    const result = formatShortDate('2024-06-15T00:00:00.000Z', 'en');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});

describe('formatRelativeDate', () => {
  it('returns "Today" for today\'s date (en)', () => {
    const today = new Date().toISOString();
    const result = formatRelativeDate(today, 'en');
    expect(result).toBe('Today');
  });

  it('returns "Сьогодні" for today\'s date (uk)', () => {
    const today = new Date().toISOString();
    const result = formatRelativeDate(today, 'uk');
    expect(result).toBe('Сьогодні');
  });

  it('returns "Yesterday" for yesterday\'s date (en)', () => {
    const yesterday = new Date(Date.now() - 86400 * 1000).toISOString();
    const result = formatRelativeDate(yesterday, 'en');
    expect(result).toBe('Yesterday');
  });

  it('returns days ago for recent past dates (en)', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 86400 * 1000).toISOString();
    const result = formatRelativeDate(threeDaysAgo, 'en');
    expect(result).toBe('3 days ago');
  });

  it('falls back to short date for dates older than 7 days', () => {
    const oldDate = new Date('2020-01-01').toISOString();
    const result = formatRelativeDate(oldDate, 'en');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});

describe('toISOString', () => {
  it('returns an ISO string for a given date', () => {
    const date = new Date('2024-01-15T00:00:00.000Z');
    const result = toISOString(date);
    expect(result).toBe('2024-01-15T00:00:00.000Z');
  });

  it('returns an ISO string for current date when no arg given', () => {
    const result = toISOString();
    expect(typeof result).toBe('string');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
