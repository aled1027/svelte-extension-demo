# Svelte Extension Demo

```bash
npm install
npm run build
```

Then: Go to chrome://extensions in google chrome. Click `Load unpacked` and select the `/dist` directory.

## References

The [Calcium extension](https://github.com/ethanlynn/calcium) was used as a model for this demo.

## Log in

To get it to work for me:

1. Set up new project in google
2. Set up webapp credentials
3. Set up redirect URi with a trailing slash
4. Follow the supabase docs, commenting out the Supabase call at the end
   - https://supabase.com/docs/guides/auth/social-login/auth-google?platform=chrome-extensions
5. Use the token, a JWT, from google as needed to verify from there

This helped as well: https://stackoverflow.com/questions/52903191/redirect-uri-mismatch-when-using-identity-launchwebauthflow-for-google-chrome-ex

## Things to note

1. You cannot load external scripts in Chrome Extensions going forward. This makes certain dependencies and SDK un-useable, including [Clerk](clerk.dev) for authentication.
