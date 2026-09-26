'use strict';

const { userFromRequest, sessionCookie } = require('../../lib/google-auth');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  if (!process.env.GOOGLE_CLIENT_ID) return res.status(503).json({ error: 'Google sign-in is not configured yet.' });
  try {
    const user = await userFromRequest(req);
    if (!user) return res.status(401).json({ error: 'Not signed in.' });
    return res.status(200).json({ user });
  } catch (_) {
    res.setHeader('Set-Cookie', sessionCookie('', 0));
    return res.status(401).json({ error: 'Sign-in expired. Please sign in again.' });
  }
};
