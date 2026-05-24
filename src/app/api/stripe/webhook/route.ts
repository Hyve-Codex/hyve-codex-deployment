/**
 * STRIPE WEBHOOK SETUP
 * ─────────────────────────────────────────────────────────────
 * Local dev:
 *   stripe listen --forward-to localhost:3000/api/stripe/webhook
 *   Copy the webhook signing secret into .env.local as STRIPE_WEBHOOK_SECRET
 *
 * Production:
 *   Add your deployed URL + /api/stripe/webhook as an endpoint in the
 *   Stripe Dashboard → Developers → Webhooks
 * ─────────────────────────────────────────────────────────────
 */

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe/client'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function getPeriodEnd(subscription: Stripe.Subscription): string | null {
  const item = subscription.items?.data?.[0]
  if (!item?.current_period_end) return null
  return new Date(item.current_period_end * 1000).toISOString()
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      if (!userId || !session.subscription) break

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )

      await supabaseAdmin
        .from('subscriptions')
        .update({
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          status: 'active',
          plan: 'full_codex',
          current_period_end: getPeriodEnd(subscription),
        })
        .eq('user_id', userId)
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const status = subscription.status === 'active' ? 'active'
        : subscription.status === 'canceled' ? 'canceled'
        : subscription.status === 'past_due' ? 'past_due'
        : 'inactive'

      await supabaseAdmin
        .from('subscriptions')
        .update({
          status,
          current_period_end: getPeriodEnd(subscription),
        })
        .eq('stripe_subscription_id', subscription.id)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'canceled', plan: 'trial' })
        .eq('stripe_subscription_id', subscription.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
