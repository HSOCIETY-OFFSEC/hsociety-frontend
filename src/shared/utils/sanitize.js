/**
 * XSS prevention for user-generated HTML
 * SECURITY UPDATE IMPLEMENTED: Use DOMPurify for community posts, messages
 */
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML string for safe display (e.g. community message content).
 * Use ALLOWED_TAGS: [] for text-only, or allow safe tags like b, i, a.
 */
export function sanitizeHtml(html, options = {}) {
  if (html == null || typeof html !== 'string') return '';
  const defaultOptions = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ADD_ATTR: ['target'],
  };
  return DOMPurify.sanitize(html, { ...defaultOptions, ...options });
}

/**
 * Text-only: strip all HTML tags.
 */
export function sanitizeText(html) {
  if (html == null || typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
}

export default { sanitizeHtml, sanitizeText };
