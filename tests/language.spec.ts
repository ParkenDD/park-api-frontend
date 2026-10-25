import { expect, parkingSite, test } from './fixtures';

test.describe('language', () => {
  test.describe('with a browser asking for English', () => {
    test.use({ locale: 'en-GB' });

    test('shows English', async ({ page }) => {
      await page.goto('/about');

      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Publish parking data openly');
      await expect(page).toHaveTitle('About – ParkAPI');
      await expect(page.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
    });

    test('shows English on the map and in the details', async ({ page }) => {
      await page.goto(`/?site=${parkingSite.id}`);

      await expect(page.getByRole('combobox', { name: 'Kind of parking' })).toBeVisible();
      const panel = page.getByTestId('parking-site-panel');
      await expect(panel.getByTestId('occupancy')).toContainText('of 459 spaces available');
      await expect(panel).toContainText('Multi-storey car park');
      await expect(panel).toContainText('around the clock');
    });

    test('lists the sources in English', async ({ page }) => {
      await page.goto('/open-data');

      await expect(page.getByRole('heading', { name: 'Data sources and licences' })).toBeVisible();
      await expect(page.getByTestId('source-table')).toContainText('not specified');
    });

    test('marks the legal pages as translations', async ({ page }) => {
      for (const [path, heading] of [
        ['/imprint', 'Imprint'],
        ['/privacy', 'Privacy policy'],
      ]) {
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
        await expect(page.getByText('Only the German version is legally binding.')).toBeVisible();
      }
    });
  });

  test('switches the language and remembers the choice', async ({ page }) => {
    await page.goto('/open-data');
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(page.getByRole('heading', { name: 'Datenquellen und Lizenzen' })).toBeVisible();

    await page.getByRole('button', { name: 'English' }).click();

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: 'Data sources and licences' })).toBeVisible();
    await expect(page).toHaveTitle('Open Data – ParkAPI');
    await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'About' })).toBeVisible();

    // The switch is a choice of the visitor, so it outlasts the visit even though the browser still asks for German.
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Data sources and licences' })).toBeVisible();

    await page.getByRole('button', { name: 'Deutsch' }).click();
    await expect(page.getByRole('heading', { name: 'Datenquellen und Lizenzen' })).toBeVisible();
  });

  test('switches the language on the map without losing the map', async ({ page }) => {
    await page.goto('/#map=13/48.7758/9.1829');
    await expect(page.getByRole('combobox', { name: 'Art des Parkplatzes' })).toBeVisible();

    await page.getByRole('button', { name: 'English' }).click();

    await expect(page.getByRole('combobox', { name: 'Kind of parking' })).toBeVisible();
    await expect(page.getByTestId('map').locator('.maplibregl-ctrl-attrib')).toContainText('Parking data');
    expect(new URL(page.url()).hash).toBe('#map=13/48.7758/9.1829');
  });
});
