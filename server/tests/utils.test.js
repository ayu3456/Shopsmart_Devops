const { formatCurrency, isValidStock } = require('../src/utils');

describe('Utility Functions Unit Tests', () => {
    describe('formatCurrency', () => {
        it('should format numbers correctly', () => {
            expect(formatCurrency(10)).toBe('$10.00');
            expect(formatCurrency(9.99)).toBe('$9.99');
            expect(formatCurrency(19.999)).toBe('$20.00');
        });

        it('should return $0.00 for non-numeric input', () => {
            expect(formatCurrency('10')).toBe('$0.00');
            expect(formatCurrency(null)).toBe('$0.00');
            expect(formatCurrency(undefined)).toBe('$0.00');
        });
    });

    describe('isValidStock', () => {
        it('should return true for valid stock numbers', () => {
            expect(isValidStock(0)).toBe(true);
            expect(isValidStock(10)).toBe(true);
            expect(isValidStock('10')).toBe(true);
        });

        it('should return false for invalid stock numbers', () => {
            expect(isValidStock(-1)).toBe(false);
            expect(isValidStock('abc')).toBe(false);
            expect(isValidStock(10.5)).toBe(false);
            expect(isValidStock('10.5')).toBe(false);
        });
    });
});
