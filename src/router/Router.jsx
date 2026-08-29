/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const RouterContext = createContext(null);

export function Router({ children }) {
  const [location, setLocation] = useState(() => ({ pathname: window.location.pathname, navigationKey: 0 }));
  useEffect(() => {
    const handlePopState = () => setLocation((current) => ({ pathname: window.location.pathname, navigationKey: current.navigationKey + 1 }));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const navigate = useCallback((to) => {
    const destination = new URL(to, window.location.origin);
    const current = window.location;
    if (destination.pathname === current.pathname && destination.search === current.search && destination.hash === current.hash) return;
    window.history.pushState({}, '', `${destination.pathname}${destination.search}${destination.hash}`);
    setLocation((current) => ({ pathname: window.location.pathname, navigationKey: current.navigationKey + 1 }));
  }, []);
  const value = useMemo(() => ({ pathname: location.pathname, navigationKey: location.navigationKey, navigate }), [location, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useRouter must be used within Router');
  return context;
}

export function Link({ to, onClick, children, ...props }) {
  const { navigate } = useRouter();
  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  };
  return <a href={to} onClick={handleClick} {...props}>{children}</a>;
}
