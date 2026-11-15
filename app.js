import { UserManager, WebStorageStateStore } from "https://cdn.jsdelivr.net/npm/oidc-client-ts@3.3.0/+esm";

// Public OIDC client settings. Replace client_id after registering this site
// in Nagisinnra ID. A browser-based app must never contain a client secret.
const settings = {
  authority: "https://id.sinnra.f5.si",
  client_id: "REPLACE_WITH_REGISTERED_CLIENT_ID",
  redirect_uri: window.location.origin + window.location.pathname,
  post_logout_redirect_uri: window.location.origin + window.location.pathname,
  response_type: "code",
  scope: "openid profile email",
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  automaticSilentRenew: false
};

const manager = new UserManager(settings);
const loginButton = document.querySelector("#login");
const logoutButton = document.querySelector("#logout");
const message = document.querySelector("#message");
const account = document.querySelector("#account");

function showSignedOut(text) {
  loginButton.classList.remove("hidden");
  logoutButton.classList.add("hidden");
  account.classList.add("hidden");
  message.textContent = text;
}

function showSignedIn(user) {
  loginButton.classList.add("hidden");
  logoutButton.classList.remove("hidden");
  account.classList.remove("hidden");
  message.textContent = "Nagisinnra IDによる認証が完了しました。";
  document.querySelector("#username").textContent = user.profile.preferred_username || user.profile.name || "—";
  document.querySelector("#email").textContent = user.profile.email || "—";
  document.querySelector("#subject").textContent = user.profile.sub || "—";
}

loginButton.addEventListener("click", async () => {
  message.textContent = "Nagisinnra IDへ移動しています…";
  try {
    await manager.signinRedirect();
  } catch (error) {
    message.textContent = "ログインを開始できませんでした。OIDC設定を確認してください。";
    console.error("OIDC sign-in error:", error);
  }
});

logoutButton.addEventListener("click", async () => {
  try {
    await manager.signoutRedirect();
  } catch (error) {
    message.textContent = "ログアウトを開始できませんでした。";
    console.error("OIDC sign-out error:", error);
  }
});

try {
  const callbackUser = await manager.signinCallback();
  const user = callbackUser || await manager.getUser();
  if (user && !user.expired) showSignedIn(user);
  else showSignedOut("ログインすると、アカウント情報がここに表示されます。");
} catch (error) {
  console.error("OIDC callback error:", error);
  showSignedOut("認証コールバックを処理できませんでした。Nagisinnra ID側の設定を確認してください。");
}