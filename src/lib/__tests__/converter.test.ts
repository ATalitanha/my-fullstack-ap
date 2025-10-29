import { describe, it, expect } from 'vitest';
import { convertValue } from '../converter';

describe('convertValue', () => {
  it('should convert temperature correctly', () => {
    expect(convertValue('temperature', 'c', 'f', 0)).toBe('32 F');
    expect(convertValue('temperature', 'f', 'c', 32)).toBe('0 C');
    expect(convertValue('temperature', 'c', 'k', 0)).toBe('273.15 K');
    expect(convertValue('temperature', 'k', 'c', 273.15)).toBe('0 C');
    expect(convertValue('temperature', 'f', 'k', 32)).toBe('273.15 K');
    expect(convertValue('temperature', 'k', 'f', 273.15)).toBe('32 F');
  });

  // Mock UNITS for non-temperature conversions
  vi.mock('@/lib/units', () => ({
    UNITS: [
      { category: 'length', value: 'm', label: 'm', factor: 1 },
      { category: 'length', value: 'cm', label: 'cm', factor: 0.01 },
      { category: 'mass', value: 'kg', label: 'kg', factor: 1 },
      { category: 'mass', value: 'g', label: 'g', factor: 0.001 },
    ],
  }));

  it('should convert length correctly', () => {
    expect(convertValue('length', 'm', 'cm', 1)).toBe('100 cm');
  });

  it('should convert mass correctly', () => {
    expect(convertValue('mass', 'kg', 'g', 1)).toBe('1000 g');
  });

  it('should return an error for invalid conversions', () => {
    expect(convertValue('length', 'm', 'kg', 1)).toBe('خطا در تبدیل');
  });
});
