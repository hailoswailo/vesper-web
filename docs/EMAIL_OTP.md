# Sign-in email: what was broken, and two things still to fix in the dashboard

> **Superseded 2026-09-02**: the code-entry flow described below was replaced with Apple + Google sign-in only (no email step at all). See `SOCIAL_AUTH_SETUP.md`. The diagnosis below is kept as-is because it's still the accurate record of what was actually broken.


## What was broken (confirmed from the Supabase auth logs)

The web `/apply` and `/membership` sign-in used Supabase's magic-link flow
(`signInWithOtp` + a clickable link to `/auth/callback`). Two things were
stacking to break it for real users:

1. **`NEXT_PUBLIC_SITE_URL` is `http://localhost:3000`.** That value is
   what gets baked into the link the email sends — so every sign-in email,
   however it's hosted, has been telling people's browsers to go to
   `localhost:3000`, which only exists on the machine it was built on.
   Confirmed in the logs: every `/verify` and `/token` request today has
   `referer: http://localhost:3000`, including ones from real outside IPs
   (not just local dev).
2. **Link pre-fetching burns the one-time token before the person clicks
   it.** Kevin's (`kevincolborn@outlook.com`) attempt shows a `HEAD`
   request from a Microsoft IP (`104.47.51.126`) immediately before the
   real click fails with `"email link has expired"` / `"One-time token not
   found"`. That's Outlook/Microsoft 365's Safe Links scanner opening the
   link automatically to check it's safe — which, for a single-use token,
   consumes it. This isn't a Vesper-specific bug; it's a known failure
   mode of email magic links generally, and it hits Outlook/Hotmail/many
   corporate mail recipients especially hard.

## What changed in code

`src/components/sign-in-form.tsx` now sends a 6-digit code instead of a
link, and the person types it back in on the same page
(`supabase.auth.verifyOtp`). No link, nothing to pre-fetch, and it no
longer depends on `NEXT_PUBLIC_SITE_URL` or the `/auth/callback` route
being correct.

## Two things to do in the Supabase dashboard (can't be done from code)

**1. Show the code in the email.** Supabase's default "Magic Link"
template only renders a clickable button — the 6-digit code exists on
every send, but it's invisible unless the template says so.

- Authentication -> Email Templates -> Magic Link
- Add `{{ .Token }}` somewhere visible in the template body (e.g. "Your
  code is **{{ .Token }}**"), so people actually see a code to type
  rather than a button that (until #2 below is fixed) goes nowhere.
- This is also the moment to swap the generic Supabase template for
  something in Vesper's own voice/palette — happy to draft that copy and
  a simple branded HTML template if useful.

**2. Fix the site URL — still needed even with the code flow**, because
Stripe Checkout's success/cancel redirect and the general app also read
`NEXT_PUBLIC_SITE_URL`:

- Set `NEXT_PUBLIC_SITE_URL` to the real deployed domain, wherever this
  app is actually hosted (production env vars there, not `.env.local`,
  which is gitignored and dev-only).
- Authentication -> URL Configuration -> add that same domain to
  **Redirect URLs**, or Supabase will reject the redirect even once the
  env var is right.

Once both are done, the old link-based flow would've worked too — but the
code flow is worth keeping regardless, since it's immune to link
pre-fetching for good.
