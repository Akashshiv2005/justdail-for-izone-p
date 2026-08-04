import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  schemas?: any[];
}

/**
 * Dynamically injects SEO-critical elements into <head>.
 * This handles <title>, <meta name="description">, <link rel="canonical">,
 * Open Graph tags, and <script type="application/ld+json"> schemas.
 */
export default function SEOHead({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  schemas = [],
}: SEOHeadProps) {
  useEffect(() => {
    // Title
    if (title) {
      document.title = title;
    }

    // Helper to set or create a meta tag
    const setMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // Meta Description
    if (description) {
      setMeta('description', description);
    }

    // Open Graph
    if (ogTitle || title) setMeta('og:title', ogTitle || title, true);
    if (ogDescription || description) setMeta('og:description', ogDescription || description, true);
    if (ogImage) setMeta('og:image', ogImage, true);
    setMeta('og:type', 'website', true);

    // Canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.rel = 'canonical';
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.href = `${window.location.origin}${canonical}`;
    }

    // JSON-LD Schemas — remove previous ones and inject new
    document.querySelectorAll('script[data-seo-schema]').forEach(el => el.remove());
    schemas.forEach((schema, idx) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-schema', `schema-${idx}`);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Cleanup on unmount
    return () => {
      document.querySelectorAll('script[data-seo-schema]').forEach(el => el.remove());
    };
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, schemas]);

  // This component renders nothing visible
  return null;
}
