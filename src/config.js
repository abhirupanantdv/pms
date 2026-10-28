// ERPNext Connection Configuration & Authentication Helpers

/**
 * Safely resolves the Frappe CSRF token from multiple runtime sources.
 * Returns empty string if no valid token is available.
 */
export const getCsrfToken = () => {
  if (typeof window !== 'undefined') {
    // 1. Injected via pms.html or desk
    if (window.csrf_token && window.csrf_token !== 'None' && window.csrf_token !== 'null') {
      return String(window.csrf_token).trim();
    }
    // 2. Attached to global frappe object
    if (window.frappe?.csrf_token && window.frappe.csrf_token !== 'None' && window.frappe.csrf_token !== 'null') {
      return String(window.frappe.csrf_token).trim();
    }
    if (window.frappe?.session?.csrf_token && window.frappe.session.csrf_token !== 'None') {
      return String(window.frappe.session.csrf_token).trim();
    }
    // 3. Fallback to document cookie
    try {
      const match = document.cookie.match(/(?:^|;\s*)(?:csrf_token|XSRF-TOKEN|CSRF-TOKEN)=([^;]*)/i);
      if (match && match[1]) {
        const decoded = decodeURIComponent(match[1]).trim();
        if (decoded && decoded !== 'None' && decoded !== 'null') {
          return decoded;
        }
      }
    } catch { }
    // 4. Fallback to web storage
    try {
      const stored = localStorage.getItem('frappe_csrf_token') || sessionStorage.getItem('frappe_csrf_token') || localStorage.getItem('pms_csrf_token');
      if (stored && stored !== 'None' && stored !== 'null') {
        return stored.trim();
      }
    } catch { }
  }
  return '';
};

/**
 * Asynchronously ensures a valid CSRF token is available.
 * If missing or if forceRefresh is true, purges existing token and queries the server.
 */
