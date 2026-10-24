import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { languages, useLanguage } from '../i18n/LanguageContext';
import { messages } from '../i18n/messages';
import { routes } from '../i18n/routes';

const Bar = styled.header<{ $overlay: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  height: ${({ theme }) => theme.headerHeight};
  padding: 0 1.25rem;
  background: ${({ theme }) => theme.colors.overlay};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 10;

  ${({ $overlay }) =>
    $overlay
      ? css`
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
        `
      : css`
          position: sticky;
          top: 0;
          backdrop-filter: blur(6px);
        `}
`;

const Brand = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.35rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  white-space: nowrap;

  img {
    width: 32px;
    height: 32px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    span {
      display: none;
    }
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
`;

const Nav = styled.nav`
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
`;

const Switcher = styled.div`
  display: flex;
  flex-shrink: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  overflow: hidden;
`;

const SwitcherButton = styled.button<{ $active: boolean }>`
  padding: 0.2rem 0.5rem;
  border: none;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? '#fff' : theme.colors.muted)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};

  &:hover {
    color: ${({ theme, $active }) => ($active ? '#fff' : theme.colors.text)};
  }
`;

const Link = styled(NavLink)`
  padding: 0.4rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.4rem 0.5rem;
    font-size: 0.9rem;
  }
`;

export function Header({ overlay = false }: { overlay?: boolean }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Bar $overlay={overlay}>
      <Brand to={routes.map} end>
        <img src="/favicon.svg" alt="ParkAPI" />
        <span>ParkAPI</span>
      </Brand>
      <Right>
        <Nav aria-label={t.header.navigation}>
          <Link to={routes.map} end>
            {t.pageTitles.map}
          </Link>
          <Link to={routes.about}>{t.pageTitles.about}</Link>
          <Link to={routes.openData}>{t.pageTitles.openData}</Link>
        </Nav>
        <Switcher role="group" aria-label={t.header.languageSwitcher}>
          {languages.map((item) => (
            <SwitcherButton
              key={item}
              type="button"
              lang={item}
              title={messages[item].languageName}
              aria-label={messages[item].languageName}
              aria-pressed={item === language}
              $active={item === language}
              onClick={() => setLanguage(item)}
            >
              {item.toUpperCase()}
            </SwitcherButton>
          ))}
        </Switcher>
      </Right>
    </Bar>
  );
}
