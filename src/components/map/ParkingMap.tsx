import {
  AttributionControl,
  GeolocateControl,
  Map as MaplibreMap,
  Marker,
  NavigationControl,
  ScaleControl,
  setWorkerUrl,
  type VectorTileSource,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useLanguage } from '../../i18n/LanguageContext';
import { routes } from '../../i18n/routes';
import { tilesUrl, type PurposeType, type TileFilter } from '../../lib/api';
import { config } from '../../lib/config';
import type { Place } from '../../lib/geocoder';
import {
  LABEL_BACKGROUND_IMAGE,
  LABEL_FONT,
  LABEL_PADDING,
  LABEL_TEXT_SIZE,
  LABELS_MIN_ZOOM,
  ON_STREET_HIDDEN_UNTIL_ZOOM,
  PARKING_SITE_AREA_OPACITY,
  PARKING_SITE_AREAS_LAYER,
  PARKING_SITE_GEOMETRIES_MIN_ZOOM,
  PARKING_SITE_GEOMETRIES_SOURCE_LAYER,
  PARKING_SITE_OUTLINES_LAYER,
  PARKING_SITES_LABEL_LAYER,
  PARKING_SITES_LAYER,
  PARKING_SITES_MIN_ZOOM,
  PARKING_SITES_SOURCE,
  PARKING_SITES_SOURCE_LAYER,
  circleColor,
  circleRadius,
  circleStrokeWidth,
  createLabelBackground,
  createPurposeIcons,
  isAreaGeometry,
  isPointWithoutGeometry,
  labelAnchor,
  labelFilter,
  labelOffset,
  labelSortKey,
  labelText,
  outlineWidth,
} from './mapStyle';
import { PlaceSearch } from './PlaceSearch';

// Layers whose features open the details of their parking site when clicked. The label layer only exists if the base
// map style provides glyphs.
const CLICKABLE_LAYERS = [
  PARKING_SITES_LAYER,
  PARKING_SITES_LABEL_LAYER,
  PARKING_SITE_AREAS_LAYER,
  PARKING_SITE_OUTLINES_LAYER,
];

// MapLibre looks for its worker next to its own module, which no longer exists once Vite has bundled it, so the
// worker is emitted as an asset of its own and handed over explicitly.
setWorkerUrl(workerUrl);

// Stuttgart, at the lowest zoom level ParkAPI renders parking sites for.
const INITIAL_CENTER: [number, number] = [9.18, 48.78];
const INITIAL_ZOOM = PARKING_SITES_MIN_ZOOM;

// A found address is shown close enough to see the parking around it, a found street or city as a whole.
const PLACE_ZOOM = 16;
const PLACE_MAX_ZOOM = 17;

