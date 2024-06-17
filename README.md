# Svelte Extension Demo

```bash
npm install
npm run build
```

Then: Go to chrome://extensions in google chrome. Click `Load unpacked` and select the `/dist` directory.

## References

The [Calcium extension](https://github.com/ethanlynn/calcium) was used as a model for this demo.

## Things to note

1. You cannot load external scripts in Chrome Extensions going forward. This makes certain dependencies and SDK un-useable, including [Clerk](clerk.dev) for authentication.
