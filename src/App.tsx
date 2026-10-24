import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { useLanguage } from './i18n/LanguageContext';
import { routes, type RouteName } from './i18n/routes';
import { AboutPage } from './pages/about/AboutPage';
import { ImprintPage } from './pages/imprint/ImprintPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OpenDataPage } from './pages/openData/OpenDataPage';
import { PrivacyPage } from './pages/privacy/PrivacyPage';

// MapLibre makes up most of the bundle, so it is only loaded along with the map.
const MapPage = lazy(() => import('./pages/MapPage').then((module) => ({ default: module.MapPage })));

export function App() {
  const { pathname } = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const routeName = (Object.keys(routes) as RouteName[]).find((name) => routes[name] === pathname);
    document.title = routeName ? `${t.pageTitles[routeName]} – ParkAPI` : 'ParkAPI';
  }, [pathname, t]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route
        path={routes.map}
        element={
          <Suspense fallback={null}>
            <MapPage />
          </Suspense>
        }
      />
      <Route path={routes.about} element={<AboutPage />} />
      <Route path={routes.openData} element={<OpenDataPage />} />
      <Route path={routes.imprint} element={<ImprintPage />} />
      <Route path={routes.privacy} element={<PrivacyPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
