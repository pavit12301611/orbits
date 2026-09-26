'use strict';

/* Optional Google identity verification. Study data remains local; this is not cloud sync. */
(() => {
  const control = () => document.getElementById('auth-control');
  let configured = false;
  let busy = false;

  function makeAvatar(profile, large = false) {
    const initials = (profile.name || profile.email || 'O').trim().charAt(0).toUpperCase();
    if (typeof profile.picture === 'string' && /^https:\/\//.test(profile.picture)) {
      const img = document.createElement('img');
      img.className = large ? 'avatar auth-avatar' : 'auth-avatar';
      img.src = profile.picture;
      img.alt = '';
      img.referrerPolicy = 'no-referrer';
      return img;
    }
    const badge = document.createElement('span');
    badge.className = large ? 'avatar auth-avatar auth-initial' : 'auth-avatar auth-initial';
    badge.textContent = initials;
    return badge;
  }

  function paintProfile(profile) {
    const host = control();
    const side = document.getElementById('sidebar-profile');
    if (!host) return;

    if (!profile) {
      if (side) {
        side.replaceChildren();
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = typeof state !== 'undefined' && state.track === 'JEE' ? 'J' : 'N';
        const details = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = `${typeof state !== 'undefined' ? state.track : 'NEET'} track`;
        const note = document.createElement('small');
        note.textContent = 'Private · on this device';
        details.append(title, note);
        side.append(avatar, details);
      }
      if (!configured) {
        host.innerHTML = '<span class="auth-status" title="Add GOOGLE_CLIENT_ID in Vercel to enable sign-in">Google sign-in setup</span>';
      } else {
        host.innerHTML = '<div id="google-signin-button"></div>';
        renderGoogleButton();
      }
      return;
    }

    host.replaceChildren();
    const button = document.createElement('button');
    button.className = 'auth-account';
    button.type = 'button';
    button.title = `Signed in as ${profile.email}. Click to sign out.`;
    button.setAttribute('aria-label', button.title);
    button.append(makeAvatar(profile));
    const name = document.createElement('span');
    name.className = 'auth-account-name';
    name.textContent = profile.name || profile.email;
    button.append(name);
    button.addEventListener('click', signOut);
    host.append(button);

    if (side) {
      side.replaceChildren();
      side.append(makeAvatar(profile, true));
      const details = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = profile.name || profile.email;
      const note = document.createElement('small');
      note.textContent = 'Google verified · progress stays local';
      details.append(title, note);
      side.append(details);
    }
  }

  function renderGoogleButton() {
    const target = document.getElementById('google-signin-button');
    if (!target || !window.google || !google.accounts || !google.accounts.id) return;
    target.innerHTML = '';
    google.accounts.id.renderButton(target, {
      type: 'standard', theme: document.documentElement.dataset.theme === 'dark' ? 'filled_black' : 'outline',
      size: 'medium', text: 'signin_with', shape: 'pill', logo_alignment: 'left', width: 176
    });
  }

  async function signOut() {
    if (window.google && google.accounts && google.accounts.id) google.accounts.id.disableAutoSelect();
    paintProfile(null);
    try { await fetch('/api/auth/logout', { method: 'POST', headers: { Accept: 'application/json' } }); } catch (_) { /* UI still signs out if offline. */ }
    if (typeof toast === 'function') toast('Signed out. Your study progress remains on this device.');
  }

  async function onCredential(response) {
    if (busy) return;
    busy = true;
    const host = control();
    if (host) host.innerHTML = '<span class="auth-status">Verifying…</span>';
    try {
      const result = await fetch('/api/auth/google', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });
      const data = await result.json().catch(() => ({}));
      if (!result.ok || !data.user) throw new Error(data.error || 'Sign-in could not be completed.');
      paintProfile(data.user);
      if (typeof toast === 'function') toast(`Welcome, ${data.user.name || 'learner'}! Progress is still stored on this device.`);
    } catch (error) {
      if (typeof toast === 'function') toast(error.message || 'Google sign-in failed. Please try again.');
      paintProfile(null);
    } finally {
      busy = false;
    }
  }

  function loadGoogleIdentity(clientId) {
    window.googleIdentityCallback = onCredential;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.google || !google.accounts || !google.accounts.id) {
        if (control()) control().innerHTML = '<span class="auth-status">Google sign-in unavailable</span>';
        return;
      }
      google.accounts.id.initialize({ client_id: clientId, callback: window.googleIdentityCallback, auto_select: false, cancel_on_tap_outside: true });
      renderGoogleButton();
    };
    script.onerror = () => { if (control()) control().innerHTML = '<span class="auth-status">Google sign-in unavailable</span>'; };
    document.head.appendChild(script);
  }

  async function initialize() {
    paintProfile(null);
    try {
      const response = await fetch('/api/config', { headers: { Accept: 'application/json' }, cache: 'no-store' });
      if (!response.ok) throw new Error('Google sign-in config endpoint unavailable');
      const data = await response.json();
      configured = Boolean(data.configured && data.clientId);
      if (!configured) { paintProfile(null); return; }

      const session = await fetch('/api/auth/me', { headers: { Accept: 'application/json' }, credentials: 'same-origin', cache: 'no-store' });
      const current = session.ok ? await session.json().catch(() => ({})) : {};
      if (current.user) paintProfile(current.user);
      else paintProfile(null);
      loadGoogleIdentity(data.clientId);
    } catch (_) {
      configured = false;
      paintProfile(null);
    }
  }

  window.addEventListener('DOMContentLoaded', initialize);
})();
