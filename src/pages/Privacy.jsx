import LegalLayout from '../layout/LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="Mar 16, 2025">
      <p>
        This Privacy Policy describes how masto.colonelkrud.com (&quot;masto.colonelkrud.com&quot;, &quot;we&quot;, &quot;us&quot;) collects, protects, and uses the personally identifiable information you may provide through the masto.colonelkrud.com website or its API. This policy also outlines your rights and choices regarding your personal data.
      </p>
      <p>This policy applies to all users accessing the service from the United States. It does not apply to third-party services we do not control.</p>

      <section>
        <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
        <h3 className="mt-3 text-lg font-semibold text-white">Basic Account Information</h3>
        <ul className="mt-2 list-disc pl-5">
          <li>Username</li>
          <li>Email address</li>
          <li>Password (hashed and not stored in plain text)</li>
          <li>Additional optional profile information (display name, biography, profile picture, header image)</li>
        </ul>
        <p className="mt-2">Your username, display name, biography, and profile picture are always public.</p>

        <h3 className="mt-3 text-lg font-semibold text-white">Public Content</h3>
        <ul className="mt-2 list-disc pl-5">
          <li>Your posts (text, media attachments)</li>
          <li>Lists of followers and people you follow</li>
          <li>The date, time, and client application used to submit messages</li>
        </ul>
        <p className="mt-2">Public and unlisted posts are publicly accessible. Featured posts are also visible to the public.</p>

        <h3 className="mt-3 text-lg font-semibold text-white">Private &amp; Restricted Content</h3>
        <p className="mt-2">Followers-only posts are shared with your followers and mentioned users. Direct messages are sent only to mentioned users.</p>
        <p className="mt-2">Important: Due to the decentralized nature of the platform, some posts may be stored on other servers. Other server operators and users may have access to your posts, screenshots, or logs.</p>

        <h3 className="mt-3 text-lg font-semibold text-white">Metadata &amp; Logging</h3>
        <ul className="mt-2 list-disc pl-5">
          <li>Your IP address upon login (stored for up to 12 months)</li>
          <li>User-agent (browser application details)</li>
          <li>Server logs (IP addresses of requests retained for up to 90 days)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Provide core functionality, such as message delivery and user interactions</li>
          <li>Maintain security and prevent abuse (e.g., ban evasion detection)</li>
          <li>Send account-related notifications and respond to inquiries</li>
        </ul>
        <p className="mt-2">We never sell or trade your personal data.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">3. How We Protect Your Data</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Encryption: All traffic is secured with SSL/TLS.</li>
          <li>Password Protection: Passwords are hashed using a secure one-way algorithm.</li>
          <li>Two-Factor Authentication: Available for additional account security.</li>
        </ul>
        <p className="mt-2">In case of a data breach, we will notify affected users as required by law.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">4. Data Retention Policy</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Server logs containing IP addresses are retained for up to 90 days.</li>
          <li>Registered users&apos; latest IP addresses are stored for up to 12 months.</li>
          <li>You can request an archive of your data, including posts and media.</li>
          <li>You may permanently delete your account at any time.</li>
        </ul>
        <p className="mt-2">Once deleted, your account cannot be restored. Some content shared with other servers may persist.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">5. Use of Cookies</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Recognize logged-in sessions</li>
          <li>Save user preferences for future visits</li>
        </ul>
        <p className="mt-2">You can disable cookies in your browser settings, but some features may not function properly.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">6. Sharing of Data</h2>
        <p>We do not sell or share personally identifiable information except in the following cases:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>With trusted third-party service providers who assist in maintaining and securing the platform (under strict confidentiality agreements)</li>
          <li>When required to comply with legal obligations (court orders, law enforcement requests)</li>
          <li>To protect the rights, property, or safety of masto.colonelkrud.com, its users, or the public</li>
        </ul>
        <p className="mt-2">Public posts and some user interactions (such as follows and favorites) may be shared with other servers as part of the decentralized network.</p>
        <h3 className="mt-3 text-lg font-semibold text-white">Third-Party Applications</h3>
        <p className="mt-2">When you authorize an application to use your account, it may access your public profile information, follower/following lists, posts, and favorites. Applications cannot access your email address or password.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">7. Children&apos;s Privacy</h2>
        <p>Per COPPA (Children&apos;s Online Privacy Protection Act), this service is not intended for users under 18 years old. If you are under 18, do not use this service.</p>
        <p className="mt-2">If we learn that a user under 18 has provided personal information, we will take immediate steps to delete their account and data.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">8. Your Rights &amp; Choices</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>Access &amp; Download Your Data: Request a copy of your stored information.</li>
          <li>Correct Your Information: Edit your profile at any time.</li>
          <li>Delete Your Account: Remove all associated data permanently.</li>
        </ul>
        <p className="mt-2">For inquiries regarding data access or deletion, contact admin@colonelkrud.com.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">9. Changes to This Policy</h2>
        <p>We may update this Privacy Policy periodically. Any significant changes will be communicated via email or platform announcements.</p>
        <p className="mt-2">Your continued use of masto.colonelkrud.com constitutes acceptance of the revised policy.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">10. Contact Information</h2>
        <p>Email: admin@colonelkrud.com</p>
        <p>Website: masto.colonelkrud.com</p>
      </section>
    </LegalLayout>
  );
}

