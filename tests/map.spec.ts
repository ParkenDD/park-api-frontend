import { expect, parkingSite, test } from './fixtures';

test.describe('map', () => {
  test('renders a fullscreen map with parking site tiles', async ({ page, tileRequests }) => {
    await page.goto('/');

    const map = page.getByTestId('map');
    await expect(map.locator('canvas.maplibregl-canvas')).toBeVisible();

    const viewport = page.viewportSize()!;
    const box = (await map.boundingBox())!;
    expect(box.width).toBe(viewport.width);
    expect(box.height).toBe(viewport.height);

    await expect.poll(() => tileRequests.length).toBeGreaterThan(0);
    expect(tileRequests[0]).toMatch(/\/v3\/tiles\/\d+\/\d+\/\d+\.mvt$/);
  });

  test('filters the tiles by purpose', async ({ page, tileRequests }) => {
    await page.goto('/');
    await expect.poll(() => tileRequests.length).toBeGreaterThan(0);

    await page.getByRole('button', { name: 'Fahrrad' }).click();

    await expect(page.getByRole('button', { name: 'Fahrrad' })).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(() => tileRequests.some((url) => url.endsWith('?purpose=BIKE'))).toBe(true);
  });

  test('asks to zoom in below the zoom level ParkAPI renders tiles for', async ({ page }) => {
    await page.goto('/#map=6/48.7/9.1');

    await expect(page.getByTestId('zoom-hint')).toBeVisible();
  });

  test('shows the details of the parking site in the URL', async ({ page }) => {
    await page.goto(`/?site=${parkingSite.id}`);

    const panel = page.getByTestId('parking-site-panel');
    await expect(panel.getByRole('heading', { name: parkingSite.name })).toBeVisible();
    await expect(panel.getByTestId('occupancy')).toContainText('212');
    await expect(panel.getByTestId('occupancy')).toContainText('von 459 Plätzen frei');
    await expect(panel).toContainText('Parkhaus');
    await expect(panel).toContainText('rund um die Uhr');
    await expect(panel.getByTestId('source-note')).toContainText('Landeshauptstadt Stuttgart, Lizenz: dl-de/by-2-0');

    await panel.getByRole('button', { name: 'Schließen' }).click();

    await expect(panel).toBeHidden();
    expect(new URL(page.url()).search).toBe('');
  });

  test('reports a parking site that cannot be loaded', async ({ page }) => {
    await page.goto('/?site=999');

    await expect(page.getByTestId('parking-site-panel')).toContainText('konnte nicht geladen werden');
  });
});
