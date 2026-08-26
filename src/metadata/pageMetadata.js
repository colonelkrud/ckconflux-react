export const SITE_URL = 'https://ckconflux.com';
const summary = 'Private, community-run communication with Matrix, Element, and secure calls.';
const descriptions = {
  '/': summary,
  '/why-ck-conflux': 'Learn why CK Conflux offers community communication without platform lock-in.',
  '/matrix': 'Understand Matrix, CK Conflux, Element, federation, rooms, Spaces, and your Matrix ID.',
  '/calls': 'Use Element Call for Matrix-integrated voice, video, and screen sharing powered by MatrixRTC.',
  '/membership': 'Learn how CK Conflux membership works.',
  '/security': 'Learn about Matrix encryption, secure backup, recovery keys, device verification, and federation boundaries.',
  '/privacy': 'Understand the CK Conflux-wide privacy model and service-specific data practices.',
  '/status': 'Find CK Conflux service status information.',
  '/help': 'Find CK Conflux onboarding guidance, frequently asked questions, and support resources.',
  '/support': 'Find the right CK Conflux route for learning, accounts, recovery, moderation, privacy, outages, or membership.',
  '/teamspeak': 'Connect to the optional CK Conflux TeamSpeak 6 Beta service and understand its limitations.',
  '/terms': 'Read the CK Conflux terms of use.',
  '/rules': 'Read the CK Conflux community server rules.',
};
const labels = {'/':'Home','/why-ck-conflux':'Why CK Conflux','/matrix':'Matrix and Element','/calls':'Element Call','/membership':'Membership','/security':'Security','/privacy':'Privacy Policy','/status':'Status','/help':'Help','/support':'Support','/teamspeak':'TeamSpeak 6 Beta','/terms':'Terms of Use','/rules':'Server Rules'};

export const ROUTE_PATHS = Object.freeze(Object.keys(labels));

export function getPageMetadata(pathname) {
  const known = Object.hasOwn(labels, pathname);
  const title = known && pathname === '/' ? 'CK Conflux' : `${known ? labels[pathname] : 'Page Not Found'} | CK Conflux`;
  return {
    title,
    description: known ? descriptions[pathname] : 'The requested CK Conflux page could not be found.',
    url: `${SITE_URL}${pathname}`,
    known,
  };
}
