import { ContentLayout } from '../../components/ContentLayout';
import { Localized } from '../../i18n/LanguageContext';
import { PrivacyDe } from './PrivacyDe';
import { PrivacyEn } from './PrivacyEn';

export function PrivacyPage() {
  return (
    <ContentLayout>
      <Localized de={<PrivacyDe />} en={<PrivacyEn />} />
    </ContentLayout>
  );
}
