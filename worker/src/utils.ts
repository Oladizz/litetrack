/**
 * LiteTrack Worker — Utility Functions
 *
 * Lightweight, zero-dependency utility functions for event enrichment.
 * These run on every request so they must be fast and allocation-light.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ParsedUserAgent {
  /** Browser name (e.g., "Chrome", "Firefox", "Safari") */
  browser: string;
  /** Operating system (e.g., "Windows", "macOS", "Android") */
  os: string;
  /** Device type: "mobile", "tablet", or "desktop" */
  device: 'mobile' | 'tablet' | 'desktop';
}

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

// ─── parseUserAgent ──────────────────────────────────────────────────────────
/**
 * Lightweight User-Agent parser.
 *
 * Extracts browser name, OS, and device type from a User-Agent string
 * using simple string matching. Covers ~95% of real-world traffic without
 * the weight of a full UA parsing library (~50KB+ gzipped).
 *
 * Order matters — more specific checks come before generic ones.
 *
 * @param ua - Raw User-Agent header string
 * @returns Parsed browser, OS, and device type
 */
export function parseUserAgent(ua: string): ParsedUserAgent {
  const uaLower = ua.toLowerCase();

  // ── Browser Detection ────────────────────────────────────────────────────
  // Order: specific → generic (Edge before Chrome, Chrome before Safari, etc.)
  let browser = 'Unknown';
  if (uaLower.includes('edg/') || uaLower.includes('edge/')) {
    browser = 'Edge';
  } else if (uaLower.includes('opr/') || uaLower.includes('opera')) {
    browser = 'Opera';
  } else if (uaLower.includes('brave')) {
    browser = 'Brave';
  } else if (uaLower.includes('vivaldi')) {
    browser = 'Vivaldi';
  } else if (uaLower.includes('samsung')) {
    browser = 'Samsung Internet';
  } else if (uaLower.includes('ucbrowser')) {
    browser = 'UC Browser';
  } else if (uaLower.includes('firefox') || uaLower.includes('fxios')) {
    browser = 'Firefox';
  } else if (uaLower.includes('crios')) {
    // Chrome on iOS reports as "CriOS"
    browser = 'Chrome';
  } else if (uaLower.includes('chrome') && !uaLower.includes('chromium')) {
    browser = 'Chrome';
  } else if (uaLower.includes('chromium')) {
    browser = 'Chromium';
  } else if (uaLower.includes('safari') && !uaLower.includes('chrome')) {
    browser = 'Safari';
  } else if (uaLower.includes('msie') || uaLower.includes('trident')) {
    browser = 'IE';
  }

  // ── OS Detection ─────────────────────────────────────────────────────────
  let os = 'Unknown';
  if (uaLower.includes('iphone') || uaLower.includes('ipad') || uaLower.includes('ipod')) {
    os = 'iOS';
  } else if (uaLower.includes('mac os') || uaLower.includes('macintosh')) {
    os = 'macOS';
  } else if (uaLower.includes('android')) {
    os = 'Android';
  } else if (uaLower.includes('cros')) {
    os = 'ChromeOS';
  } else if (uaLower.includes('linux')) {
    os = 'Linux';
  } else if (uaLower.includes('windows')) {
    os = 'Windows';
  }

  // ── Device Type Detection ────────────────────────────────────────────────
  // Tablets often include "tablet" or "ipad" in the UA.
  // Mobile devices include "mobile", "iphone", "android" (without "tablet").
  let device: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (uaLower.includes('tablet') || uaLower.includes('ipad')) {
    device = 'tablet';
  } else if (
    uaLower.includes('mobile') ||
    uaLower.includes('iphone') ||
    uaLower.includes('ipod') ||
    (uaLower.includes('android') && !uaLower.includes('tablet'))
  ) {
    device = 'mobile';
  }

  return { browser, os, device };
}

