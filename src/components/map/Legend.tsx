import styled from 'styled-components';

import { useLanguage } from '../../i18n/LanguageContext';

const Box = styled.div`
  padding: 0.6rem 0.8rem;
  background: ${({ theme }) => theme.colors.overlay};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  font-size: 0.85rem;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const Dot = styled.span<{ $color: 'free' | 'scarce' | 'full' | 'unknown' }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1.5px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
  background: ${({ theme, $color }) => theme.colors[$color]};
`;

export function Legend() {
  const { t } = useLanguage();

  return (
    <Box>
      <ul aria-label={t.map.legend}>
        <li>
          <Dot $color="free" /> {t.map.free}
        </li>
        <li>
          <Dot $color="scarce" /> {t.map.scarce}
        </li>
        <li>
          <Dot $color="full" /> {t.map.full}
        </li>
        <li>
          <Dot $color="unknown" /> {t.map.unknown}
        </li>
      </ul>
    </Box>
  );
}
