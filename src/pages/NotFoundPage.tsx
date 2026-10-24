import { Link } from 'react-router-dom';

import { ContentLayout } from '../components/ContentLayout';
import { useLanguage } from '../i18n/LanguageContext';
import { routes } from '../i18n/routes';

export function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <ContentLayout>
      <h1>{t.notFound.title}</h1>
      <p>
        {t.notFound.text} <Link to={routes.map}>{t.notFound.link}</Link>.
      </p>
    </ContentLayout>
  );
}
