'use client';

import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import { Body, Button } from './ui';

// Apple + Google only. Vesper is invite-only and application-reviewed, so
// there's no value in an anonymous email/password or magic-link account --
// requiring a real Apple or Google identity is itself a light form of
// vetting, and it drops the email-confirmation step entirely (see
// docs/EMAIL_OTP.md for why that step was breaking in the first place).
// Same direction as hotliterati-app's lib/socialAuth.ts.
//
// Both providers still go through Supabase's OAuth redirect flow, which
// lands back on /auth/callback (unchanged) -- so NEXT_PUBLIC_SITE_URL
// still has to be correct in whatever environment this is deployed to.
// Neither provider works until it's configured in the Supabase dashboard;
// see docs/SOCIAL_AUTH_SETUP.md.
export function SignInForm({ next = '/apply' }: { next?: string }) {
  const [loading, setLoading] = useState<'apple' | 'google' | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signInWith(provider: 'apple' | 'google') {
    if (loading) return;
    setLoading(provider);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      // On success the browser is redirected to the provider -- nothing
      // left to do here (loading state persists until the navigation).
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong — try again.');
      setLoading(null);
    }
  }

  return (
    <div>
      <Button type="button" onClick={() => signInWith('apple')} disabled={!!loading} className="w-full mb-3">
        {loading === 'apple' ? 'Redirecting…' : 'Continue with Apple'}
      </Button>
      <Button type="button" variant="ghost" onClick={() => signInWith('google')} disabled={!!loading} className="w-full">
        {loading === 'google' ? 'Redirecting…' : 'Continue with Google'}
      </Button>
      {error && <p className="font-body text-sm text-error mt-4">{error}</p>}
      <Body className="mt-6 text-xs text-smoked-oak">
        Vesper is invite-only — signing in starts your application, reviewed by a person, not a bot.
      </Body>
    </div>
  );
}
