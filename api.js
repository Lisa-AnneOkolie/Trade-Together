/**
 * TRADEOGETHER — API BRIDGE
 * One file, included on every page, so the Apps Script URL only lives in one place.
 *
 * <script src="api.js"></script>  ← add this before your page's own <script> tag
 *
 * PASTE YOUR WEB APP URL BELOW, after: Deploy > New deployment > Web app > Deploy
 * It looks like: https://script.google.com/macros/s/AKfycb.../exec
 */

const API_BASE_URL = "https://script.google.com/macros/s/AKfycbzrcvfLgkWvsIQbvzu2jKBKd_Lecgo3jt-dWvFCGTPeaBnQKoWMHE9Z1CbVGVrv6xAbJA/exec";

const TOKEN_KEY = "tradeogether_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * GET requests — for public, read-only actions (getPublicFeed, getGlobalDashboard, etc.)
 * Usage: const feed = await apiGet('getPublicFeed', { limit: 20 });
 */
async function apiGet(action, params = {}) {
  const query = new URLSearchParams({ action, ...params }).toString();
  const res = await fetch(`${API_BASE_URL}?${query}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Request failed");
  return json.data;
}

/**
 * POST requests — for actions that write data (submitTrade, submitPrediction, etc.)
 * Automatically attaches the saved auth token, if there is one.
 * Usage: await apiPost('submitTrade', { symbol: 'EURUSD', direction: 'long', ... });
 */
async function apiPost(action, body = {}) {
  const token = getToken();
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    // Apps Script web apps redirect on preflight; text/plain avoids a CORS preflight entirely.
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, token, ...body }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Request failed");
  return json.data;
}
