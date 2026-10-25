import { mdiBicycle, mdiCar, mdiLocker, mdiMotorbike } from '@mdi/js';
import type { ExpressionSpecification, StyleImageMetadata } from 'maplibre-gl';

import type { PurposeType } from '../../lib/api';
import { theme } from '../../styles/theme';

// ParkAPI renders no parking sites into tiles below this zoom level (RENDER_PARKING_SITES_MIN_ZOOM in park-api).
export const PARKING_SITES_MIN_ZOOM = 8;

export const PARKING_SITES_SOURCE = 'parking-sites';
export const PARKING_SITES_LAYER = 'parking-sites';
export const PARKING_SITES_LABEL_LAYER = 'parking-sites-labels';
export const LABEL_BACKGROUND_IMAGE = 'parking-site-label-background';
// The layer name inside the vector tiles, as written by park-api's TilesHandler.
export const PARKING_SITES_SOURCE_LAYER = 'parking_sites';

// A share of free spaces below this counts as "almost full".
const SCARCE_RATIO = 0.1;

type Occupancy = 'free' | 'scarce' | 'full' | 'unknown';
const OCCUPANCIES: Occupancy[] = ['free', 'scarce', 'full', 'unknown'];

/**
 * The occupancy of a parking site. `free_capacity` is only part of a tile while the realtime data of the site is
 * current, so a missing value means "no realtime information" rather than "unknown capacity".
 */
const occupancy: ExpressionSpecification = [
  'case',
  ['!', ['has', 'free_capacity']],
  'unknown',
  ['<=', ['get', 'free_capacity'], 0],
  'full',
  ['all', ['has', 'capacity'], ['>', ['get', 'capacity'], 0], ['<', ['/', ['get', 'free_capacity'], ['get', 'capacity']], SCARCE_RATIO]],
  'scarce',
  'free',
];

export const circleColor = [
  'match',
  occupancy,
  ...OCCUPANCIES.flatMap((item) => [item, theme.colors[item]]),
  theme.colors.unknown,
] as ExpressionSpecification;

// Zoom level and circle radius in pixels.
const CIRCLE_RADIUS_STOPS: [number, number][] = [
  [8, 4.5],
  [12, 6.5],
  [16, 8.5],
];
export const CIRCLE_STROKE_WIDTH = 1.5;

export const circleRadius: ExpressionSpecification = ['interpolate', ['linear'], ['zoom'], ...CIRCLE_RADIUS_STOPS.flat()];

// Below this zoom level, the labels would mostly hide each other.
export const LABELS_MIN_ZOOM = 11;

// Has to be one of the fonts the glyphs of the base map style provide.
export const LABEL_FONT = ['Open Sans Bold'];
export const LABEL_TEXT_SIZE = 12;

// Space between the text and the edge of its box, in pixels: top, right, bottom, left. A line of text reserves more
// space above digits than below them, which the smaller top padding evens out.
export const LABEL_PADDING: [number, number, number, number] = [2, 4.5, 4.5, 4.5];
// Negative: the box covers the white ring of its circle and overlaps the colour by a pixel, so the two are connected.
const LABEL_GAP = -CIRCLE_STROKE_WIDTH - 1;

/**
 * Places the label right of its circle, with its box starting just beyond the circle's edge. The offset is given in
 * ems of the text and follows the circle radius, which grows with the zoom level.
 */
export const labelOffset: ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['zoom'],
  ...CIRCLE_RADIUS_STOPS.flatMap(([zoom, radius]) => [
    zoom,
    ['literal', [(radius + CIRCLE_STROKE_WIDTH + LABEL_GAP + LABEL_PADDING[3]) / LABEL_TEXT_SIZE, 0]],
  ]),
] as ExpressionSpecification;

/** "free / total" while realtime data is current, otherwise just the total. */
const labelNumbers: ExpressionSpecification = [
  'case',
  ['all', ['has', 'free_capacity'], ['has', 'capacity']],
  ['concat', ['to-string', ['get', 'free_capacity']], ' / ', ['to-string', ['get', 'capacity']]],
  ['has', 'free_capacity'],
  ['to-string', ['get', 'free_capacity']],
  ['to-string', ['get', 'capacity']],
];

const PURPOSE_ICONS: Record<PurposeType, string> = {
  CAR: mdiCar,
  BIKE: mdiBicycle,
  MOTORCYCLE: mdiMotorbike,
  ITEM: mdiLocker,
};

// Has to match the image name labelText builds for each parking site.
const purposeIconName = (purpose: string, occupancyName: string) => `purpose-${purpose}-${occupancyName}`;

/** The numbers, followed by an icon of the purpose in the colour of the occupancy. */
export const labelText: ExpressionSpecification = [
  'format',
  // Everything is centred on the line, which is as high as the icon, so the numbers sit in the middle of the box.
  labelNumbers,
  { 'vertical-align': 'center' },
  ' ',
  { 'vertical-align': 'center' },
  ['image', ['concat', 'purpose-', ['get', 'purpose'], '-', occupancy]],
  { 'vertical-align': 'center' },
];

// Height of the icon in pixels, a bit higher than the text.
const PURPOSE_ICON_SIZE = 14;
// Material Design Icons are drawn on a 24 × 24 grid.
const MDI_GRID_SIZE = 24;

/** One icon per purpose and occupancy, as icons inside a text cannot be coloured by an expression. */
export function createPurposeIcons(): { name: string; image: ImageData; options: Partial<StyleImageMetadata> }[] {
  return Object.entries(PURPOSE_ICONS).flatMap(([purpose, path]) =>
    OCCUPANCIES.map((item) => {
      // Drawn at twice the size for sharp edges on high density screens.
      const size = PURPOSE_ICON_SIZE * 2;
      const context = document.createElement('canvas').getContext('2d')!;
      context.canvas.width = size;
      context.canvas.height = size;
      context.scale(size / MDI_GRID_SIZE, size / MDI_GRID_SIZE);
      context.fillStyle = theme.colors[item];
      context.fill(new Path2D(path));
      return {
        name: purposeIconName(purpose, item),
        image: context.getImageData(0, 0, size, size),
        options: { pixelRatio: 2 },
      };
    }),
  );
}

const LABEL_BACKGROUND_SIZE = 32;
const LABEL_BACKGROUND_RADIUS = 8;
// The corners, which are not stretched.
const LABEL_BACKGROUND_STRETCH_INSET = LABEL_BACKGROUND_RADIUS + 2;

/**
 * A white box with rounded corners behind each label. Only its middle is stretched to fit the text (`icon-text-fit`),
 * so the corners keep their shape. Drawn at twice the size for sharp edges on high density screens.
 */
export function createLabelBackground(): { image: ImageData; options: Partial<StyleImageMetadata> } {
  const size = LABEL_BACKGROUND_SIZE;
  const context = document.createElement('canvas').getContext('2d')!;
  context.canvas.width = size;
  context.canvas.height = size;
  context.beginPath();
  context.roundRect(1, 1, size - 2, size - 2, LABEL_BACKGROUND_RADIUS);
  context.fillStyle = '#ffffff';
  context.fill();
  context.lineWidth = 2;
  context.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  context.stroke();

  const stretch: [number, number] = [LABEL_BACKGROUND_STRETCH_INSET, size - LABEL_BACKGROUND_STRETCH_INSET];
  return {
    image: context.getImageData(0, 0, size, size),
    options: {
      pixelRatio: 2,
      stretchX: [stretch],
      stretchY: [stretch],
      // The whole image is content, the space around the text comes from LABEL_PADDING alone.
      content: [0, 0, size, size],
    },
  };
}
