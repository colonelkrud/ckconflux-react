import LegalLayout from '../layout/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="CK Conflux Terms of Use" lastUpdated="May 9, 2026">
      <p>By accessing CK Conflux services—including Element at element.ckconflux.com, Matrix homeserver services at ckconflux.com (Synapse), Mastodon at masto.colonelkrud.com, and related community services—you explicitly agree to these Terms and our legal policies. We may modify these terms at any time and may suspend or discontinue services at our discretion without prior notice.</p>

      <section>
        <h2 className="text-xl font-semibold text-white">User Eligibility &amp; Responsibilities</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Users must be at least 18 years old. Accounts violating this requirement will be terminated immediately.</li>
          <li>You must maintain confidentiality and security of login credentials and notify us immediately of unauthorized access.</li>
          <li>Content provided is informational only; seek professional advice for important decisions.</li>
          <li>You are responsible for your actions and contributions on CK Conflux.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Prohibited Uses</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Illegal, fraudulent, or deceptive practices.</li>
          <li>Child exploitation or harming minors in any way.</li>
          <li>Bullying, harassment, hate speech, discrimination, or intimidation.</li>
          <li>Distributing spam, unsolicited promotions, or advertisements.</li>
          <li>Uploading malware, viruses, or harmful software.</li>
          <li>Unauthorized system or network access, disruption, or attacks.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Interactive Services Disclaimer</h2>
        <p>CK Conflux provides interactive features like chats and forums. We do not actively moderate all user content and expressly disclaim responsibility for user-generated content. Moderation efforts in public or federated rooms are best-effort and not guaranteed.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Acceptable Use and Platform Integrity</h2>
        <p>
          CK Conflux permits lawful advocacy, journalism, education, lawful identity-based communities, civil rights advocacy,
          community support, protest participation, mutual aid, and lawful political expression. Enforcement is based on conduct,
          not identity, viewpoint, affiliation, or lawful political expression.
        </p>
        <p className="mt-2">You may not use CK Conflux to engage in any of the following:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Spam, unsolicited mass messaging, or bulk promotional distribution.</li>
          <li>Phishing, impersonation, fraud, scams, credential harvesting, or deceptive account activity.</li>
          <li>Malware, exploit delivery, malicious links, harmful files, or other attempts to compromise systems or users.</li>
          <li>Unauthorized access, credential stuffing, scanning, probing, penetration attempts, or other security attacks.</li>
          <li>DDoS, traffic flooding, API abuse, websocket abuse, or infrastructure disruption.</li>
          <li>Illegal or infringing content distribution, including unauthorized proprietary or copyrighted content.</li>
          <li>Automated abuse, fake account farming, bot misuse, rate-limit evasion, or ban evasion.</li>
          <li>Disproportionate or abusive use of platform storage, bandwidth, compute, CDN, media, or messaging resources.</li>
          <li>Coordinating, planning, threatening, or inciting violence.</li>
          <li>Recruiting for violent acts or criminal activity, or funding criminal conduct.</li>
          <li>Making credible threats, doxing, stalking, or targeting individuals for real-world harm.</li>
          <li>Distributing instructions intended to facilitate real-world harm, unauthorized access, or malicious activity.</li>
        </ul>
        <p className="mt-2">
          You may not use CK Conflux in any way that violates the acceptable use, abuse, security, or service-integrity
          requirements of our hosting, networking, security, payment, funding, or content delivery providers.
        </p>
        <p className="mt-2">
          CK Conflux may remove content, restrict features, apply rate limits, suspend, or terminate accounts immediately when
          necessary to protect users, infrastructure, service availability, payment or funding access, or upstream provider
          compliance.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Reporting Abuse and GDPR Requests</h2>
        <p>Report inappropriate content or GDPR requests via built-in reporting methods, by mentioning moderation bot @draupnir:ckconflux.com, or by emailing abuse@mg.colonelkrud.com.</p>
        <p className="mt-2">Content is typically reviewed and purged within 24 hours of reporting. GDPR data requests are delivered via your registered email. If your account is deleted before a GDPR request is fulfilled, your content may already have been permanently removed.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">User Privacy and Data Handling Practices</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Expect no privacy in public rooms; communications there are publicly accessible.</li>
          <li>Logs including IP addresses are retained for 30 days for performance, troubleshooting, and security.</li>
          <li>Private messages and calls use end-to-end encryption (e2ee) by default where supported.</li>
          <li>We use industry-standard encryption and security practices to protect user data.</li>
          <li>We comply with GDPR data removal requests upon written request.</li>
          <li>We comply fully with lawful law enforcement requests.</li>
          <li>Data retention is best-effort; no explicit guarantees are provided.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Third-Party and Federated Content</h2>
        <p>CK Conflux participates in Matrix federation, enabling interaction with third-party servers beyond our direct control. Federated content is the responsibility of originating servers, and CK Conflux disclaims liability for those interactions.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Payments, Funding, and Supporter Features</h2>
        <p>
          Memberships, donations, supporter features, and paid benefits may depend on third-party payment processors or
          funding platforms. Availability of these features is subject to those third-party services and may change due to
          their policies, compliance reviews, holds, restrictions, outages, or termination decisions.
        </p>
      </section>


      <section>
        <h2 className="text-xl font-semibold text-white">Suspension and Termination</h2>
        <p>CK Conflux may suspend or terminate accounts at its sole discretion without notice for violations of these Terms, abuse, legal noncompliance, or lawful requests. We enforce zero tolerance for severe or repeated content-standard violations.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Indemnification</h2>
        <p>You agree to indemnify and hold harmless CK Conflux and its operators from claims arising from:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Your violation of these Terms or applicable laws.</li>
          <li>Your misuse of CK Conflux services or related infrastructure.</li>
          <li>Unauthorized access or security breaches.</li>
          <li>Defamatory, illegal, or harmful content posted by you.</li>
          <li>Violations of provider acceptable use and security requirements.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">User Privacy and Expectations in Public Rooms</h2>
        <p>Public rooms are publicly visible and messages should not be considered private. Exercise caution when sharing personal information.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">No Guarantee of Uptime or Service Levels</h2>
        <p>CK Conflux services are provided without explicit or implicit uptime or performance guarantees. For transparency on disruptions and outages, see status.colonelkrud.com.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Governing Law and Dispute Resolution</h2>
        <p>These Terms are governed by laws of the United States and the Commonwealth of Virginia. Disputes will be resolved exclusively in courts located in Ashburn, Virginia. If any provision is invalid or unenforceable, the remaining provisions remain in full force and effect, and any invalidity applies only to the specific unenforceable circumstances.</p>
      </section>

    </LegalLayout>
  );
}

