import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err instanceof Error ? err.message : err}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = (session.client_reference_id ?? session.customer_details?.email)?.toLowerCase();
      if (!email || typeof session.customer !== 'string' || typeof session.subscription !== 'string') break;

      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      const interval = subscription.items.data[0]?.price.recurring?.interval ?? null;

      await supabase
        .from('profiles')
        .update({
          stripe_customer_id: session.customer,
          subscription_status: subscription.status,
          subscription_interval: interval,
        })
        .eq('id', email);
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      if (typeof subscription.customer !== 'string') break;
      const interval = subscription.items.data[0]?.price.recurring?.interval ?? null;

      await supabase
        .from('profiles')
        .update({
          subscription_status: event.type === 'customer.subscription.deleted' ? 'canceled' : subscription.status,
          subscription_interval: interval,
        })
        .eq('stripe_customer_id', subscription.customer);
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
