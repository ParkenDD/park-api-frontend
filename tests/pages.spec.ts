import { expect, sources, test } from './fixtures';

test.describe('pages', () => {
  test('navigates between all pages', async ({ page, isMobile }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });

    await nav.getByRole('link', { name: 'Projekt' }).click();
    await expect(page).toHaveURL('/about');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Parkdaten offen bereitstellen');
    await expect(page).toHaveTitle('Projekt – ParkAPI');

    await nav.getByRole('link', { name: 'Open Data' }).click();
    await expect(page).toHaveURL('/open-data');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Open Data');

    await page.getByRole('contentinfo').getByRole('link', { name: 'Impressum' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Impressum');

    await page.getByRole('contentinfo').getByRole('link', { name: 'Datenschutz' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Datenschutzerklärung');

    await nav.getByRole('link', { name: 'Karte' }).click();
    await expect(page).toHaveURL(/\/(#.*)?$/);
    await expect(page.getByTestId('map')).toBeVisible();

    // No page may scroll sideways, least of all on a phone.
    if (isMobile) {
      for (const path of ['/about', '/open-data', '/imprint', '/privacy']) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, path).toBeLessThanOrEqual(0);
      }
    }
  });

  test('serves every page on a direct visit', async ({ page }) => {
    for (const [path, heading] of [
      ['/about', 'Parkdaten offen bereitstellen'],
      ['/open-data', 'Open Data'],
      ['/imprint', 'Impressum'],
      ['/privacy', 'Datenschutzerklärung'],
      ['/gibt-es-nicht', 'Seite nicht gefunden'],
    ]) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 }), path).toContainText(heading);
    }
  });

  test('lists the sources and their licences', async ({ page }) => {
    await page.goto('/open-data');

    const table = page.getByTestId('source-table');
    await expect(table.locator('tbody tr')).toHaveCount(sources.length);
    // Sorted by name, so the BFRK source comes first.
    await expect(table.locator('tbody tr').first()).toContainText('keine Angabe');
    await expect(table.getByRole('row', { name: /Stuttgart Parkhäuser/ })).toContainText('dl-de/by-2-0');
    await expect(table.getByRole('row', { name: /Stuttgart Parkhäuser/ })).toContainText('Landeshauptstadt Stuttgart');
  });

  test('links the OpenAPI documentation', async ({ page }) => {
    await page.goto('/open-data');

    await expect(page.getByRole('link', { name: 'OpenAPI-Dokumentation' })).toHaveAttribute(
      'href',
      'https://api.mobidata-bw.de/park-api/documentation/public.html',
    );
  });

  test('names the operator in the imprint', async ({ page }) => {
    await page.goto('/imprint');

    await expect(page.getByTestId('imprint-operator')).toContainText('binary butterfly GmbH');
    await expect(page.getByText('Angaben gemäß § 5 DDG')).toBeVisible();
  });
});
