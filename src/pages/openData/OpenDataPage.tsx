import { ContentLayout } from '../../components/ContentLayout';
import { Localized } from '../../i18n/LanguageContext';
import { OpenDataDe } from './OpenDataDe';
import { OpenDataEn } from './OpenDataEn';

export function OpenDataPage() {
  return (
    <ContentLayout>
      <Localized de={<OpenDataDe />} en={<OpenDataEn />} />
    </ContentLayout>
  );
}
