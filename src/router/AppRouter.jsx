import { useEffect } from 'react';
import Metadata from '../metadata/Metadata';
import SiteLayout from '../layout/SiteLayout';
import Home from '../pages/Home';
import Help from '../pages/Help';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import Rules from '../pages/Rules';
import Status from '../pages/Status';
import NotFound from '../pages/NotFound';
import Matrix from '../pages/Matrix';
import Calls from '../pages/Calls';
import TeamSpeak from '../pages/TeamSpeak';
import WhyCKConflux from '../pages/WhyCKConflux';
import Security from '../pages/Security';
import Support from '../pages/Support';
import Membership from '../pages/Membership';
import { useRouter } from './Router';

const routes = {'/': <Home />, '/why-ck-conflux': <WhyCKConflux />, '/matrix': <Matrix />, '/calls': <Calls />, '/membership': <Membership />, '/teamspeak': <TeamSpeak />, '/security': <Security />, '/help': <Help />, '/support': <Support />, '/status': <Status />, '/privacy': <Privacy />, '/terms': <Terms />, '/rules': <Rules />};

export default function AppRouter() {
  const { pathname, navigationKey } = useRouter();
  const page = routes[pathname] ?? <NotFound />;
  useEffect(() => {
    if (navigationKey === 0) return;
    const heading = document.querySelector('#main-content h1');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus(); }
  }, [navigationKey]);
  return <><Metadata pathname={pathname} /><SiteLayout>{page}</SiteLayout></>;
}
