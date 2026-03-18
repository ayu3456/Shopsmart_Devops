import { test, expect } from '@playwright/test';

test.describe('ShopSmart E2E Tests', () => {
    test('should add and then delete a product', async ({ page }) => {
        await page.goto('/');

        // Ensure page is loaded
        await expect(page.locator('h1')).toContainText('ShopSmart');

        const productName = `E2E Test Laptop ${Date.now()}`;

        // Fill out form
        await page.fill('#name', productName);
        await page.fill('#description', 'High-end E2E test machine');
        await page.fill('#price', '1500');
        await page.fill('#stock', '5');

        // Submit
        await page.click('button:has-text("Add Product")');

        // Check for product in inventory
        await expect(page.locator('.product-card')).toContainText(productName);

        // Find delete button for this specific product and click it
        const productCard = page.locator('.product-card', { hasText: productName });
        await productCard.locator('.btn-danger').click();

        // Verify it was deleted
        await expect(page.locator('.product-card', { hasText: productName })).not.toBeVisible();
    });
});
