import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useLanguage } from '../i18n/LanguageContext';
import { fetchSources, type Source } from '../lib/api';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th,
  td {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
    vertical-align: top;
  }

  th {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const ScrollBox = styled.div`
  overflow-x: auto;
`;

const Muted = styled.span`
  color: ${({ theme }) => theme.colors.muted};
`;

const Realtime = styled.span<{ $active: boolean }>`
  font-weight: 600;
  color: ${({ theme, $active }) => ($active ? theme.colors.free : theme.colors.muted)};
`;

function RealtimeStatus({ status }: { status?: Source['realtime_status'] }) {
  const { t } = useLanguage();
  switch (status) {
    case 'ACTIVE':
      return <Realtime $active>{t.sources.realtimeActive}</Realtime>;
    case 'FAILED':
      return <Realtime $active={false}>{t.sources.realtimeFailed}</Realtime>;
    case 'PROVISIONED':
      return <Muted>{t.sources.realtimePending}</Muted>;
    default:
      return <Muted>{t.sources.realtimeNone}</Muted>;
  }
}

type State = { status: 'loading' } | { status: 'error' } | { status: 'loaded'; sources: Source[] };


export function SourceTable() {
  const [state, setState] = useState<State>({ status: 'loading' });
  const { t } = useLanguage();

  useEffect(() => {
    const controller = new AbortController();
    fetchSources(controller.signal)
      .then((sources) => setState({ status: 'loaded', sources }))
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error(error);
          setState({ status: 'error' });
        }
      });
    return () => controller.abort();
  }, []);

  if (state.status === 'loading') {
    return <p>{t.sources.loading}</p>;
  }
  if (state.status === 'error') {
    return <p>{t.sources.error}</p>;
  }

  const sources = [...state.sources].sort((a, b) => (a.name ?? a.uid).localeCompare(b.name ?? b.uid, t.locale));

  return (
    <ScrollBox>
      <p>{t.sources.count(sources.length)}</p>
      <Table data-testid="source-table">
        <thead>
          <tr>
            <th>{t.sources.source}</th>
            <th>{t.sources.contributor}</th>
            <th>{t.sources.license}</th>
            <th>{t.sources.realtime}</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((source) => (
            <tr key={source.id}>
              <td>
                {source.public_url ? <a href={source.public_url}>{source.name || source.uid}</a> : source.name || source.uid}
                <br />
                <Muted>
                  <code>{source.uid}</code>
                </Muted>
              </td>
              <td>
                {source.attribution_contributor ? (
                  source.attribution_url ? (
                    <a href={source.attribution_url}>{source.attribution_contributor}</a>
                  ) : (
                    source.attribution_contributor
                  )
                ) : (
                  <Muted>–</Muted>
                )}
              </td>
              <td>{source.attribution_license || <Muted>{t.sources.noLicense}</Muted>}</td>
              <td>
                <RealtimeStatus status={source.realtime_status} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ScrollBox>
  );
}
