import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useLanguage } from '../../i18n/LanguageContext';
import { fetchParkingSite, fetchSource, type ParkingSite, type Source } from '../../lib/api';
import { publicApiUrl } from '../../lib/config';

const Panel = styled.aside`
  position: absolute;
  top: calc(${({ theme }) => theme.headerHeight} + 0.75rem);
  left: 0.75rem;
  max-height: calc(100% - ${({ theme }) => theme.headerHeight} - 3.25rem);
  width: 360px;
  max-width: calc(100% - 1.5rem);
  overflow-y: auto;
  padding: 1.25rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  z-index: 5;

  h2 {
    margin: 0 2rem 0.25rem 0;
    font-size: 1.25rem;
    line-height: 1.3;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: none;
    max-height: 55%;
    border-radius: ${({ theme }) => theme.radius} ${({ theme }) => theme.radius} 0 0;
  }
`;

const Close = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

const Subtitle = styled.p`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const Occupancy = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius};

  strong {
    font-size: 1.6rem;
  }

  small {
    display: block;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const Details = styled.dl`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.35rem 1rem;
  margin: 0 0 1rem;
  font-size: 0.95rem;

  dt {
    color: ${({ theme }) => theme.colors.muted};
  }

  dd {
    margin: 0;
    overflow-wrap: anywhere;
  }
`;

const SourceNote = styled.p`
  margin: 1rem 0 0;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
`;

function formatDateTime(locale: string, value?: string): string | null {
  return value ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : null;
}

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'loaded'; parkingSite: ParkingSite; source: Source | null };

interface ParkingSitePanelProps {
  parkingSiteId: number;
  onClose: () => void;
}

export function ParkingSitePanel({ parkingSiteId, onClose }: ParkingSitePanelProps) {
  const [state, setState] = useState<State>({ status: 'loading' });
  const { t } = useLanguage();

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    (async () => {
      try {
        const parkingSite = await fetchParkingSite(parkingSiteId, controller.signal);
        // The source is only needed for the attribution, so the parking site is shown even if it fails.
        const source = await fetchSource(parkingSite.source_id, controller.signal).catch(() => null);
        setState({ status: 'loaded', parkingSite, source });
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
          setState({ status: 'error' });
        }
      }
    })();
    return () => controller.abort();
  }, [parkingSiteId]);

  return (
    <Panel aria-label={t.panel.label} data-testid="parking-site-panel">
      <Close type="button" onClick={onClose} aria-label={t.panel.close}>
        ×
      </Close>
      {state.status === 'loading' && <p>{t.panel.loading}</p>}
      {state.status === 'error' && <p>{t.panel.error}</p>}
      {state.status === 'loaded' && <ParkingSiteDetails parkingSite={state.parkingSite} source={state.source} />}
    </Panel>
  );
}

function ParkingSiteDetails({ parkingSite, source }: { parkingSite: ParkingSite; source: Source | null }) {
  const { t } = useLanguage();
  const subtitle = [t.purposes[parkingSite.purpose], parkingSite.type && t.parkingSiteTypes[parkingSite.type]]
    .filter(Boolean)
    .join(' · ');
  const capacity = parkingSite.realtime_capacity ?? parkingSite.capacity;
  const restrictions = (parkingSite.restrictions ?? [])
    .map((restriction) => restriction.type && (t.audiences[restriction.type] ?? restriction.type))
    .filter(Boolean);

  return (
    <>
      <h2>{parkingSite.name}</h2>
      <Subtitle>{subtitle}</Subtitle>

      {parkingSite.has_realtime_data && parkingSite.realtime_free_capacity !== undefined ? (
        <Occupancy data-testid="occupancy">
          <strong>{parkingSite.realtime_free_capacity}</strong>
          <span>
            {capacity !== undefined ? t.panel.freeOf(capacity) : t.panel.free}
            <small>
              {t.panel.asOf}: {formatDateTime(t.locale, parkingSite.realtime_data_updated_at)}
            </small>
          </span>
        </Occupancy>
      ) : (
        capacity !== undefined && (
          <Occupancy data-testid="occupancy">
            <strong>{capacity}</strong>
            <span>
              {t.panel.spaces}
              <small>{t.panel.noRealtime}</small>
            </span>
          </Occupancy>
        )
      )}

      <Details>
        {parkingSite.address && (
          <>
            <dt>{t.panel.address}</dt>
            <dd>{parkingSite.address}</dd>
          </>
        )}
        {parkingSite.operator_name && (
          <>
            <dt>{t.panel.operator}</dt>
            <dd>{parkingSite.operator_name}</dd>
          </>
        )}
        {parkingSite.opening_hours && (
          <>
            <dt>{t.panel.openingHours}</dt>
            <dd>{parkingSite.opening_hours === '24/7' ? t.panel.alwaysOpen : parkingSite.opening_hours}</dd>
          </>
        )}
        {parkingSite.realtime_opening_status && parkingSite.realtime_opening_status !== 'UNKNOWN' && (
          <>
            <dt>{t.panel.status}</dt>
            <dd>{parkingSite.realtime_opening_status === 'OPEN' ? t.panel.open : t.panel.closed}</dd>
          </>
        )}
        {parkingSite.has_fee !== undefined && (
          <>
            <dt>{t.panel.fees}</dt>
            <dd>{parkingSite.fee_description ?? (parkingSite.has_fee ? t.panel.withFee : t.panel.freeOfCharge)}</dd>
          </>
        )}
        {parkingSite.max_height !== undefined && (
          <>
            <dt>{t.panel.maxHeight}</dt>
            <dd>{(parkingSite.max_height / 100).toLocaleString(t.locale)} m</dd>
          </>
        )}
        {restrictions.length > 0 && (
          <>
            <dt>{t.panel.reservedFor}</dt>
            <dd>{restrictions.join(', ')}</dd>
          </>
        )}
        {parkingSite.description && (
          <>
            <dt>{t.panel.notes}</dt>
            <dd>{parkingSite.description}</dd>
          </>
        )}
        {parkingSite.public_url && (
          <>
            <dt>{t.panel.website}</dt>
            <dd>
              <a href={parkingSite.public_url} target="_blank" rel="noreferrer">
                {t.panel.moreInformation}
              </a>
            </dd>
          </>
        )}
        <dt>{t.panel.data}</dt>
        <dd>
          <a href={`${publicApiUrl}/v3/parking-sites/${parkingSite.id}`} target="_blank" rel="noreferrer">
            JSON
          </a>
        </dd>
      </Details>

      {source && (
        <SourceNote data-testid="source-note">
          {t.panel.source}: {source.attribution_contributor || source.name || source.uid}
          {source.attribution_license && (
            <>
              , {t.panel.license}: {source.attribution_license}
            </>
          )}
        </SourceNote>
      )}
    </>
  );
}
