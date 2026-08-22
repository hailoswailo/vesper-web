'use client';

import { useEffect, useState } from 'react';

import { Body, Display, Eyebrow } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

export default function Pending() {
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data }) => {
      const email = data.session?.user.email;
      if (!email) return;
      const { data: applications } = await supabase
        .from('applications')
        .select('name')
        .eq('email', email.toLowerCase())
        .order('submitted_at', { ascending: false })
        .limit(1);
      const name = applications?.[0]?.name as string | undefined;
      if (name) setFirstName(name.split(' ')[0]);
    });
  }, []);

  return (
    <section className="max-w-md mx-auto px-6 py-24">
      <Eyebrow>Application received</Eyebrow>
      <Display className="mb-6">{firstName ? `Thank you, ${firstName}.` : 'Thank you.'}</Display>
      <Body>
        Someone reads every application by hand. If it&rsquo;s a fit, you&rsquo;ll hear back soon —
        this isn&rsquo;t automatic, so it may take a few days.
      </Body>
    </section>
  );
}
