import { Link } from '../router/Router';

export function SiteLink({ to, children, ...props }) {
  return <Link to={to} {...props}>{children}</Link>;
}

export function ExternalLink({ href, children, ...props }) {
  return <a href={href} {...props}>{children}</a>;
}
