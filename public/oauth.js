window.onload = function () {
  document.querySelector("#login").addEventListener("click", function () {
    const manifest = chrome.runtime.getManifest();
    const url = new URL("https://accounts.google.com/o/oauth2/auth");

    url.searchParams.set("client_id", manifest.oauth2.client_id);
    url.searchParams.set("response_type", "id_token");
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("redirect_uri", chrome.identity.getRedirectURL());
    url.searchParams.set("scope", manifest.oauth2.scopes.join(" "));

    console.log("Authenticating to URL", url);

    chrome.identity.launchWebAuthFlow(
      {
        url: url.href,
        interactive: true,
      },
      async (redirectedTo) => {
        if (chrome.runtime.lastError) {
          console.log("Unsuccessful login");
          // auth was not successful
        } else {
          // auth was successful, extract the ID token from the redirectedTo URL
          console.log("Successfully logged in");
          const url = new URL(redirectedTo);
          const params = new URLSearchParams(url.hash);
          const googleJwt = params.get("id_token");
          // ... use the jwt as needed
        }
      },
    );
  });
};
