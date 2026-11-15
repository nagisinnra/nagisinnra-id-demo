# Nagisinnra ID Demo

Static HTML/CSS/JavaScript demo using the hosted Nagisinnra ID Browser SDK.

## Minimal integration

Add the SDK script and a mount element to any HTTPS HTML page:

```html
<script src="https://nagisinnra-id.netlify.app/sdk.js"></script>
<div id="nagisinnra-login"></div>

<script>
  (async () => {
    await NagisinnraID.init({
      clientId: "YOUR_PUBLIC_CLIENT_ID"
    });

    await NagisinnraID.renderButton("#nagisinnra-login");

    NagisinnraID.onLogin((user) => {
      console.log("Signed in:", user.profile);
    });
  })().catch(console.error);
</script>
```

The SDK uses the current page path as the redirect URI by default. It remembers the original page URL in OIDC state, processes the Authorization Code + PKCE callback, validates that the return URL belongs to the same origin, and returns the browser to that page.

## Required provider setup

Before real sign-in can work:

1. Deploy the Nagisinnra ID provider and confirm its OpenID discovery document works.
2. Register this demo's exact HTTPS URL as a public OIDC client redirect URI.
3. Configure the provider's allowed web origins/CORS for the demo site.
4. Replace `YOUR_PUBLIC_CLIENT_ID` in `app.js` with the public client ID.
5. Confirm authorization code + PKCE, token exchange, JWKS and userinfo endpoints work.

This is a browser public client. Never put a client secret in HTML or JavaScript.

## SDK API

- `NagisinnraID.init({ clientId, authority?, redirectUri?, scope? })`
- `NagisinnraID.renderButton(selector, options?)`
- `NagisinnraID.getUser()`
- `NagisinnraID.onLogin(callback)`
- `NagisinnraID.onLogout(callback)`
- `NagisinnraID.onError(callback)`
- `NagisinnraID.logout()` (local session logout)

See the `SDK.md` file in the Nagisinnra ID repository for full documentation.
