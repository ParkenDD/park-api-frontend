import type { ReactNode } from 'react';
import styled from 'styled-components';

import { Footer } from './Footer';
import { Header } from './Header';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
  max-width: ${({ theme }) => theme.contentWidth};
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;

  h1 {
    font-size: 2.1rem;
    line-height: 1.25;
    margin: 0 0 1.5rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 1.6rem;
    }
  }

  h2 {
    font-size: 1.45rem;
    line-height: 1.3;
    margin: 2.5rem 0 0.75rem;
  }

  h3 {
    font-size: 1.15rem;
    margin: 1.75rem 0 0.5rem;
  }

  p,
  ul,
  ol {
    margin: 0 0 1rem;
  }

  li {
    margin-bottom: 0.35rem;
  }
`;

export const Lead = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.muted};
`;

export const Notice = styled.aside`
  margin: 1.5rem 0;
  padding: 1rem 1.25rem;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 0 ${({ theme }) => theme.radius} ${({ theme }) => theme.radius} 0;

  > :last-child {
    margin-bottom: 0;
  }
`;

export function ContentLayout({ children }: { children: ReactNode }) {
  return (
    <Page>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </Page>
  );
}
