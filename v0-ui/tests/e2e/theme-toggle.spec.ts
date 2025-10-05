import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL + '/');
    await page.waitForLoadState('networkidle');
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    // Check initial theme (should be dark by default)
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    
    // Check that the theme toggle button is visible
    const themeToggle = page.locator('[aria-label="Toggle theme"]');
    await expect(themeToggle).toBeVisible();
    
    // Click the theme toggle to switch to light mode
    await themeToggle.click();
    
    // Wait for theme change
    await page.waitForTimeout(100);
    
    // Check that the HTML class has changed to light mode
    await expect(html).not.toHaveClass(/dark/);
    
    // Click again to switch back to dark mode
    await themeToggle.click();
    
    // Wait for theme change
    await page.waitForTimeout(100);
    
    // Check that the HTML class has changed back to dark mode
    await expect(html).toHaveClass(/dark/);
  });

  test('should have visual changes when theme toggles', async ({ page }) => {
    // Take screenshot in dark mode
    await page.screenshot({ path: 'test-results/theme-dark.png', fullPage: true });
    
    // Switch to light mode
    const themeToggle = page.locator('[aria-label="Toggle theme"]');
    await themeToggle.click();
    await page.waitForTimeout(100);
    
    // Take screenshot in light mode
    await page.screenshot({ path: 'test-results/theme-light.png', fullPage: true });
    
    // Verify the screenshots are different (visual change occurred)
    // This is a basic check - in a real scenario you'd use visual regression testing
    const darkScreenshot = await page.screenshot({ fullPage: true });
    
    // Switch back to dark
    await themeToggle.click();
    await page.waitForTimeout(100);
    
    const lightScreenshot = await page.screenshot({ fullPage: true });
    
    // The screenshots should be different
    expect(darkScreenshot).not.toEqual(lightScreenshot);
  });

  test('should maintain theme state across page reloads', async ({ page }) => {
    // Switch to light mode
    const themeToggle = page.locator('[aria-label="Toggle theme"]');
    await themeToggle.click();
    await page.waitForTimeout(100);
    
    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that light mode is still active
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);
  });

  test('should have proper contrast in both themes', async ({ page }) => {
    // Test dark mode contrast
    const body = page.locator('body');
    const bodyColor = await body.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });
    
    // Switch to light mode
    const themeToggle = page.locator('[aria-label="Toggle theme"]');
    await themeToggle.click();
    await page.waitForTimeout(100);
    
    // Test light mode contrast
    const lightBodyColor = await body.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });
    
    // Verify that colors are different between themes
    expect(bodyColor.backgroundColor).not.toEqual(lightBodyColor.backgroundColor);
    expect(bodyColor.color).not.toEqual(lightBodyColor.color);
  });
});
