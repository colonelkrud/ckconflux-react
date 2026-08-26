/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const RouterContext = createContext(null);

export function Router({ children }) {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const navigate = useCallback((to) => {
    if (to === window.location.pathname) return;
    window.history.pushState({}, '', to);
    setPathname(window.location.pathname);
  }, []);
  const value = useMemo(() => ({ pathname, navigate }), [navigate, pathname]);
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
