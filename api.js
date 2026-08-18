const API_BASE_URL = "https://script.google.com/macros/s/AKfycbywr3YKcSDrRQRUbOWMXADuM3f5NDcSbE_Wbt3sSLLHTHNJQ8Mb-HQz4LeV886D6Ze4Aw/exec";

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