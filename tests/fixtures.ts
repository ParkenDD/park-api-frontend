import { test as base, expect } from '@playwright/test';

// The defaults of src/lib/config.ts, which the build under test uses as no VITE_* variables are set.
const PARK_API_URL = 'https://api.mobidata-bw.de/park-api/api/public';
const MAP_STYLE_URL = 'https://tiles.binary-butterfly.de/osm-bright-gl-style/style.json';
const GEOCODER_URL = 'https://geocode.park-api.de';

const photonFeature = (properties: Record<string, unknown>, coordinates: [number, number]) => ({
  type: 'Feature',
  properties,
  geometry: { type: 'Point', coordinates },
});

// What the geocoder finds for any query, in Germany and elsewhere.
export const places = {
  germany: [
    photonFeature(
      {
        osm_type: 'W',
        osm_id: 1,
        name: 'Königstraße',
        postcode: '70173',
        city: 'Stuttgart',
        state: 'Baden-Württemberg',
        countrycode: 'DE',
        extent: [9.1735, 48.7743, 9.1742, 48.774],
      },
      [9.1738, 48.7742],
    ),
    photonFeature(
      { osm_type: 'N', osm_id: 2, street: 'Flandernstraße', housenumber: '101', postcode: '73732', city: 'Esslingen', countrycode: 'DE' },
      [9.3212, 48.7448],
    ),
  ],
  elsewhere: [
    photonFeature({ osm_type: 'R', osm_id: 3, name: 'Königsdorf', city: 'Wien', country: 'Österreich', countrycode: 'AT' }, [16.37, 48.21]),
  ],
};

export const sources = [
  {
    id: 1,
    uid: 'stuttgart_carparks',
    name: 'Stuttgart Parkhäuser',
    public_url: 'https://example.org/stuttgart',
    attribution_license: 'dl-de/by-2-0',
    attribution_contributor: 'Landeshauptstadt Stuttgart',
    static_status: 'ACTIVE',
    realtime_status: 'ACTIVE',
  },
  {
    id: 2,
    uid: 'bfrk_bw_bike',
    name: 'Barrierefreie Reisekette Baden-Württemberg: Fahrrad-Parkplätze',
    public_url: 'https://example.org/bfrk',
    attribution_license: null,
    attribution_contributor: null,
    static_status: 'ACTIVE',
    realtime_status: 'DISABLED',
  },
];

export const parkingSite = {
  id: 384,
  source_id: 1,
  original_uid: '8',
  name: 'Parkhaus Flandernstraße',
  operator_name: 'Parkraumgesellschaft Baden-Württemberg mbH',
  address: 'Flandernstraße 101 A, 73732 Esslingen',
  type: 'CAR_PARK',
  purpose: 'CAR',
  lat: 48.7448187,
  lon: 9.321229,
  capacity: 459,
  max_height: 185,
  has_realtime_data: true,
  realtime_free_capacity: 212,
  realtime_data_updated_at: '2026-10-24T13:51:28Z',
  opening_hours: '24/7',
};

const emptyStyle = {
  version: 8,
  sources: {},
  layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#eef0f2' } }],
};

interface Fixtures {
  tileRequests: string[];
  geocoderRequests: URL[];
}

export const test = base.extend<Fixtures>({
  tileRequests: [
    async ({ context, baseURL }, use) => {
      const tileRequests: string[] = [];

      // Routed on the context rather than the page, as MapLibre requests its tiles from a web worker. Anything not
      // answered below must not leave the test: no request reaches the real services.
      const appOrigin = new URL(baseURL!).origin;
      await context.route(
        (url) => url.origin !== appOrigin,
        (route) => route.abort(),
      );
      await context.route(MAP_STYLE_URL, (route) => route.fulfill({ json: emptyStyle }));
      await context.route(`${PARK_API_URL}/v3/sources`, (route) =>
        route.fulfill({ json: { items: sources, total_count: sources.length } }),
      );
      await context.route(`${PARK_API_URL}/v3/sources/*`, (route) => {
        const id = Number(new URL(route.request().url()).pathname.split('/').pop());
        const source = sources.find((item) => item.id === id);
        return source ? route.fulfill({ json: source }) : route.fulfill({ status: 404, json: {} });
      });
      await context.route(`${PARK_API_URL}/v3/parking-sites/*`, (route) => {
        const id = Number(new URL(route.request().url()).pathname.split('/').pop());
        return id === parkingSite.id
          ? route.fulfill({ json: parkingSite })
          : route.fulfill({ status: 404, json: { message: 'not found' } });
      });
      // An empty body is a valid, empty vector tile.
      await context.route(`${PARK_API_URL}/v3/tiles/**`, (route) => {
        tileRequests.push(route.request().url());
        return route.fulfill({ status: 200, contentType: 'application/x-protobuf', body: Buffer.alloc(0) });
      });

      await use(tileRequests);
    },
    { auto: true },
  ],
  geocoderRequests: [
    async ({ context, tileRequests: _ }, use) => {
      const geocoderRequests: URL[] = [];
      // Searched with and without the restriction to Germany; the unrestricted search finds German places as well.
      await context.route(`${GEOCODER_URL}/api?*`, (route) => {
        const url = new URL(route.request().url());
        geocoderRequests.push(url);
        const features =
          url.searchParams.get('countrycode') === 'DE' ? places.germany : [...places.elsewhere, ...places.germany];
        return route.fulfill({
          json: { type: 'FeatureCollection', features },
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
      });
      await use(geocoderRequests);
    },
    { auto: true },
  ],
});

export { expect };
