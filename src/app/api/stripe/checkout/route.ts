import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'
import { STRIPE_CONFIG } from '@/lib/stripe/config'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: STRIPE_CONFIG.priceId, quantity: 1 }],
      success_url: STRIPE_CONFIG.successUrl,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      allow_promotion_codes: true,
      metadata: { user_id: user.id },
    }

    if (subscription?.stripe_customer_id) {
      sessionParams.customer = subscription.stripe_customer_id
    } else {
      sessionParams.customer_email = user.email
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
