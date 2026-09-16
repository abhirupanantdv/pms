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
  }
  return '';
};

/**
 * Returns request headers including Content-Type and X-Frappe-CSRF-Token.
 * CRITICAL: If no CSRF token exists, the header is NOT included.
 * Frappe's backend throws CSRFTokenError immediately if X-Frappe-CSRF-Token is present but empty!
 */
export const getAuthHeaders = (extraHeaders = {}) => {
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
  const token = getCsrfToken();
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
  if (typeof window === 'undefined') return 'http://192.168.101.180:8980';
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
