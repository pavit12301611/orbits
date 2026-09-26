'use strict';

const { verifyGoogleCredential, sessionCookie } = require('../../lib/google-auth');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const { user, expiresAt } = await verifyGoogleCredential(req.body && req.body.credential);
    const maxAge = expiresAt - Math.floor(Date.now() / 1000);
    if (maxAge <= 0) return res.status(401).json({ error: 'Google sign-in expired. Please try again.' });
    // Keep the verified Google token in a short-lived, HttpOnly cookie, never browser JS storage.
    res.setHeader('Set-Cookie', sessionCookie(req.body.credential, Math.min(maxAge, 3600)));
    return res.status(200).json({ user });
  } catch (error) {
    const code = error.statusCode || 401;
    if (code === 401) console.warn('Google sign-in token verification failed:', error.message);
    return res.status(code).json({ error: code === 503 || code === 400 ? error.message : 'Google sign-in could not be verified. Please try again.' });
  }
};
