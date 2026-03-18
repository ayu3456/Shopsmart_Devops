/**
 * Formats a number as a currency string.
 * @param {number} amount
 * @returns {string}
 */
const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '$0.00';
    return `$${amount.toFixed(2)}`;
};

/**
 * Validates if the stock quantity is a non-negative integer.
 * @param {any} stock
 * @returns {boolean}
 */
const isValidStock = (stock) => {
    const n = parseInt(stock);
    return !isNaN(n) && n >= 0 && n.toString() === stock.toString();
};

module.exports = {
    formatCurrency,
    isValidStock,
};
