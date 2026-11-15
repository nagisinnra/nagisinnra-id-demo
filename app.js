const loginMount = document.querySelector("#nagisinnra-login");
const logoutButton = document.querySelector("#logout");
const message = document.querySelector("#message");
const account = document.querySelector("#account");

function showSignedOut(text) {
  logoutButton.classList.add("hidden");
  account.classList.add("hidden");
  message.textContent = text;
}

function showSignedIn(user) {
  logoutButton.classList.remove("hidden");
  account.classList.remove("hidden");
  message.textContent = "Nagisinnra IDによる認証が完了しました。";
  document.querySelector("#username").textContent =
    user.profile.preferred_username || user.profile.name || "—";
  document.querySelector("#email").textContent = user.profile.email || "—";
  document.querySelector("#subject").textContent = user.profile.sub || "—";
}

async function start() {
  if (!window.NagisinnraID) {
    throw new Error("Nagisinnra ID SDKを読み込めませんでした。");
  }

  await NagisinnraID.init({
    authority: "https://nagisinnra-id.netlify.app",
    clientId: "YOUR_PUBLIC_CLIENT_ID"
  });

  await NagisinnraID.renderButton("#nagisinnra-login", {
    label: "Nagisinnra IDでログイン",
    width: "100%"
  });

  NagisinnraID.onLogin(showSignedIn);
  NagisinnraID.onLogout(() => showSignedOut("ログアウトしました。"));
  NagisinnraID.onError(() => {
    message.textContent = "認証を開始できませんでした。Nagisinnra IDの設定を確認してください。";
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
    message.textContent = "ログアウトできませんでした。";
  } finally {
    logoutButton.disabled = false;
  }
});

start().catch((error) => {
  console.error("Nagisinnra ID initialization error:", error);
  showSignedOut("Nagisinnra IDに接続できません。認証サーバーとClient IDを確認してください。");
});