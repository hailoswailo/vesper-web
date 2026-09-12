'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

import { SignInForm } from '@/components/sign-in-form';
import { Body, Button, Card, Display, Eyebrow, Heading } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

type ProfileState = { exists: boolean; subscriptionStatus: string | null } | undefined; // undefined = still checking

export default function Membership() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [profile, setProfile] = useState<ProfileState>(undefined);
  const [checkingOut, setCheckingOut] = useState<'month' | 'year' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => setSession(newSession));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user.email) return; // not signed in (or still checking) — nothing to fetch, "profile" isn't read on that render path
    const supabase = createClient();
    supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', session.user.email.toLowerCase())
      .maybeSingle()
      .then(({ data }) => setProfile({ exists: !!data, subscriptionStatus: (data?.subscription_status as string | null) ?? null }));
  }, [session]);

  async function handleCheckout(interval: 'month' | 'year') {
    if (!session?.user.email || checkingOut) return;
    setCheckingOut(interval);
    setError(null);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval, email: session.user.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong starting checkout.');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong starting checkout.');
      setCheckingOut(null);
    }
  }

  if (session === undefined || (session && profile === undefined)) {
    return null;
  }

  if (!session) {
    return (
      <section className="max-w-md mx-auto px-6 py-20">
        <Eyebrow>Membership</Eyebrow>
        <Display className="mb-4">Sign in to continue.</Display>
        <Body className="mb-10">Membership is for approved members. Sign in with the email you applied with.</Body>
        <SignInForm next="/membership" />
      </section>
    );
  }

  if (!profile?.exists) {
    return (
      <section className="max-w-md mx-auto px-6 py-20">
        <Eyebrow>Membership</Eyebrow>
        <Display className="mb-6">Not approved yet.</Display>
        <Body className="mb-10">
          Membership dues are for approved members. If you haven&rsquo;t applied yet, start there.
        </Body>
        <Button href="/apply">Apply</Button>
      </section>
    );
  }

  if (profile.subscriptionStatus === 'active') {
    return (
      <section className="max-w-md mx-auto px-6 py-20">
        <Eyebrow>Membership</Eyebrow>
        <Display className="mb-6">You&rsquo;re a member.</Display>
        <Body>Your dues are active. See you at the next gathering.</Body>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <Eyebrow>Membership</Eyebrow>
      <Display className="mb-6">Dues.</Display>
      <Body className="mb-12 max-w-xl">
        Membership keeps Vesper small, funded, and worth showing up to — including the weekly
        gathering.
      </Body>

      {error && <p className="font-body text-sm text-error mb-6">{error}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <Heading className="mb-1">Annual</Heading>
          <p className="font-display text-3xl text-brass mb-4">$2,000 / year</p>
          <Body className="mb-6">Billed once a year.</Body>
          <Button onClick={() => handleCheckout('year')} disabled={checkingOut !== null} className="w-full">
            {checkingOut === 'year' ? 'Redirecting…' : 'Choose Annual'}
          </Button>
        </Card>
        <Card>
          <Heading className="mb-1">Monthly</Heading>
          <p className="font-display text-3xl text-brass mb-4">$200 / month</p>
          <Body className="mb-6">Billed every month.</Body>
          <Button onClick={() => handleCheckout('month')} disabled={checkingOut !== null} variant="ghost" className="w-full">
            {checkingOut === 'month' ? 'Redirecting…' : 'Choose Monthly'}
          </Button>
        </Card>
      </div>
    </section>
  );
}
