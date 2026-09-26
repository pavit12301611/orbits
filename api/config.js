'use strict';

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  return res.status(200).json({ configured: Boolean(clientId), clientId: clientId || null });
};
