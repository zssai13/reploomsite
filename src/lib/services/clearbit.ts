// Clearbit Logo API integration
// Free API - no auth required
// https://clearbit.com/logo

// Known domains that have logos
const VERIFIED_DOMAINS = new Set([
  'tonyrobbins.com',
  'acquisition.com',
  'frankkern.com',
  'grantcardone.com',
  'jayshetty.me',
  'deangraziosi.com',
  'impacttheory.com',
  'skool.com',
  'danhenry.com',
  'trafficandfunnels.com',
  'kinobody.com',
  'legionathletics.com',
  'tanbooks.com',
  'ladyboss.com',
  'beautifulearthboutique.com',
  'clickfunnels.com',
  'whop.com',
  'iclosed.io',
  'playboy.com',
  'smartercontact.com',
  'simplertrading.com',
  'eightsleep.com',
  'sultanofstyle.com',
  'regenalight.com',
  'milky-mama.com',
  'hyros.com',
  'dapta.ai',
  'bettervideoad.com',
  'thedouglasjames.com',
]);

/**
 * Get a company logo URL from Clearbit
 * @param domain - Company domain (e.g., "tonyrobbins.com")
 * @returns Logo URL or null if not found
 */
export async function getClearbitLogo(domain: string): Promise<string | null> {
  if (!domain) return null;

  // Clean the domain
  const cleanDomain = domain
    .toLowerCase()
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/\/.*$/, '')
    .trim();

  if (!cleanDomain) return null;

  const logoUrl = `https://logo.clearbit.com/${cleanDomain}`;

  // For known verified domains, return URL directly
  if (VERIFIED_DOMAINS.has(cleanDomain)) {
    return logoUrl;
  }

  // For other domains, try a HEAD request but don't fail if it doesn't work
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(logoUrl, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return logoUrl;
    }

    // If logo not found (404), return null
    return null;
  } catch {
    // Network error - return null to avoid broken images in UI
    return null;
  }
}

/**
 * Get logos for multiple domains in parallel
 * @param domains - Array of company domains
 * @returns Map of domain to logo URL
 */
export async function getClearbitLogos(
  domains: string[]
): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();

  // Batch requests to avoid overwhelming the API
  const batchSize = 10;
  const batches: string[][] = [];

  for (let i = 0; i < domains.length; i += batchSize) {
    batches.push(domains.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    const promises = batch.map(async (domain) => {
      const logo = await getClearbitLogo(domain);
      results.set(domain, logo);
    });

    await Promise.all(promises);

    // Small delay between batches to be nice to the API
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * Extract domain from various URL formats
 * @param urlOrDomain - URL or domain string
 * @returns Clean domain
 */
export function extractDomain(urlOrDomain: string): string {
  if (!urlOrDomain) return '';

  return urlOrDomain
    .toLowerCase()
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/\/.*$/, '')
    .trim();
}

export default getClearbitLogo;
