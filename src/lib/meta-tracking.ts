const FBC_COOKIE = '_fbc';
const FBP_COOKIE = '_fbp';
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : '';
}

function setCookie(name: string, value: string, maxAgeMs: number) {
  const expires = new Date(Date.now() + maxAgeMs).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function captureFbclid() {
  try {
    const params = new URLSearchParams(window.location.search);
    const fbclid = params.get('fbclid');
    if (fbclid) {
      const fbc = `fb.1.${Date.now()}.${fbclid}`;
      setCookie(FBC_COOKIE, fbc, NINETY_DAYS_MS);
    }
  } catch (_) {
    // Never block page load
  }
}

export function getFbp(): string {
  return getCookie(FBP_COOKIE);
}

export function getFbc(): string {
  return getCookie(FBC_COOKIE);
}
