import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import '@fontsource/open-sans/latin-400.css';
import '@fontsource/open-sans/latin-600.css';
import '@fontsource/open-sans/latin-700.css';

import { App } from './App';
import { LanguageProvider } from './i18n/LanguageContext';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <LanguageProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
);
