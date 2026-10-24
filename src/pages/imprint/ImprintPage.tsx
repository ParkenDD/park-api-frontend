import { ContentLayout } from '../../components/ContentLayout';
import { Localized } from '../../i18n/LanguageContext';
import { ImprintDe } from './ImprintDe';
import { ImprintEn } from './ImprintEn';

export function ImprintPage() {
  return (
    <ContentLayout>
      <Localized de={<ImprintDe />} en={<ImprintEn />} />
    </ContentLayout>
  );
}
