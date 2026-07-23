/**
 * LiteTrack Worker — Utility Functions
 *
 * Lightweight, zero-dependency utility functions for event enrichment.
 * These run on every request so they must be fast and allocation-light.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ParsedUserAgent {
  browser: string;
  browser_version?: string;
  os: string;
  os_version?: string;
  device: 'mobile' | 'tablet' | 'desktop';
  device_brand?: string;
  device_model?: string;
}

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export function parseUserAgent(ua: string): ParsedUserAgent {
  const uaLower = ua.toLowerCase();

  let browser = 'Unknown';
  let browser_version: string | undefined;
  
  // Basic version extraction regex
  const extractVersion = (regex: RegExp) => {
    const match = ua.match(regex);
    return match ? match[1].split(/[._]/).slice(0, 2).join('.') : undefined;
  };

  if (uaLower.includes('edg/') || uaLower.includes('edge/')) {
    browser = 'Edge';
    browser_version = extractVersion(/(?:edg|edge)\/(\d+(\.\d+)?)/i);
  } else if (uaLower.includes('opr/') || uaLower.includes('opera')) {
    browser = 'Opera';
    browser_version = extractVersion(/(?:opr|opera|version)\/(\d+(\.\d+)?)/i);
  } else if (uaLower.includes('brave')) {
    browser = 'Brave';
  } else if (uaLower.includes('firefox') || uaLower.includes('fxios')) {
    browser = 'Firefox';
    browser_version = extractVersion(/(?:firefox|fxios)\/(\d+(\.\d+)?)/i);
  } else if (uaLower.includes('crios')) {
    browser = 'Chrome';
    browser_version = extractVersion(/crios\/(\d+(\.\d+)?)/i);
  } else if (uaLower.includes('chrome') && !uaLower.includes('chromium')) {
    browser = 'Chrome';
    browser_version = extractVersion(/chrome\/(\d+(\.\d+)?)/i);
  } else if (uaLower.includes('safari') && !uaLower.includes('chrome')) {
    browser = 'Safari';
    browser_version = extractVersion(/version\/(\d+(\.\d+)?)/i);
  }

  let os = 'Unknown';
  let os_version: string | undefined;

  if (uaLower.includes('iphone') || uaLower.includes('ipad') || uaLower.includes('ipod')) {
    os = 'iOS';
    os_version = extractVersion(/os (\d+([._]\d+)?)/i)?.replace('_', '.');
  } else if (uaLower.includes('mac os') || uaLower.includes('macintosh')) {
    os = 'macOS';
    os_version = extractVersion(/mac os x (\d+([._]\d+)?)/i)?.replace('_', '.');
  } else if (uaLower.includes('android')) {
    os = 'Android';
    os_version = extractVersion(/android (\d+(\.\d+)?)/i);
  } else if (uaLower.includes('windows')) {
    os = 'Windows';
    os_version = extractVersion(/windows nt (\d+(\.\d+)?)/i);
    // map NT 10.0 to Windows 10/11
    if (os_version === '10.0') os_version = '10/11';
  }

  let device: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  let device_brand: string | undefined;
  let device_model: string | undefined;

  if (uaLower.includes('tablet') || uaLower.includes('ipad')) {
    device = 'tablet';
    if (uaLower.includes('ipad')) {
      device_brand = 'Apple';
      device_model = 'iPad';
    }
  } else if (uaLower.includes('mobile') || uaLower.includes('iphone') || (uaLower.includes('android') && !uaLower.includes('tablet'))) {
    device = 'mobile';
    if (uaLower.includes('iphone')) {
      device_brand = 'Apple';
      device_model = 'iPhone';
    } else if (uaLower.includes('samsung') || uaLower.includes('sm-')) {
      device_brand = 'Samsung';
    } else if (uaLower.includes('pixel')) {
      device_brand = 'Google';
    }
  } else if (os === 'macOS') {
    device_brand = 'Apple';
    device_model = 'Mac';
  }

  return { browser, browser_version, os, os_version, device, device_brand, device_model };
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
import * as crypto from 'crypto';

export async function hashVisitorId(ip: string, ua: string, salt: string): Promise<string> {
  const data = `${ip}|${ua}|${salt}`;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return hash.slice(0, 16);
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
