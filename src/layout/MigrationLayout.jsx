import CampaignLayout from './CampaignLayout';

export default function MigrationLayout({ children }) {
  return <CampaignLayout label="Migration guide" footerNavLabel="Migration page links">{children}</CampaignLayout>;
}
