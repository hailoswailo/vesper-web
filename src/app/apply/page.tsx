'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

import { SignInForm } from '@/components/sign-in-form';
import { Body, Button, Card, Display, Eyebrow, Input, Textarea } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

export default function Apply() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null | undefined>(undefined); // undefined = still checking
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [reason, setReason] = useState('');
  const [school, setSchool] = useState('');
  const [chiefAim, setChiefAim] = useState('');
  const [givesBack, setGivesBack] = useState('');
  const [boards, setBoards] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => setSession(newSession));
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user.email || !name.trim() || !reason.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const email = session.user.email.toLowerCase();
      const { error } = await supabase.from('applications').insert({
        id: crypto.randomUUID(),
        email,
        name: name.trim(),
        city: city.trim(),
        occupation: occupation.trim(),
        reason: reason.trim(),
        school: school.trim() || null,
        chief_aim: chiefAim.trim() || null,
        gives_back: givesBack.trim() || null,
        boards_and_affiliations: boards.trim() || null,
        // status/is_admin are placeholders — the applications_auto_approve
        // trigger always overwrites both server-side, same as the native app.
        status: 'pending',
        is_admin: false,
        submitted_at: new Date().toISOString(),
      });
      if (error) throw error;
      router.push('/pending');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong submitting your application. Try again.');
    } finally {
      setSaving(false);
    }
  }

  if (session === undefined) {
    return null;
  }

  if (!session) {
    return (
      <section className="max-w-md mx-auto px-6 py-20">
        <Eyebrow>Vesper</Eyebrow>
        <Display className="mb-4">Life after six.</Display>
        <Body className="mb-10">
          Vesper is invite-only. Sign in to begin your application — every application is read by a
          person, not a bot.
        </Body>
        <SignInForm next="/apply" />
      </section>
    );
  }

  return (
    <section className="max-w-xl mx-auto px-6 py-20">
      <Eyebrow>Vesper</Eyebrow>
      <Display className="mb-4">Tell us who you are.</Display>
      <Body className="mb-2">Applying as {session.user.email}.</Body>
      <Body className="mb-10 text-smoked-oak">Every application is read by a person, not a bot.</Body>

      <Card>
        <form onSubmit={handleSubmit}>
          <Input label="Full name" placeholder="James Arnholt" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="City" placeholder="Nashville, TN" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input label="Occupation" placeholder="What you do" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
          <Textarea
            label="Why Vesper?"
            placeholder="A couple sentences on why you want in"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            required
          />
          <Input label="School" placeholder="Where you went to school" value={school} onChange={(e) => setSchool(e.target.value)} />
          <Textarea
            label="Chief Definite Aim"
            placeholder="The one overarching aim you're building your life around"
            value={chiefAim}
            onChange={(e) => setChiefAim(e.target.value)}
            rows={2}
          />
          <Textarea
            label="How you give back"
            placeholder="A cause you support, or how you give back"
            value={givesBack}
            onChange={(e) => setGivesBack(e.target.value)}
            rows={2}
          />
          <Textarea
            label="Boards & affiliations"
            placeholder="Boards, advisory roles, notable affiliations"
            value={boards}
            onChange={(e) => setBoards(e.target.value)}
            rows={2}
          />
          {error && <p className="font-body text-sm text-error mb-4">{error}</p>}
          <Button type="submit" disabled={!name.trim() || !reason.trim() || saving}>
            {saving ? 'Submitting…' : 'Submit Application'}
          </Button>
        </form>
      </Card>
    </section>
  );
}
