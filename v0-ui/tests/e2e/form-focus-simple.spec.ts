import { test, expect } from '@playwright/test';

test.describe('Form Field Focus States - Simple', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL + '/');
    await page.waitForLoadState('networkidle');
  });

  test('should have animated labels and borders on focus for select inputs', async ({ page }) => {
    // Test Environment select
    const envSelect = page.locator('select').first();
    const envLabel = page.locator('label').first();
    
    // Since the select has a default value, the label should already be in "focused" state
    await expect(envLabel).toHaveClass(/text-primary/);
    
    // Focus the select to ensure it's active
    await envSelect.focus();
    
    // Wait for animation
    await page.waitForTimeout(300);
    
    // Check that label is still in focused state
    await expect(envLabel).toHaveClass(/text-primary/);
    
    // Check that border color has changed
    const borderColor = await envSelect.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.borderColor;
    });
    
    // The border should have changed from default to focus color
    expect(borderColor).not.toBe('rgb(214, 211, 209)'); // Default border color
  });

  test('should have proper ARIA attributes and accessibility', async ({ page }) => {
    const envSelect = page.locator('select').first();
    const envLabel = page.locator('label').first();
    
    // Check that label is properly associated
    const labelFor = await envLabel.getAttribute('for');
    const selectId = await envSelect.getAttribute('id');
    
    if (labelFor && selectId) {
      expect(labelFor).toBe(selectId);
    }
    
    // Check that select has proper ARIA attributes
    const ariaLabel = await envSelect.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    
    // Check that select is focusable
    await envSelect.focus();
    await expect(envSelect).toBeFocused();
  });

  test('should maintain focus states during theme changes', async ({ page }) => {
    const envSelect = page.locator('select').first();
    const envLabel = page.locator('label').first();
    
    // Focus the select
    await envSelect.focus();
    await page.waitForTimeout(300);
    
    // Verify focus state
    await expect(envLabel).toHaveClass(/text-primary/);
    
    // Toggle theme
    const themeToggle = page.locator('[aria-label="Toggle theme"]');
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Focus state should be maintained
    await expect(envLabel).toHaveClass(/text-primary/);
    
    // Toggle back
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Focus state should still be maintained
    await expect(envLabel).toHaveClass(/text-primary/);
  });
});
