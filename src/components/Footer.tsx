import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useLanguage } from '../i18n/LanguageContext';
import { routes } from '../i18n/routes';

const Bar = styled.footer`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1.5rem;
  padding: 1.5rem 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;

  a {
    color: ${({ theme }) => theme.colors.muted};
  }
`;

export function Footer() {
  const { t } = useLanguage();

  return (
    <Bar>
      <span>
        {t.footer.openSourcePrefix} <a href="https://github.com/ParkenDD/park-api-v3">{t.footer.openSource}</a>
      </span>
      <Link to={routes.imprint}>{t.pageTitles.imprint}</Link>
      <Link to={routes.privacy}>{t.pageTitles.privacy}</Link>
    </Bar>
  );
}
