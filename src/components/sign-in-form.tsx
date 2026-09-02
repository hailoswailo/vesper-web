'use client';

import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import { Body, Button, Input } from './ui';

// Code-based sign-in: we email a 6-digit code and the person types it in,
// rather than sending a clickable "magic link".
//
// Why: a magic link's one-time token gets silently burned the moment
// anything fetches the URL before a human clicks it — and that happens
// constantly in practice. Outlook/Microsoft 365's Safe Links scanner
// pre-fetches every link in incoming mail (this is where the
// "email link has expired" / "One-time token not found" reports were
// coming from — see the auth logs: a HEAD request from a Microsoft IP,
// immediately followed by the real click failing). Other providers do
// similar link-prescanning. A typed code has nothing to prefetch, so it
// can't be invalidated before the person uses it — and it also sidesteps
// needing NEXT_PUBLIC_SITE_URL / the /auth/callback redirect to be
// correctly configured wherever this is deployed.
//
// NOTE: Supabase's default "Magic Link" email template only renders a
// clickable link — for the code to actually show up in the email body,
// the template in the Supabase dashboard (Authentication -> Email
// Templates -> Magic Link) needs to include `{{ .Token }}` as visible
// text. See docs/EMAIL_OTP.md.
export function SignInForm({ next: _next = '/apply' }: { next?: string }) {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  function startCooldown(seconds: number) {
    setCooldown(seconds);
    const interval = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email.trim() || sending || cooldown > 0) return;
    setSending(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
      });
      if (error) throw error;
      setStep('code');
      startCooldown(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong sending that code — try again.');
    } finally {
      setSending(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || verifying) return;
    setVerifying(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code.trim(),
        type: 'email',
      });
      if (error) throw error;
      // Session is now set; the page's onAuthStateChange listener picks it
      // up and re-renders — no navigation needed here.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That code didn’t work — double check it, or send a new one.');
    } finally {
      setVerifying(false);
    }
  }

  if (step === 'code') {
    return (
      <div>
        <Body className="mb-4">
          Enter the 6-digit code we sent to <span className="text-brass">{email}</span>.
        </Body>
        <form onSubmit={verifyCode}>
          <Input
            label="Code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          />
          {error && <p className="font-body text-sm text-error mb-4">{error}</p>}
          <Button type="submit" disabled={!code.trim() || verifying}>
            {verifying ? 'Checking…' : 'Verify & Continue'}
          </Button>
          <button
            type="button"
            onClick={() => sendCode()}
            disabled={sending || cooldown > 0}
            className="block mt-4 font-body text-xs tracking-[0.1em] uppercase text-smoked-oak hover:text-brass disabled:opacity-50"
          >
            {cooldown > 0 ? `Resend code (${cooldown}s)` : sending ? 'Sending…' : 'Resend code'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={sendCode}>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p className="font-body text-sm text-error mb-4">{error}</p>}
      <Button type="submit" disabled={!email.trim() || sending}>
        {sending ? 'Sending…' : 'Send Code'}
      </Button>
    </form>
  );
}
