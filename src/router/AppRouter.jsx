import { useEffect } from 'react';
import Metadata from '../metadata/Metadata';
import SiteLayout from '../layout/SiteLayout';
import Home from '../pages/Home';
import Help from '../pages/Help';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import Rules from '../pages/Rules';
import PlannedPage from '../pages/PlannedPage';
import NotFound from '../pages/NotFound';
import { useRouter } from './Router';

const plannedRoutes = {
  '/why-ck-conflux': ['About CK Conflux', 'Why CK Conflux', 'A community-run home for private conversations, built on open standards without platform lock-in.'],
  '/matrix': ['Messaging', 'Matrix at CK Conflux', 'An open, federated foundation for rooms, direct messages, and community spaces.'],
  '/calls': ['Voice and video', 'Calls at CK Conflux', 'Secure voice and video conversations integrated with your Matrix rooms.'],
  '/membership': ['Community', 'Membership', 'Membership information and onboarding details will be expanded in a focused follow-up.'],
  '/security': ['Trust', 'Security', 'An overview of the practices used to protect CK Conflux accounts and services.'],
  '/status': ['Availability', 'Service status', 'View current service availability and incident updates.', {label:'Open status page',to:'https://status.colonelkrud.com',external:true}],
  '/support': ['Contribute', 'Support CK Conflux', 'Ways to help sustain community infrastructure will be detailed here.'],
  '/teamspeak': ['Optional voice service', 'TeamSpeak', 'Connect to the optional TeamSpeak server at ts6.ckconflux.com.', {label:'Connect to TeamSpeak',to:'ts3server://ts6.ckconflux.com',external:true}],
};
const routes = {'/': <Home />, '/help': <Help />, '/privacy': <Privacy />, '/terms': <Terms />, '/rules': <Rules />};

export default function AppRouter() {
  const { pathname } = useRouter();
  const planned = plannedRoutes[pathname];
  const page = routes[pathname] ?? (planned ? <PlannedPage eyebrow={planned[0]} title={planned[1]} description={planned[2]} action={planned[3]} /> : <NotFound />);
  useEffect(() => {
    const heading = document.querySelector('#main-content h1');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus(); }
  }, [pathname]);
  return <><Metadata pathname={pathname} /><SiteLayout>{page}</SiteLayout></>;
}
