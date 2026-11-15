# Nagisinnra ID Demo

A static HTML/CSS/JavaScript relying-party demo for Nagisinnra ID.

## Current status

The page is prepared for OpenID Connect Authorization Code Flow with PKCE. It is **not ready for real sign-in** until the provider is reachable and this site is registered as a public OIDC client.

## Before enabling sign-in

1. Publish this repository with GitHub Pages or Cloudflare Pages over HTTPS.
2. Record the exact deployed URL.
3. Register that URL as an allowed redirect URI in Nagisinnra ID.
4. Set the public OIDC client ID in `app.js`.
5. Confirm that the provider's discovery document, authorization endpoint, token endpoint, JWKS, and userinfo endpoint are working.
6. Confirm that the provider allows this site's origin and redirect URI.

The browser app is a public client. **Never put a client secret in `app.js` or any other browser file.**

## Configuration

Edit the `settings` object at the top of `app.js`:

- `authority`: Nagisinnra ID issuer URL
- `client_id`: client ID issued by Nagisinnra ID
- `redirect_uri`: exact URL registered with the provider

The app uses the OIDC Authorization Code flow with PKCE through `oidc-client-ts`.

## Files

- `index.html` — demo interface
- `style.css` — responsive dark UI
- `app.js` — OIDC client