// ─── parseReferrerSource ─────────────────────────────────────────────────────
/**
 * Extracts a human-readable traffic source name from a referrer URL.
 *
 * Maps known domains to friendly source names (e.g., "google.com" → "Google").
 * For unknown referrers, returns the hostname as-is.
 * Returns "direct" for empty/missing referrers.
 *
 * @param referrer - The document.referrer value (full URL or empty string)
 * @returns Traffic source name
 */
export function parseReferrerSource(referrer: string | null | undefined): string {
  if (!referrer) return 'direct';

  let hostname: string;
  try {
    hostname = new URL(referrer).hostname.toLowerCase();
  } catch {
    return 'direct';
  }

  // Known source mappings — check if the hostname contains the key domain
  const sources: Record<string, string> = {
    'google.': 'Google',
    'bing.': 'Bing',
    'yahoo.': 'Yahoo',
    'duckduckgo.': 'DuckDuckGo',
    'baidu.': 'Baidu',
    'yandex.': 'Yandex',
    'ecosia.': 'Ecosia',
    't.co': 'Twitter/X',
    'twitter.com': 'Twitter/X',
    'x.com': 'Twitter/X',
    'facebook.com': 'Facebook',
    'fb.com': 'Facebook',
    'l.facebook.com': 'Facebook',
    'instagram.com': 'Instagram',
    'linkedin.com': 'LinkedIn',
    'lnkd.in': 'LinkedIn',
    'reddit.com': 'Reddit',
    'youtube.com': 'YouTube',
    'youtu.be': 'YouTube',
    'pinterest.com': 'Pinterest',
    'tiktok.com': 'TikTok',
    'snapchat.com': 'Snapchat',
    'threads.net': 'Threads',
    'mastodon.': 'Mastodon',
    'github.com': 'GitHub',
    'stackoverflow.com': 'StackOverflow',
    'news.ycombinator.com': 'Hacker News',
    'producthunt.com': 'Product Hunt',
    'medium.com': 'Medium',
    'substack.com': 'Substack',
    'slack.com': 'Slack',
    'discord.com': 'Discord',
    'telegram.org': 'Telegram',
    'whatsapp.com': 'WhatsApp',
  };

  for (const [domain, name] of Object.entries(sources)) {
    if (hostname.includes(domain)) {
      return name;
    }
  }

  // Unknown referrer — return the raw hostname
  return hostname;
}

// ─── hashVisitorId ───────────────────────────────────────────────────────────
/**
 * Generates a privacy-safe visitor hash for server-side deduplication.
 *
 * Combines the visitor's IP address, User-Agent, and a daily-rotating salt
 * to produce a hash that:
 * - Cannot be reversed to reveal PII
 * - Rotates daily (when salt includes the date)
 * - Is consistent within a single day for the same visitor
 *
 * Uses the Web Crypto API (SubtleCrypto) for SHA-256 hashing,
 * which is available in Cloudflare Workers.
 *
 * @param ip - Client IP address (from CF-Connecting-IP header)
 * @param ua - User-Agent header string
 * @param salt - Daily salt (e.g., the current date string)
 * @returns Hex-encoded SHA-256 hash (first 16 chars for compactness)
 */
export async function hashVisitorId(ip: string, ua: string, salt: string): Promise<string> {
  const data = `${ip}|${ua}|${salt}`;
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // Return first 16 hex chars — enough entropy to avoid collisions for analytics
  return hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}

// ─── extractUtmParams ────────────────────────────────────────────────────────
/**
 * Extracts UTM parameters from a URL string.
 *
 * Parses the standard UTM parameters used for marketing attribution:
 * - utm_source, utm_medium, utm_campaign, utm_term, utm_content
 *
 * Only includes parameters that are present and non-empty.
 *
 * @param url - Full URL string to parse
 * @returns Object containing found UTM parameters
 */
export function extractUtmParams(url: string): UtmParams {
  const params: UtmParams = {};

  try {
    const searchParams = new URL(url).searchParams;
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

    for (const key of utmKeys) {
      const value = searchParams.get(key);
      if (value) {
        params[key] = value;
      }
    }
  } catch {
    // Invalid URL — return empty params
  }

  return params;
}
