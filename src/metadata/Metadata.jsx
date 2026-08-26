import { useEffect } from 'react';
import { getPageMetadata } from './pageMetadata';

const upsertMeta = (selector, attribute, value, content) => {
  let element = document.head.querySelector(selector);
  if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, value); document.head.append(element); }
  element.setAttribute('content', content);
};
export default function Metadata({ pathname }) {
  useEffect(() => {
    const metadata = getPageMetadata(pathname);
    document.title = metadata.title;
    upsertMeta('meta[name="description"]', 'name', 'description', metadata.description);
    for (const property of ['og:title','og:description','og:url']) upsertMeta(`meta[property="${property}"]`, 'property', property, property === 'og:title' ? metadata.title : property === 'og:description' ? metadata.description : metadata.url);
    for (const name of ['twitter:title','twitter:description']) upsertMeta(`meta[name="${name}"]`, 'name', name, name.endsWith('title') ? metadata.title : metadata.description);
    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary');
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
    canonical.href = metadata.url;
  }, [pathname]);
  return null;
}
