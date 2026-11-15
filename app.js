const loginMount = document.querySelector("#nagisinnra-login");
const logoutButton = document.querySelector("#logout");
const message = document.querySelector("#message");
const account = document.querySelector("#account");

// Set this to the public Client ID registered in Nagisinnra ID.
// A browser-side public client must never contain a client secret.
const CONFIG = {
  authority: "https://nagisinnra-id.netlify.app",
  clientId: "YOUR_PUBLIC_CLIENT_ID"
};

function showSignedOut(text) {
  logoutButton.classList.add("hidden");
  account.classList.add("hidden");
  message.textContent = text;
}

function showSignedIn(user) {
  const profile = user && user.profile ? user.profile : {};
  logoutButton.classList.remove("hidden");
  account.classList.remove("hidden");
  message.textContent = "Nagisinnra IDによる認証が完了しました。";
  document.querySelector("#username").textContent =
    profile.preferred_username || profile.name || "—";
  document.querySelector("#email").textContent = profile.email || "—";
  document.querySelector("#subject").textContent = profile.sub || "—";
}

async function start() {
  if (!CONFIG.clientId || CONFIG.clientId === "YOUR_PUBLIC_CLIENT_ID") {
    throw new Error("Client IDが未設定です。Nagisinnra IDで登録した公開Client IDをCONFIG.clientIdに設定してください。");
  }

  if (!window.NagisinnraID) {
    throw new Error("SDKを読み込めません。公開URL https://nagisinnra-id.netlify.app/sdk.js を確認してください。");
  }

  await NagisinnraID.init(CONFIG);

  await NagisinnraID.renderButton(loginMount, {
    label: "Nagisinnra IDでログイン",
    width: "100%"
  });

  NagisinnraID.onLogin(showSignedIn);
  NagisinnraID.onLogout(() => showSignedOut("ログアウトしました。"));
  NagisinnraID.onError((error) => {
    console.error("Nagisinnra ID authentication error:", error);
    message.textContent = "認証エラー: " + (error && error.message ? error.message : "詳細は開発者コンソールを確認してください。");
  });

  const user = await NagisinnraID.getUser();
  if (user) showSignedIn(user);
  else showSignedOut("ログインすると、アカウント情報がここに表示されます。");
}

logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;
  try {
    await NagisinnraID.logout();
  } catch (error) {
    console.error("Nagisinnra ID logout error:", error);
    message.textContent = "ログアウトできませんでした: " + error.message;
  } finally {
    logoutButton.disabled = false;
  }
});

start().catch((error) => {
  console.error("Nagisinnra ID initialization error:", error);
  showSignedOut("Nagisinnra IDに接続できません: " + (error && error.message ? error.message : "不明なエラー"));
});
