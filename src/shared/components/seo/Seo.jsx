import { useEffect } from 'react';
import { BRAND, DEFAULT_OG_IMAGE, SITE_URL } from '../../../config/app/brand.config';
import { getSocialLinks } from '../../../config/app/social.config';
import {
  buildAudienceSchemas,
  buildCourseSchema,
  buildOrganizationSchema,
  buildWebsiteSchema,
} from '../../../config/app/seo.config';

const getTwitterHandle = (links) => {
  const xLink = links.find((link) => link.key === 'x' || /x\.com|twitter\.com/.test(link.href || ''));
  if (!xLink?.href) return '';
  const match = xLink.href.match(/(?:x|twitter)\.com\/([^/?#]+)/i);
  return match?.[1] ? `@${match[1]}` : '';
};

const ensureMetaTag = ({ name, property }, content) => {
  if (typeof document === 'undefined') return;
  const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    if (name) tag.setAttribute('name', name);
    if (property) tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  if (content !== undefined) {
    tag.setAttribute('content', content);
  }
};

const ensureLinkTag = (rel, href) => {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const upsertJsonLd = (payload) => {
  if (typeof document === 'undefined') return;
  const id = 'seo-schema';
  let script = document.head.querySelector(`script#${id}`);
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', id);
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
};

const Seo = ({
  title,
  description,
  keywords,
  canonicalUrl,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  schemaFlags = [],
}) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const socialLinks = getSocialLinks();
    const socialUrls = socialLinks.map((link) => link.href).filter(Boolean);
    const twitterHandle = getTwitterHandle(socialLinks);
    const ogImage = image || DEFAULT_OG_IMAGE;
    const resolvedCanonical = canonicalUrl || SITE_URL;

    document.title = title || BRAND.publicName;
    ensureLinkTag('canonical', resolvedCanonical);

    ensureMetaTag({ name: 'description' }, description);
    ensureMetaTag({ name: 'keywords' }, keywords);
    ensureMetaTag({ name: 'author' }, BRAND.publicName);
    ensureMetaTag({ name: 'application-name' }, BRAND.publicName);
    ensureMetaTag({ name: 'robots' }, noindex ? 'noindex, nofollow' : 'index, follow');

    ensureMetaTag({ property: 'og:type' }, type);
    ensureMetaTag({ property: 'og:site_name' }, BRAND.publicName);
    ensureMetaTag({ property: 'og:title' }, title);
    ensureMetaTag({ property: 'og:description' }, description);
    ensureMetaTag({ property: 'og:url' }, resolvedCanonical);
    ensureMetaTag({ property: 'og:image' }, ogImage);
    ensureMetaTag({ property: 'og:image:alt' }, `${BRAND.publicName} logo`);
    ensureMetaTag({ property: 'og:locale' }, 'en_US');

    ensureMetaTag({ name: 'twitter:card' }, 'summary_large_image');
    ensureMetaTag({ name: 'twitter:title' }, title);
    ensureMetaTag({ name: 'twitter:description' }, description);
    ensureMetaTag({ name: 'twitter:image' }, ogImage);
    if (twitterHandle) {
      ensureMetaTag({ name: 'twitter:site' }, twitterHandle);
      ensureMetaTag({ name: 'twitter:creator' }, twitterHandle);
    }

    if (typeof document !== 'undefined') {
      document.head
        .querySelectorAll('meta[property="og:see_also"]')
        .forEach((node) => node.remove());
      socialUrls.forEach((url) => {
        ensureMetaTag({ property: 'og:see_also' }, url);
      });
    }

    const googleVerification =
      typeof import.meta !== 'undefined' && import.meta.env
        ? import.meta.env.VITE_GOOGLE_SITE_VERIFICATION
        : '';
    if (googleVerification) {
      ensureMetaTag({ name: 'google-site-verification' }, googleVerification);
    }

    const schema = [
      buildOrganizationSchema(socialUrls),
      buildWebsiteSchema(),
      ...buildAudienceSchemas(),
    ];

    if (schemaFlags.includes('courses') || schemaFlags.includes('course')) {
      schema.push(buildCourseSchema(socialUrls));
    }

    upsertJsonLd(schema);
  }, [title, description, keywords, canonicalUrl, image, type, noindex, schemaFlags]);

  return null;
};

export default Seo;
