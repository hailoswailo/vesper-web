# Social sign-in setup (Apple + Google)

Both apps — `vesper-web` and `vesper-native-main` — now use Apple and
Google sign-in only. The email/password path (native) and the
magic-link/OTP-code path (web, see `EMAIL_OTP.md` for why that one broke)
are both gone: Vesper is invite-only and every applicant is reviewed by a
person, so there's no value in an anonymous email account, and requiring
a real Apple or Google identity is itself a light form of vetting.

None of this works yet — it's all console configuration across three
different dashboards, not code. Nothing below has been done.

## 1. Google Cloud Console

- Create (or reuse) a Google Cloud project for Vesper — this needs to be
  Vesper's own; Hot Literati's existing client IDs are scoped to its own
  bundle ID/origin and can't be reused.
- Configure the OAuth consent screen (External, app name "Vesper", a
  support email, etc.).
- Create two OAuth 2.0 Client IDs under APIs & Services -> Credentials:
  1. **Web application** — used both by `vesper-web`'s Supabase Google
     provider and as the `webClientId` the native app configures
     (`signInWithIdToken` checks the Google ID token's audience against
     this one ID either way). Authorized redirect URI:
     `https://rpypdxmgyswlnkfkxxbq.supabase.co/auth/v1/callback`.
     Authorized JavaScript origin: the real deployed web domain.
  2. **iOS** — bundle ID `com.pulchritudemedia.vesper`. The native Google
     Sign-In SDK needs this registered for the sign-in sheet to be able to
     hand control back to the app.
- Update `vesper-native-main/src/lib/google-auth.ts`: replace
  `GOOGLE_WEB_CLIENT_ID` with the real Web client ID.
- Update `vesper-native-main/app.json`'s
  `@react-native-google-signin/google-signin` plugin entry: replace the
  placeholder `iosUrlScheme` with the real one — it's the iOS client ID's
  prefix (before `.apps.googleusercontent.com`) reversed under
  `com.googleusercontent.apps.` (see `hotliterati-app/app.json` for a real
  example of the shape).
- This needs an actual native rebuild (`eas build`) to take effect — Expo
  Go can't run a native module that wasn't in the last build.

## 2. Supabase dashboard — Google provider

Authentication -> Providers -> Google: enable it, paste the Web client
ID and its secret from step 1. This is what both the web OAuth flow
(`signInWithOAuth`) and the native `signInWithIdToken` call validate
against.

## 3. Apple — two different things, don't conflate them

**Native is already working** — Sign in with Apple via
`expo-apple-authentication` verifies against the app's own Bundle ID.
Nothing new needed here.

**Web needs a separate setup**, because browser OAuth for Apple works
differently from the native SDK:
- Apple Developer -> Certificates, Identifiers & Profiles -> Identifiers
  -> create a **Services ID** (distinct from the app's Bundle ID) for the
  web domain, e.g. `com.pulchritudemedia.vesper.web`.
- Under that Services ID, enable "Sign In with Apple" and add the web
  domain plus the return URL:
  `https://rpypdxmgyswlnkfkxxbq.supabase.co/auth/v1/callback`.
- Generate a Sign in with Apple **private key** (.p8) under Keys — this
  is different from the App Store Connect API key already sitting in
  `credentials/AuthKey_HK557NVXSK.p8`.
- Supabase dashboard -> Authentication -> Providers -> Apple: enter the
  Services ID as the Client ID, and ALSO list the native Bundle ID
  (`com.pulchritudemedia.vesper`) alongside it, comma-separated, in the
  same field — so native token verification keeps working once web Apple
  sign-in is added. Enter the Team ID (`Z7XD6FQ685`, already in
  `eas.json`), the Key ID, and paste the private key.

## 4. Still applies regardless

`NEXT_PUBLIC_SITE_URL` still needs to be the real deployed domain (see
`EMAIL_OTP.md`) — both OAuth flows redirect through `/auth/callback`,
same as the old magic-link flow did.