export const ensureCsrfToken = async (forceRefresh = false) => {
  if (!forceRefresh) {
    let token = getCsrfToken();
    if (token) return token;
  }

  // If forceRefresh, clear cached/stale tokens
  if (typeof window !== 'undefined') {
    window.csrf_token = '';
    if (window.frappe) window.frappe.csrf_token = '';
    if (window.frappe?.session) window.frappe.session.csrf_token = '';
    try {
      localStorage.removeItem('frappe_csrf_token');
      sessionStorage.removeItem('frappe_csrf_token');
      localStorage.removeItem('pms_csrf_token');
    } catch { }
  }

  const baseUrl = getApiBaseUrl();
  let token = '';

  // 1. Try custom whitelisted endpoint in PMS
  try {
    const res = await fetch(`${baseUrl}/api/method/pms.utils.get_csrf_token`, { credentials: 'include' });
    if (res.ok) {
      const json = await res.json();
      const cand = json.message?.csrf_token || json.csrf_token;
      if (cand && cand !== 'None' && cand !== 'null') {
        token = String(cand).trim();
      }
    }
  } catch (err) { }

  // 2. Try standard Frappe bootinfo (whitelisted GET endpoint in all Frappe instances)
  if (!token) {
    try {
      const res = await fetch(`${baseUrl}/api/method/frappe.boot.get_bootinfo`, { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        const cand = json.message?.csrf_token;
        if (cand && cand !== 'None' && cand !== 'null') {
          token = String(cand).trim();
        }
      }
    } catch (err) { }
  }

  // 3. Try /pms which renders pms.html with window.csrf_token
  if (!token) {
    try {
      const res = await fetch(`${baseUrl}/pms`, { credentials: 'include' });
      if (res.ok) {
        const html = await res.text();
        const match = html.match(/window\.csrf_token\s*=\s*["']([^"']+)["']/i) ||
          html.match(/["']?csrf_token["']?\s*[:=]\s*["']([^"']+)["']/i);
        if (match && match[1] && match[1] !== 'None' && match[1] !== 'null') {
          token = match[1].trim();
        }
      }
    } catch (err) {
      console.warn('Failed fetching CSRF token from /pms:', err);
    }
  }

  // 4. Try /app which renders desk with csrf_token
  if (!token) {
    try {
      const resApp = await fetch(`${baseUrl}/app`, { credentials: 'include' });
      if (resApp.ok) {
        const htmlApp = await resApp.text();
        const matchApp = htmlApp.match(/csrf_token["']?\s*[:=]\s*["']([^"']+)["']/i) ||
          htmlApp.match(/window\.csrf_token\s*=\s*["']([^"']+)["']/i);
        if (matchApp && matchApp[1] && matchApp[1] !== 'None' && matchApp[1] !== 'null') {
          token = matchApp[1].trim();
        }
      }
    } catch (err) {
      console.warn('Failed fetching CSRF token from /app:', err);
    }
  }

  // 5. Try document.cookie
  if (!token && typeof document !== 'undefined') {
    try {
      const match = document.cookie.match(/(?:^|;\s*)(?:csrf_token|XSRF-TOKEN|CSRF-TOKEN)=([^;]*)/i);
      if (match && match[1]) {
        const decoded = decodeURIComponent(match[1]).trim();
        if (decoded && decoded !== 'None' && decoded !== 'null') {
          token = decoded;
        }
      }
    } catch { }
  }

  if (token && typeof window !== 'undefined') {
    window.csrf_token = token;
    if (window.frappe) window.frappe.csrf_token = token;
    if (window.frappe?.session) window.frappe.session.csrf_token = token;
    try {
      localStorage.setItem('frappe_csrf_token', token);
      sessionStorage.setItem('frappe_csrf_token', token);
    } catch { }
  }

  return token || '';
};

/**
 * Returns request headers including Content-Type and X-Frappe-CSRF-Token.
 * Accepts optional dynamicToken override.
 */
export const getAuthHeaders = (extraHeaders = {}, dynamicToken = null) => {
  const headers = {};
  if (!('Content-Type' in extraHeaders)) {
    headers['Content-Type'] = 'application/json';
  } else if (extraHeaders['Content-Type']) {
    headers['Content-Type'] = extraHeaders['Content-Type'];
  }
  for (const [key, val] of Object.entries(extraHeaders)) {
    if (key !== 'Content-Type' && val !== undefined && val !== null) {
      headers[key] = val;
    }
  }
  const token = dynamicToken || getCsrfToken();
  if (token) {
    headers['X-Frappe-CSRF-Token'] = token;
  }
  return headers;
};

/**
 * Request headers for FormData uploads.
 * Deliberately omits 'Content-Type' so the browser automatically sets multipart/form-data with boundary.
 */
export const getUploadHeaders = (extraHeaders = {}) => {
  const headers = { ...extraHeaders };
  delete headers['Content-Type'];
  const token = getCsrfToken();
  if (token) {
    headers['X-Frappe-CSRF-Token'] = token;
  }
  return headers;
};

/**
 * Resolves the base URL for API calls.
 * - On localhost/127.0.0.1, returns window.location.origin so Vite proxy routes /api.
 * - On production domains, ensures https:// is used to avoid Nginx 301 redirects (which drop headers and POST bodies).
 */
export const getApiBaseUrl = () => {
  if (typeof window === 'undefined') return 'https://cfpl.anantdv.com';
  const { origin, protocol, hostname, host } = window.location;

  // Local development via Vite dev server proxy
  const isLocalDev =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.') ||
    window.location.port === '5173';

  if (isLocalDev) {
    return origin;
  }

  // Force HTTPS on server to prevent 301 redirects dropping credentials/POST body
  if (protocol === 'http:') {
    return `https://${host}`;
  }

  return origin;
};

export const ERPNEXT_CONFIG = {
  get url() {
    return getApiBaseUrl();
  },
  apiKey: '',
  apiSecret: '',
  get csrfToken() {
    return getCsrfToken();
  }
};
