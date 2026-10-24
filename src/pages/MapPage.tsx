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
  align-items: flex-end;
  gap: 0.5rem;
  z-index: 4;
`;

const Filter = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.25rem;
  padding: 0.3rem;
  background: ${({ theme }) => theme.colors.overlay};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.3rem 0.7rem;
  border: none;
  border-radius: 4px;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? '#fff' : theme.colors.text)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};

  &:hover {
    background: ${({ theme, $active }) => ($active ? theme.colors.primaryDark : theme.colors.surface)};
  }
`;

// The imprint and privacy policy have to be reachable from every page, the map has no footer to carry them.
const LegalLinks = styled.nav`
  display: flex;
  gap: 0.75rem;
  padding: 0.25rem 0.6rem;
  background: ${({ theme }) => theme.colors.overlay};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  font-size: 0.8rem;

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
        <Filter role="group" aria-label={t.map.filter}>
          <FilterButton type="button" $active={purpose === null} aria-pressed={purpose === null} onClick={() => setPurpose(null)}>
            {t.map.all}
          </FilterButton>
          {purposes.map((item) => (
            <FilterButton
              key={item}
              type="button"
              $active={purpose === item}
              aria-pressed={purpose === item}
              onClick={() => setPurpose(item)}
            >
              {t.purposes[item]}
            </FilterButton>
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
