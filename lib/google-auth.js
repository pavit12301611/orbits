'use strict';

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const COOKIE_NAME = 'orbit_google_session';

async function verifyGoogleCredential(token) {
  const audience = process.env.GOOGLE_CLIENT_ID;
  if (!audience) throw Object.assign(new Error('Google sign-in is not configured yet.'), { statusCode: 503 });
  if (typeof token !== 'string' || token.length === 0 || token.length > 12000) {
    throw Object.assign(new Error('A valid Google credential is required.'), { statusCode: 400 });
  }
  const ticket = await client.verifyIdToken({ idToken: token, audience });
  const payload = ticket.getPayload();
  if (!payload || !payload.sub || !payload.email || payload.email_verified !== true) {
    throw Object.assign(new Error('Google could not verify this account.'), { statusCode: 401 });
  }
  return {
    user: {
      id: payload.sub,
      name: payload.name || payload.email.split('@')[0],
      email: payload.email,
      picture: payload.picture || null
    },
    expiresAt: Number(payload.exp) || 0
  };
}

function readSessionToken(req) {
  const cookie = (req.headers && req.headers.cookie) || '';
  for (const item of cookie.split(';')) {
    const index = item.indexOf('=');
    if (index < 0 || item.slice(0, index).trim() !== COOKIE_NAME) continue;
    try { return decodeURIComponent(item.slice(index + 1).trim()); } catch (_) { return ''; }
  }
  return '';
}

function sessionCookie(token, maxAge) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/api/auth; Max-Age=${Math.max(0, Math.floor(maxAge))}; HttpOnly; Secure; SameSite=Lax`;
}

async function userFromRequest(req) {
  const token = readSessionToken(req);
  if (!token) return null;
  return (await verifyGoogleCredential(token)).user;
}

module.exports = { verifyGoogleCredential, readSessionToken, sessionCookie, userFromRequest };
