import {
  AttributionControl,
  GeolocateControl,
  Map as MaplibreMap,
  NavigationControl,
  ScaleControl,
  setWorkerUrl,
  type VectorTileSource,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useLanguage } from '../../i18n/LanguageContext';
import { routes } from '../../i18n/routes';
import { tilesUrl, type PurposeType } from '../../lib/api';
import { config } from '../../lib/config';
import {
  CIRCLE_STROKE_WIDTH,
  LABEL_BACKGROUND_IMAGE,
  LABEL_FONT,
  LABEL_PADDING,
  LABEL_TEXT_SIZE,
  LABELS_MIN_ZOOM,
  PARKING_SITES_LABEL_LAYER,
  PARKING_SITES_LAYER,
  PARKING_SITES_MIN_ZOOM,
  PARKING_SITES_SOURCE,
  PARKING_SITES_SOURCE_LAYER,
  circleColor,
  circleRadius,
  createLabelBackground,
  createPurposeIcons,
  labelOffset,
  labelText,
} from './mapStyle';

// MapLibre looks for its worker next to its own module, which no longer exists once Vite has bundled it, so the
// worker is emitted as an asset of its own and handed over explicitly.
setWorkerUrl(workerUrl);

// Stuttgart, at the lowest zoom level ParkAPI renders parking sites for.
const INITIAL_CENTER: [number, number] = [9.18, 48.78];
const INITIAL_ZOOM = PARKING_SITES_MIN_ZOOM;

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
  selectedId: number | null;
  onSelect: (parkingSiteId: number) => void;
  onZoomChange: (zoom: number) => void;
}

export function ParkingMap({ purpose, selectedId, onSelect, onZoomChange }: ParkingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const { t } = useLanguage();
  // The map is created once, so its event handlers have to read the latest callbacks through refs.
  const onSelectRef = useRef(onSelect);
  const onZoomChangeRef = useRef(onZoomChange);
  const purposeRef = useRef(purpose);
  const selectedIdRef = useRef(selectedId);
  onSelectRef.current = onSelect;
  onZoomChangeRef.current = onZoomChange;
  purposeRef.current = purpose;
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
        tiles: [tilesUrl(purposeRef.current)],
        minzoom: PARKING_SITES_MIN_ZOOM,
        // Tiles only hold points, so higher zoom levels are rendered by overzooming instead of being requested.
        maxzoom: 16,
      });
      map.addLayer({
        id: PARKING_SITES_LAYER,
        type: 'circle',
        source: PARKING_SITES_SOURCE,
        'source-layer': PARKING_SITES_SOURCE_LAYER,
        paint: {
          'circle-color': circleColor,
          'circle-radius': circleRadius,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': ['case', ['==', ['get', 'id'], selectedIdRef.current ?? -1], 3, CIRCLE_STROKE_WIDTH],
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
          filter: ['any', ['has', 'capacity'], ['has', 'free_capacity']],
          layout: {
            'text-field': labelText,
            'text-font': LABEL_FONT,
            'text-size': LABEL_TEXT_SIZE,
            'text-anchor': 'left',
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
    });

    map.on('click', PARKING_SITES_LAYER, (event) => {
      const id = event.features?.[0]?.properties?.id;
      if (typeof id === 'number') {
        onSelectRef.current(id);
      }
    });
    map.on('mouseenter', PARKING_SITES_LAYER, () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', PARKING_SITES_LAYER, () => {
      map.getCanvas().style.cursor = '';
    });
    map.on('zoomend', () => onZoomChangeRef.current(map.getZoom()));
    onZoomChangeRef.current(map.getZoom());

    return () => {
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
      customAttribution: `${t.map.attribution}: <a href="${routes.openData}#sources">${t.map.attributionLink}</a>`,
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
    source?.setTiles([tilesUrl(purpose)]);
  }, [purpose]);

  useEffect(() => {
    const map = mapRef.current;
    if (map?.getLayer(PARKING_SITES_LAYER)) {
      map.setPaintProperty(PARKING_SITES_LAYER, 'circle-stroke-width', [
        'case',
        ['==', ['get', 'id'], selectedId ?? -1],
        3,
        CIRCLE_STROKE_WIDTH,
      ]);
    }
  }, [selectedId]);

  return (
    <Wrapper data-testid="map">
      <Container ref={containerRef} />
    </Wrapper>
  );
}
