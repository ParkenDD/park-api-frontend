import type { ExpressionSpecification } from 'maplibre-gl';

import { theme } from '../../styles/theme';

// ParkAPI renders no parking sites into tiles below this zoom level (RENDER_PARKING_SITES_MIN_ZOOM in park-api).
export const PARKING_SITES_MIN_ZOOM = 8;

export const PARKING_SITES_SOURCE = 'parking-sites';
export const PARKING_SITES_LAYER = 'parking-sites';
// The layer name inside the vector tiles, as written by park-api's TilesHandler.
export const PARKING_SITES_SOURCE_LAYER = 'parking_sites';

// A share of free spaces below this counts as "almost full".
const SCARCE_RATIO = 0.1;

/**
 * Colours a parking site by occupancy. `free_capacity` is only part of a tile while the realtime data of the site is
 * current, so a missing value means "no realtime information" rather than "unknown capacity".
 */
export const circleColor: ExpressionSpecification = [
  'case',
  ['!', ['has', 'free_capacity']],
  theme.colors.unknown,
  ['<=', ['get', 'free_capacity'], 0],
  theme.colors.full,
  ['all', ['has', 'capacity'], ['>', ['get', 'capacity'], 0], ['<', ['/', ['get', 'free_capacity'], ['get', 'capacity']], SCARCE_RATIO]],
  theme.colors.scarce,
  theme.colors.free,
];

export const circleRadius: ExpressionSpecification = ['interpolate', ['linear'], ['zoom'], 8, 4.5, 12, 6.5, 16, 8.5];
