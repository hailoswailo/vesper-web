'use client';

import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import { Body, Button, Input } from './ui';

// Email + password. Vesper is invite-only and every application is read by
// a person, so a password account is enough of a gate on its own.
//
// Deliberately not a magic link or emailed code — the magic-link flow broke
// for real users (see docs/EMAIL_OTP.md: NEXT_PUBLIC_SITE_URL pointing at
// localhost, and Outlook/Microsoft 365 pre-fetching and burning the
// one-time link before the person ever clicks it). Password sign-in has no
// link to pre-fetch and no dependency on the site URL being correct.
//
// IMPORTANT: this only works cleanly if "Confirm email" is turned off in
// the Supabase dashboard (Authentication -> Sign In / Providers -> Email).
// With it on, Supabase emails a confirmation *link* on sign-up, which hits
// the exact same Outlook problem this was written to avoid. With it off,
// signUp() returns an active session immediately — no email round-trip at
// all. If it's still on, the fallback message below tells people to check
// their email instead of silently failing.
//
// Apple/Google OAuth can be layered in later (docs/SOCIAL_AUTH_SETUP.md)
// without touching this — Supabase sessions work the same either way, and
// the two downstream pages (apply, membership) just watch for a session.
export function SignInForm({ next = '/apply' }: { next?: string }) {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || !email.trim() || !password) return;
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const supabase = createClient();
      const cleanEmail = email.trim().toLowerCase();

      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email: cleanEmail, password });
        if (error) throw error;
        if (!data.session) {
          // "Confirm email" is still on in Supabase — fall back gracefully
          // instead of pretending sign-up worked.
          setInfo('Check your email to confirm your account, then sign in below.');
          setMode('signin');
          setLoading(false);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) throw error;
      }
      window.location.href = next;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong — try again.');
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        {info && <p className="font-body text-sm text-brass mb-4">{info}</p>}
        {error && <p className="font-body text-sm text-error mb-4">{error}</p>}
        <Button type="submit" disabled={loading || !email.trim() || !password} className="w-full mb-4">
          {loading ? 'One moment…' : mode === 'signup' ? 'Create account' : 'Sign in'}
        </Button>
      </form>
      <Body className="text-xs text-smoked-oak">
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <button type="button" onClick={() => setMode('signin')} className="text-brass underline">
              Sign in
            </button>
          </>
        ) : (
          <>
            New here?{' '}
            <button type="button" onClick={() => setMode('signup')} className="text-brass underline">
              Create an account
            </button>
          </>
        )}
      </Body>
    </div>
  );
}
