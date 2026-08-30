import LegalLayout from '../layout/LegalLayout';
import { COMMUNITY_MEDIA_POLICY } from '../config/community';

export default function RulesPage() {
  const rules = [
    ['Maintain Privacy', 'Do not share personal information of others without their explicit consent. This includes photos, real names, and contact details.'],
    ['No Impersonation', 'Impersonating other users, celebrities, or public figures is strictly prohibited. Be yourself and respect everyone’s identity.'],
    ['Keep Content Appropriate', 'Post content suitable for all audiences. Avoid explicit, graphic, or violent content unless clearly marked and compliant with guidelines.'],
    ['Respect Copyrights', 'Do not post or share copyrighted material without permission from the copyright holder.'],
    ['No Hate Speech', 'Speech that promotes or incites harm against protected groups is forbidden and will result in a ban.'],
    ['Respect Everyone’s Time', 'Do not tag or mention users excessively and unnecessarily. Be considerate of notifications and online space.'],
    ['Constructive Conversations', 'Engage in constructive discussions. Avoid propagating fake news or misinformation.'],
    ['No Advertisements or Spam', 'Commercial ads are not allowed without prior staff approval, including unsolicited promotions or repetitive messages.'],
    ['Accountability for Content', 'You are responsible for the content you publish. Inappropriate content may be removed and can lead to suspension.'],
    ['Follow Platform Updates', 'Stay informed about updates to community rules and features. Compliance with new rules is expected.'],
    ['Community Per-File Limit', `Keep each upload (image, video, or document) to ${COMMUNITY_MEDIA_POLICY.perFile.megabytes} MB or less. Backend technical limits may be higher for operations or compatibility, but that ceiling is not an advertised user entitlement or permission to bypass this community rule.`],
    ['CSAM Enforcement', 'CK Conflux uses available service and provider controls, including Cloudflare where applicable, to detect CSAM in content those controls can inspect. End-to-end encrypted Matrix media may be stored only as ciphertext and is not necessarily available to server-side scanning. Identified CSAM triggers immediate termination and legal reporting.'],
  ];

  return (
    <LegalLayout title="Server Rules" lastUpdated="August 30, 2026">
      <p>These rules apply across CK Conflux community services and are enforced alongside our Terms of Use.</p>
      <div className="grid gap-3">
        {rules.map(([title, body], index) => (
          <article key={title} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold text-white">{index + 1}. {title}</h2>
            <p className="mt-2 text-slate-300">{body}</p>
          </article>
        ))}
      </div>
    </LegalLayout>
  );
}