// MapLibre styles the element it renders into as `position: relative`, so the fullscreen positioning lives on a
// wrapper around it.
const Wrapper = styled.div`
  position: absolute;
  inset: 0;

  .maplibregl-ctrl-top-right {
    top: ${({ theme }) => theme.headerHeight};
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

interface ParkingMapProps {
  purpose: PurposeType | null;
  showOnStreetDetails: boolean;
  selectedId: number | null;
  /** Called with the clicked parking site, or with null when the map is clicked next to all parking sites. */
  onSelect: (parkingSiteId: number | null) => void;
  onZoomChange: (zoom: number) => void;
  /** Height in pixels of the controls in the bottom right corner, i.e. the attribution, which grows when expanded. */
  onBottomRightHeightChange: (height: number) => void;
}

const tileFilter = (purpose: PurposeType | null, showOnStreetDetails: boolean): TileFilter => ({
  purpose,
  hideOnStreetUntilZoom: showOnStreetDetails ? null : ON_STREET_HIDDEN_UNTIL_ZOOM,
});

export function ParkingMap({
  purpose,
  showOnStreetDetails,
  selectedId,
  onSelect,
  onZoomChange,
  onBottomRightHeightChange,
}: ParkingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const placeMarkerRef = useRef<Marker | null>(null);
  const { t } = useLanguage();
  // The map is created once, so its event handlers have to read the latest callbacks through refs.
  const onSelectRef = useRef(onSelect);
  const onZoomChangeRef = useRef(onZoomChange);
  const onBottomRightHeightChangeRef = useRef(onBottomRightHeightChange);
  const purposeRef = useRef(purpose);
  const showOnStreetDetailsRef = useRef(showOnStreetDetails);
  const selectedIdRef = useRef(selectedId);
  onSelectRef.current = onSelect;
  onZoomChangeRef.current = onZoomChange;
  onBottomRightHeightChangeRef.current = onBottomRightHeightChange;
  purposeRef.current = purpose;
  showOnStreetDetailsRef.current = showOnStreetDetails;
  selectedIdRef.current = selectedId;

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const mapPathname = window.location.pathname;
    const map = new MaplibreMap({
      container: containerRef.current,
      style: config.mapStyleUrl,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      hash: 'map',
      // Added by the effect below, as its text depends on the language.
      attributionControl: false,
    });
    mapRef.current = map;

    map.addControl(new NavigationControl(), 'top-right');
    map.addControl(new GeolocateControl({ positionOptions: { enableHighAccuracy: true } }), 'top-right');
    map.addControl(new ScaleControl(), 'bottom-left');

    map.on('load', () => {
      map.addSource(PARKING_SITES_SOURCE, {
        type: 'vector',
        tiles: [tilesUrl(tileFilter(purposeRef.current, showOnStreetDetailsRef.current))],
        minzoom: PARKING_SITES_MIN_ZOOM,
        // Higher zoom levels are rendered by overzooming instead of being requested, which is precise enough for the
        // shapes of parking sites as well.
        maxzoom: 16,
      });
      // Shapes go below the circles, so that the circle and label of a parking site stay on top of its area.
      map.addLayer({
        id: PARKING_SITE_AREAS_LAYER,
        type: 'fill',
        source: PARKING_SITES_SOURCE,
        'source-layer': PARKING_SITE_GEOMETRIES_SOURCE_LAYER,
        minzoom: PARKING_SITE_GEOMETRIES_MIN_ZOOM,
        filter: isAreaGeometry,
        paint: {
          'fill-color': circleColor,
          'fill-opacity': PARKING_SITE_AREA_OPACITY,
        },
      });
      // Outlines of the areas as well as the lines, e.g. parking lanes along a street.
      map.addLayer({
        id: PARKING_SITE_OUTLINES_LAYER,
        type: 'line',
        source: PARKING_SITES_SOURCE,
        'source-layer': PARKING_SITE_GEOMETRIES_SOURCE_LAYER,
        minzoom: PARKING_SITE_GEOMETRIES_MIN_ZOOM,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': circleColor,
          'line-width': outlineWidth(selectedIdRef.current),
        },
      });
      map.addLayer({
        id: PARKING_SITES_LAYER,
        type: 'circle',
        source: PARKING_SITES_SOURCE,
        'source-layer': PARKING_SITES_SOURCE_LAYER,
        // A parking site drawn as its shape needs no circle on top.
        filter: isPointWithoutGeometry,
        paint: {
          'circle-color': circleColor,
          'circle-radius': circleRadius,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': circleStrokeWidth(selectedIdRef.current),
        },
      });
      // Text needs the glyphs of the base map style, a style without them would fail to render the layer.
      if (map.getStyle().glyphs) {
        const labelBackground = createLabelBackground();
        map.addImage(LABEL_BACKGROUND_IMAGE, labelBackground.image, labelBackground.options);
        for (const icon of createPurposeIcons()) {
          map.addImage(icon.name, icon.image, icon.options);
        }
        map.addLayer({
          id: PARKING_SITES_LABEL_LAYER,
          type: 'symbol',
          source: PARKING_SITES_SOURCE,
          'source-layer': PARKING_SITES_SOURCE_LAYER,
          minzoom: LABELS_MIN_ZOOM,
          filter: labelFilter(showOnStreetDetailsRef.current),
          layout: {
            'text-field': labelText,
            'symbol-sort-key': labelSortKey,
            'text-font': LABEL_FONT,
            'text-size': LABEL_TEXT_SIZE,
            'text-anchor': labelAnchor,
            'text-offset': labelOffset,
            'icon-image': LABEL_BACKGROUND_IMAGE,
            'icon-text-fit': 'both',
            'icon-text-fit-padding': LABEL_PADDING,
          },
          paint: {
            'text-color': circleColor,
          },
        });
      }

      // Registered once the layers exist, as querying a missing layer is an error.
      const clickableLayers = CLICKABLE_LAYERS.filter((layer) => map.getLayer(layer));
      // A click next to all parking sites closes the details, like a click outside of a dialog.
      map.on('click', (event) => {
        const id = map.queryRenderedFeatures(event.point, { layers: clickableLayers })[0]?.properties?.id;
        if (typeof id === 'number') {
          onSelectRef.current(id);
        } else if (selectedIdRef.current !== null) {
          onSelectRef.current(null);
        }
      });
      map.on('mouseenter', clickableLayers, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', clickableLayers, () => {
        map.getCanvas().style.cursor = '';
      });
    });

    map.on('zoomend', () => onZoomChangeRef.current(map.getZoom()));
    onZoomChangeRef.current(map.getZoom());

    // The attribution wraps on narrow screens and grows when expanded, so whatever is placed above it has to follow.
    const bottomRight = map.getContainer().querySelector<HTMLElement>('.maplibregl-ctrl-bottom-right');
    const bottomRightObserver = new ResizeObserver(() => {
      if (bottomRight) {
        onBottomRightHeightChangeRef.current(bottomRight.offsetHeight);
      }
    });
    if (bottomRight) {
      bottomRightObserver.observe(bottomRight);
    }

    return () => {
      bottomRightObserver.disconnect();
      // Removing the map removes its position from the URL hash as well. That is right when leaving the map page, but
      // when the map is just mounted again (as StrictMode does in development), the new map has to start from it.
      const { pathname, hash } = window.location;
      map.remove();
      mapRef.current = null;
      if (pathname === mapPathname && hash) {
        window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${hash}`);
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    const attribution = new AttributionControl({
      compact: true,
      // The base map style carries no attribution of its own, so OpenStreetMap is credited here.
      customAttribution: [
        `${t.map.baseMapAttribution} © <a href="https://www.openstreetmap.org/copyright">${t.map.baseMapAttributionLink}</a>`,
        `${t.map.attribution}: <a href="${routes.openData}#sources">${t.map.attributionLink}</a>`,
      ],
    });
    map.addControl(attribution);
    return () => {
      if (mapRef.current === map) {
        map.removeControl(attribution);
      }
    };
  }, [t]);

  useEffect(() => {
    const source = mapRef.current?.getSource<VectorTileSource>(PARKING_SITES_SOURCE);
    source?.setTiles([tilesUrl(tileFilter(purpose, showOnStreetDetails))]);
  }, [purpose, showOnStreetDetails]);

  useEffect(() => {
    const map = mapRef.current;
    if (map?.getLayer(PARKING_SITES_LABEL_LAYER)) {
      map.setFilter(PARKING_SITES_LABEL_LAYER, labelFilter(showOnStreetDetails));
    }
  }, [showOnStreetDetails]);

  useEffect(() => {
    const map = mapRef.current;
    if (map?.getLayer(PARKING_SITES_LAYER)) {
      map.setPaintProperty(PARKING_SITES_LAYER, 'circle-stroke-width', circleStrokeWidth(selectedId));
      map.setPaintProperty(PARKING_SITE_OUTLINES_LAYER, 'line-width', outlineWidth(selectedId));
    }
  }, [selectedId]);

  const getMapCenter = useCallback(() => {
    const map = mapRef.current;
    if (!map) {
      return undefined;
    }
    const { lng, lat } = map.getCenter();
    return { lon: lng, lat, zoom: map.getZoom() };
  }, []);

  const showPlace = useCallback((place: Place) => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    placeMarkerRef.current?.remove();
    placeMarkerRef.current = new Marker({ color: '#1d2733' }).setLngLat(place.center).addTo(map);
    const [west, south, east, north] = place.bounds ?? [];
    // Photon gives a point an extent of zero size, which fitBounds would zoom into as far as it is allowed to.
    if (place.bounds && (west !== east || south !== north)) {
      map.fitBounds(place.bounds, { padding: 60, maxZoom: PLACE_MAX_ZOOM });
    } else {
      map.flyTo({ center: place.center, zoom: PLACE_ZOOM });
    }
  }, []);

  const clearPlace = useCallback(() => {
    placeMarkerRef.current?.remove();
    placeMarkerRef.current = null;
  }, []);

  return (
    <Wrapper data-testid="map">
      <Container ref={containerRef} />
      {config.geocoderUrl && <PlaceSearch getNear={getMapCenter} onSelect={showPlace} onClear={clearPlace} />}
    </Wrapper>
  );
}
