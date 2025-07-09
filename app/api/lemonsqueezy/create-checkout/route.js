/** @format */

import { createLemonSqueezyCheckout } from '@/lib/lemonsqueezy';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// This function is used to create a Lemon Squeezy Checkout Session (one-time payment or subscription)
// It's called by the <ButtonCheckout /> component
// By default, it doesn't force users to be authenticated. But if they are, it will prefill the Checkout data with their email and/or credit card
export async function POST(req) {
  const body = await req.json();

  if (!body.variantId) {
    return NextResponse.json(
      { error: 'Variant ID is required' },
      { status: 400 }
    );
  } else if (!body.redirectUrl) {
    return NextResponse.json(
      { error: 'Redirect URL is required' },
      { status: 400 }
    );
  }

  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { variantId, redirectUrl } = body;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();

    const checkoutURL = await createLemonSqueezyCheckout({
      variantId,
      redirectUrl,
      // If user is logged in, this will automatically prefill Checkout data like email and/or credit card for faster checkout
      userId: profile?.id,
      email: profile?.email,
      // If you send coupons from the frontend, you can pass it here
      // discountCode: body.discountCode,
    });

    return NextResponse.json({ url: checkoutURL });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
