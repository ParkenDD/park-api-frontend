import { config } from './config';

/** A search result of the Photon geocoder, reduced to what the map needs. */
export interface Place {
  id: string;
  name: string;
  /** Postcode, city and region, and the country outside Germany, as far as they add to the name. */
  context: string;
  /** Longitude and latitude. */
  center: [number, number];
  /** West, south, east and north, for places with an extent such as streets and cities. */
  bounds?: [number, number, number, number];
}

interface PhotonProperties {
  osm_type: string;
  osm_id: number;
  name?: string;
  street?: string;
  housenumber?: string;
  postcode?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  countrycode?: string;
  /** West, north, east and south, which is not the order MapLibre uses. */
  extent?: [number, number, number, number];
}

interface PhotonResponse {
  features: { properties: PhotonProperties; geometry: { coordinates: [number, number] } }[];
}

// ParkAPI covers parking mostly in Germany. Places elsewhere can still be found, but only after the German ones.
const PREFERRED_COUNTRY_CODE = 'DE';
const LIMIT = 6;
// Kept for places outside Germany, so that a German street named after a foreign city cannot hide the city itself.
const OTHER_COUNTRIES_SLOTS = 2;

function toPlace({ properties, geometry }: PhotonResponse['features'][number]): Place {
  const address = [properties.street, properties.housenumber].filter(Boolean).join(' ');
  const name = properties.name ?? (address || properties.city || '');
  const locality = [properties.postcode, properties.city ?? properties.district].filter(Boolean).join(' ');
  const country = properties.countrycode === PREFERRED_COUNTRY_CODE ? '' : properties.country;
  const context = [properties.name ? address : '', locality, properties.state, country]
    .filter((part) => part && part !== name)
    .join(', ');
  const extent = properties.extent;
  return {
    id: `${properties.osm_type}${properties.osm_id}`,
    name,
    context,
    center: geometry.coordinates,
    bounds: extent ? [extent[0], extent[3], extent[2], extent[1]] : undefined,
  };
}

async function fetchPlaces(params: URLSearchParams, signal?: AbortSignal): Promise<Place[]> {
  const response = await fetch(`${config.geocoderUrl}/api?${params}`, { signal });
  if (!response.ok) {
    throw new Error(`Geocoder responded with ${response.status}`);
  }
  const data = (await response.json()) as PhotonResponse;
  return data.features.map(toPlace).filter((place) => place.name);
}

/**
 * Searches for addresses and places, preferring the ones near `near` (the centre of the map). Photon has no way to
 * rank one country higher, so Germany and the rest of the world are searched side by side, and the places in Germany
 * come first.
 */
export async function searchPlaces(
  query: string,
  options: { language: string; near?: { lon: number; lat: number; zoom: number }; signal?: AbortSignal },
): Promise<Place[]> {
  const params = new URLSearchParams({ q: query, limit: String(LIMIT), lang: options.language });
  if (options.near) {
    params.set('lon', options.near.lon.toFixed(5));
    params.set('lat', options.near.lat.toFixed(5));
    params.set('zoom', String(Math.round(options.near.zoom)));
  }
  const preferredParams = new URLSearchParams(params);
  preferredParams.set('countrycode', PREFERRED_COUNTRY_CODE);
  const [preferred, all] = await Promise.all([
    fetchPlaces(preferredParams, options.signal),
    fetchPlaces(params, options.signal),
  ]);
  const ids = new Set(preferred.map((place) => place.id));
  const others = all.filter((place) => !ids.has(place.id));
  const preferredCount = LIMIT - Math.min(OTHER_COUNTRIES_SLOTS, others.length);
  return [...preferred.slice(0, preferredCount), ...others].slice(0, LIMIT);
}
