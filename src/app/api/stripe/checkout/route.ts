import { NextResponse } from 'next/server';

import { getStripe } from '@/lib/stripe';

const PRICE_IDS: Record<'month' | 'year', string | undefined> = {
  month: process.env.STRIPE_PRICE_ID_MONTHLY,
  year: process.env.STRIPE_PRICE_ID_ANNUAL,
};

export async function POST(request: Request) {
  const { interval, email } = (await request.json()) as { interval?: string; email?: string };

  if (interval !== 'month' && interval !== 'year') {
    return NextResponse.json({ error: 'Invalid billing interval.' }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: 'Missing email.' }, { status: 400 });
  }

  const priceId = PRICE_IDS[interval];
  if (!priceId) {
    return NextResponse.json({ error: `Stripe price for "${interval}" isn't configured yet.` }, { status: 500 });
  }

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email.toLowerCase(),
      client_reference_id: email.toLowerCase(),
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/membership/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/membership`,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe did not return a checkout URL.' }, { status: 500 });
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Checkout failed.' }, { status: 500 });
  }
}
