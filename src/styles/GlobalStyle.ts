import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    margin: 0;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.background};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
  }

  a:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  code {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.9em;
    background: ${({ theme }) => theme.colors.surface};
    padding: 0.1em 0.35em;
    border-radius: 3px;
  }
`;
