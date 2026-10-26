// A minimal encoder for Mapbox Vector Tiles (https://github.com/mapbox/vector-tile-spec), just enough to hand MapLibre
// a polygon in the tests.

const TILE_EXTENT = 4096;

function varint(value: number): number[] {
  const bytes: number[] = [];
  while (value > 0x7f) {
    bytes.push((value & 0x7f) | 0x80);
    value >>>= 7;
  }
  bytes.push(value);
  return bytes;
}

const zigzag = (value: number) => (value << 1) ^ (value >> 31);

const varintField = (field: number, value: number) => [...varint(field << 3), ...varint(value)];

const bytesField = (field: number, bytes: number[]) => [...varint((field << 3) | 2), ...varint(bytes.length), ...bytes];

const stringField = (field: number, value: string) => bytesField(field, [...Buffer.from(value, 'utf8')]);

const packedField = (field: number, values: number[]) => bytesField(field, values.flatMap(varint));

/** The commands of a single ring, in tile coordinates. The exterior ring of a polygon has to be clockwise. */
function ringGeometry(ring: [number, number][]): number[] {
  const command = (id: number, count: number) => (id & 0x7) | (count << 3);
  const geometry: number[] = [];
  let [cursorX, cursorY] = [0, 0];
  ring.forEach(([x, y], index) => {
    if (index === 0) {
      geometry.push(command(1, 1));
    } else if (index === 1) {
      geometry.push(command(2, ring.length - 1));
    }
    geometry.push(zigzag(x - cursorX), zigzag(y - cursorY));
    [cursorX, cursorY] = [x, y];
  });
  geometry.push(command(7, 1));
  return geometry;
}

/**
 * A tile with a single layer which holds one polygon covering the whole tile, so that it covers the whole map when
 * every tile is answered with it.
 */
export function polygonTile(layerName: string, properties: Record<string, string | number>): Buffer {
  const keys = Object.keys(properties);
  const values = Object.values(properties).map((value) =>
    typeof value === 'number' ? varintField(5, value) : stringField(1, value),
  );
  const buffer = 64;
  const ring: [number, number][] = [
    [-buffer, -buffer],
    [TILE_EXTENT + buffer, -buffer],
    [TILE_EXTENT + buffer, TILE_EXTENT + buffer],
    [-buffer, TILE_EXTENT + buffer],
  ];
  const feature = [
    ...packedField(2, keys.flatMap((_, index) => [index, index])),
    ...varintField(3, 3),
    ...packedField(4, ringGeometry(ring)),
  ];
  const layer = [
    ...varintField(15, 2),
    ...stringField(1, layerName),
    ...bytesField(2, feature),
    ...keys.flatMap((key) => stringField(3, key)),
    ...values.flatMap((value) => bytesField(4, value)),
    ...varintField(5, TILE_EXTENT),
  ];
  return Buffer.from(bytesField(3, layer));
}
