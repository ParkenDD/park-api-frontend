import { expect, parkingSite, test } from './fixtures';
import { polygonTile } from './vectorTile';

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
    expect(tileRequests[0]).toMatch(/\/v3\/tiles\/\d+\/\d+\/\d+\.mvt\?/);
    // On-street parking stays out of the tiles at low zoom levels unless its details are asked for.
    expect(new URL(tileRequests[0]).searchParams.get('hide_on_street_until_zoom')).toBe('12');
  });

  test('filters the tiles by purpose', async ({ page, tileRequests }) => {
    await page.goto('/');
    await expect.poll(() => tileRequests.length).toBeGreaterThan(0);

    await page.getByRole('combobox', { name: 'Art des Parkplatzes' }).selectOption({ label: 'Fahrrad' });

    await expect(page.getByRole('combobox', { name: 'Art des Parkplatzes' })).toHaveValue('BIKE');
    await expect
      .poll(() => tileRequests.some((url) => new URL(url).searchParams.get('purpose') === 'BIKE'))
      .toBe(true);
  });

  test('shows the details of on-street parking on request', async ({ page, tileRequests }) => {
    await page.goto('/');
    await expect.poll(() => tileRequests.length).toBeGreaterThan(0);

    const toggle = page.getByRole('checkbox', { name: 'Detail-Ansicht' });
    await expect(toggle).not.toBeChecked();
    const requestsBefore = tileRequests.length;
    await toggle.check();

    await expect
      .poll(() => tileRequests.slice(requestsBefore).some((url) => !url.includes('hide_on_street_until_zoom')))
      .toBe(true);
  });

  test('asks to zoom in below the zoom level ParkAPI renders tiles for', async ({ page }) => {
    await page.goto('/#map=6/48.7/9.1');

    await expect(page.getByTestId('zoom-hint')).toBeVisible();
  });

  test('opens the parking site of a clicked area', async ({ page, context }) => {
    // Routes added later take precedence over the ones of the fixture.
    const tile = polygonTile('parking_site_geometries', { id: parkingSite.id, name: parkingSite.name, purpose: 'CAR' });
    await context.route('**/v3/tiles/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/x-protobuf', body: tile }),
    );
    await page.goto('/#map=14/48.7448/9.3212');

    const panel = page.getByTestId('parking-site-panel');
    // The click only hits the area once its tile is loaded.
    await expect(async () => {
      await page.getByTestId('map').click();
      await expect(panel).toBeVisible({ timeout: 500 });
    }).toPass();
    await expect(panel.getByRole('heading', { name: parkingSite.name })).toBeVisible();
    expect(new URL(page.url()).searchParams.get('site')).toBe(String(parkingSite.id));
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

  test('closes the details on a click next to all parking sites', async ({ page }) => {
    await page.goto(`/?site=${parkingSite.id}`);

    const panel = page.getByTestId('parking-site-panel');
    await expect(panel.getByRole('heading', { name: parkingSite.name })).toBeVisible();

    // Above the panel on mobile and right of it on desktop, away from the map controls.
    const viewport = page.viewportSize()!;
    const position = { x: viewport.width * 0.6, y: viewport.height * 0.3 };
    // The map only handles clicks once it is loaded.
    await expect(async () => {
      await page.getByTestId('map').click({ position });
      await expect(panel).toBeHidden({ timeout: 500 });
    }).toPass();
    expect(new URL(page.url()).search).toBe('');
  });

  test('links the imprint and the privacy policy', async ({ page }) => {
    await page.goto('/');

    const legal = page.getByRole('navigation', { name: 'Rechtliches' });
    await expect(legal.getByRole('link', { name: 'Impressum' })).toBeVisible();
    await legal.getByRole('link', { name: 'Datenschutz' }).click();

    await expect(page).toHaveURL(/\/privacy$/);
  });

  test('reports a parking site that cannot be loaded', async ({ page }) => {
    await page.goto('/?site=999');

    await expect(page.getByTestId('parking-site-panel')).toContainText('konnte nicht geladen werden');
  });

  test('suggests places while typing, those in Germany first', async ({ page, geocoderRequests }) => {
    await page.goto('/#map=10/48.78/9.18');

    const search = page.getByRole('combobox', { name: 'Adresse oder Ort suchen' });
    await search.fill('König');

    const options = page.getByRole('listbox', { name: 'Suchergebnisse' }).getByRole('option');
    await expect(options).toHaveCount(3);
    await expect(options.nth(0)).toContainText('Königstraße');
    await expect(options.nth(0)).toContainText('70173 Stuttgart');
    await expect(options.nth(1)).toContainText('Flandernstraße 101');
    await expect(options.nth(2)).toContainText('Königsdorf');
    await expect(options.nth(2)).toContainText('Wien, Österreich');

    const request = geocoderRequests.at(-1)!;
    expect(request.searchParams.get('q')).toBe('König');
    expect(request.searchParams.get('lang')).toBe('de');
    // Places near the map section come first.
    expect(Number(request.searchParams.get('lat'))).toBeCloseTo(48.78, 1);
  });

  test('moves the map to a picked place', async ({ page }) => {
    await page.goto('/#map=10/48.78/9.18');

    const search = page.getByRole('combobox', { name: 'Adresse oder Ort suchen' });
    await search.fill('Flandern');
    await expect(page.getByRole('listbox', { name: 'Suchergebnisse' }).getByRole('option')).toHaveCount(3);
    await search.press('ArrowDown');
    await search.press('ArrowDown');
    await search.press('Enter');

    await expect(page.getByRole('listbox', { name: 'Suchergebnisse' })).toBeHidden();
    await expect(search).toHaveValue('Flandernstraße 101, 73732 Esslingen');
    await expect(page.locator('.maplibregl-marker')).toBeVisible();
    await expect.poll(() => new URL(page.url()).hash).toMatch(/^#map=16(\.\d+)?\/48\.744\d*\/9\.321\d*/);

    await page.getByRole('button', { name: 'Suche leeren' }).click();
    await expect(search).toHaveValue('');
    await expect(page.locator('.maplibregl-marker')).toHaveCount(0);
  });
});
