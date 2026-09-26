# Set up optional Google sign-in on Vercel

Orbit is a static-first study app. Google sign-in is optional and only verifies the signed-in identity; it does not upload/sync your study data. Progress stays in this browser's local storage.

## 1. Create a Google OAuth client ID

1. Open [Google Cloud Console](https://console.cloud.google.com/) and create/select a project.
2. Configure the OAuth consent screen / Google Auth Platform. Choose **External** if students outside your Workspace need to sign in, fill in the app name and support email, and add test users while the app is in testing. Publish/verify the consent screen if you need general public access.
3. Go to **Clients** (or **APIs & Services → Credentials**) → **Create OAuth client** → **Web application**.
4. Under **Authorized JavaScript origins**, add the origins where the site is hosted, for example:
   - `https://your-project.vercel.app`
   - `https://your-custom-domain.com` (if applicable)
   - `http://localhost:3000` for local front-end development
5. No redirect URI is needed for this GIS popup flow. Save and copy the OAuth **Client ID** (it ends in `.apps.googleusercontent.com`). Do not use an API key or client secret.

Google origins are exact origins (scheme + host + optional port); they do not accept wildcard preview domains. Add each Vercel preview origin you intend to test, or test on your production/custom domain.

## 2. Add the environment variable in Vercel

1. Open the project in [Vercel](https://vercel.com/) → **Settings → Environment Variables**.
2. Add:
   - **Name:** `GOOGLE_CLIENT_ID`
   - **Value:** the OAuth web application client ID from step 1
   - **Environments:** select Production, Preview, and/or Development as needed.
3. Save, then redeploy the project so the serverless functions receive the new variable.

The client ID is designed to be public and is returned by `/api/config` for the browser's Google Identity Services button. Keep any future client secret or other private credentials out of frontend files and out of Git. This implementation does not need a client secret.

## 3. Verify the setup

- Open `https://your-domain/api/config`. With the variable configured it should return `{"configured":true,"clientId":"…"}`. The client ID is public by design.
- Load the site on the same authorized origin and click **Sign in with Google**.
- A successful sign-in displays your Google profile. The Vercel function verifies Google's ID token against `GOOGLE_CLIENT_ID` using `google-auth-library`, then keeps the short-lived token in a `Secure`, `HttpOnly`, `SameSite=Lax` cookie (maximum one hour). Browser JavaScript and local storage never receive/persist the token.
- If the endpoint returns `configured:false`, check the variable's selected Vercel environment and redeploy. If Google rejects the origin, compare the browser URL with the exact authorized JavaScript origin in Google Cloud Console.

## Local development

`python3 -m http.server 3000` still works for the study features, but it cannot run the `/api` Vercel functions, so sign-in will remain unavailable. To test Google sign-in locally:

```sh
npm install -g vercel
vercel link
vercel env add GOOGLE_CLIENT_ID development
vercel env pull .env.local
vercel dev
```

Enter the same OAuth client ID when prompted, and authorize `http://localhost:3000` in Google Cloud. `.env.local` is ignored by Git; do not commit local environment files.
