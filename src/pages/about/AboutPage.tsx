import { ContentLayout } from '../../components/ContentLayout';
import { Localized } from '../../i18n/LanguageContext';
import { AboutDe } from './AboutDe';
import { AboutEn } from './AboutEn';

export function AboutPage() {
  return (
    <ContentLayout>
      <Localized de={<AboutDe />} en={<AboutEn />} />
    </ContentLayout>
  );
}
