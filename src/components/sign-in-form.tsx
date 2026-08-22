'use client';

import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import { Body, Button, Input } from './ui';

export function SignInForm({ next = '/apply' }: { next?: string }) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong sending that link — try again.');
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <Body>
        Check <span className="text-brass">{email}</span> for a sign-in link. You can close this tab.
      </Body>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
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
        {sending ? 'Sending…' : 'Send Sign-In Link'}
      </Button>
    </form>
  );
}
