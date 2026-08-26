export const SITE_URL = 'https://ckconflux.com';
const summary = 'Private, community-run communication with Matrix, Element, and secure calls.';
const descriptions = {
  '/': summary,
  '/why-ck-conflux': 'Learn why CK Conflux offers community communication without platform lock-in.',
  '/matrix': 'Learn about Matrix messaging at CK Conflux.',
  '/calls': 'Learn about private voice and video calls at CK Conflux.',
  '/membership': 'Learn how CK Conflux membership works.',
  '/security': 'Read about security practices at CK Conflux.',
  '/privacy': 'Read the CK Conflux privacy policy.',
  '/status': 'Find CK Conflux service status information.',
  '/help': 'Find CK Conflux onboarding guidance, frequently asked questions, and support resources.',
  '/support': 'Find ways to support CK Conflux.',
  '/teamspeak': 'Find CK Conflux TeamSpeak connection information.',
  '/terms': 'Read the CK Conflux terms of use.',
  '/rules': 'Read the CK Conflux community server rules.',
};
const labels = {'/':'Home','/why-ck-conflux':'Why CK Conflux','/matrix':'Matrix','/calls':'Calls','/membership':'Membership','/security':'Security','/privacy':'Privacy Policy','/status':'Status','/help':'Help','/support':'Support','/teamspeak':'TeamSpeak','/terms':'Terms of Use','/rules':'Server Rules'};

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
