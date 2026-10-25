import { useCallback, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { Header } from '../components/Header';
import { Legend } from '../components/map/Legend';
import { PARKING_SITES_MIN_ZOOM } from '../components/map/mapStyle';
import { ParkingMap } from '../components/map/ParkingMap';
import { ParkingSitePanel } from '../components/map/ParkingSitePanel';
import { useLanguage } from '../i18n/LanguageContext';
import { routes } from '../i18n/routes';
import type { PurposeType } from '../lib/api';

const purposes: PurposeType[] = ['CAR', 'BIKE', 'MOTORCYCLE', 'ITEM'];

const Page = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
`;

const Controls = styled.div`
  position: absolute;
  right: 0.75rem;
  bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  /* The boxes share the width of the widest one. */
  align-items: stretch;
  gap: 0.5rem;
  z-index: 4;
`;

const Filter = styled.select`
  padding: 0.4rem 2rem 0.4rem 0.7rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius};
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.overlay}
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%231d2733'/%3E%3C/svg%3E")
    no-repeat right 0.7rem center;
  box-shadow: ${({ theme }) => theme.shadow};
  appearance: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

// The imprint and privacy policy have to be reachable from every page, the map has no footer to carry them.
const LegalLinks = styled.nav`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.4rem 0.8rem;
  background: ${({ theme }) => theme.colors.overlay};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  font-size: 0.85rem;

  a {
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const ZoomHint = styled.div`
  position: absolute;
  top: calc(${({ theme }) => theme.headerHeight} + 1rem);
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.text};
  color: #fff;
  border-radius: 999px;
  font-size: 0.9rem;
  white-space: nowrap;
  z-index: 4;
  pointer-events: none;
`;

export function MapPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [purpose, setPurpose] = useState<PurposeType | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);

  const siteParam = Number(searchParams.get('site'));
  const selectedId = Number.isInteger(siteParam) && siteParam > 0 ? siteParam : null;

  // The map position lives in the URL hash (maplibre's `hash` option), so changing the selection must keep it.
  const setSelectedId = useCallback(
    (parkingSiteId: number | null) => {
      const search = parkingSiteId === null ? '' : `?site=${parkingSiteId}`;
      navigate({ search, hash: window.location.hash }, { replace: true });
    },
    [navigate],
  );

  return (
    <Page>
      <Header overlay />
      <ParkingMap purpose={purpose} selectedId={selectedId} onSelect={setSelectedId} onZoomChange={setZoom} />
      {zoom !== null && zoom < PARKING_SITES_MIN_ZOOM && (
        <ZoomHint data-testid="zoom-hint">{t.map.zoomHint}</ZoomHint>
      )}
      {selectedId !== null && <ParkingSitePanel parkingSiteId={selectedId} onClose={() => setSelectedId(null)} />}
      <Controls>
        <Filter
          aria-label={t.map.filter}
          value={purpose ?? ''}
          onChange={(event) => setPurpose((event.target.value || null) as PurposeType | null)}
        >
          <option value="">{t.map.all}</option>
          {purposes.map((item) => (
            <option key={item} value={item}>
              {t.purposes[item]}
            </option>
          ))}
        </Filter>
        <Legend />
        <LegalLinks aria-label={t.map.legal}>
          <Link to={routes.imprint}>{t.pageTitles.imprint}</Link>
          <Link to={routes.privacy}>{t.pageTitles.privacy}</Link>
        </LegalLinks>
      </Controls>
    </Page>
  );
}
