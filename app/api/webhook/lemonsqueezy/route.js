/** @format */

import config from '@/config';
import { SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// This is where we receive Lemon Squeezy webhook events
// It used to update the user data, send emails, etc...
// By default, it'll store the user in the database
// See more: https://shipfa.st/docs/features/payments
export async function POST(req) {
  const text = await req.text();

  const hmac = crypto.createHmac(
    'sha256',
    process.env.LEMONSQUEEZY_SIGNING_SECRET
  );
  const digest = Buffer.from(hmac.update(text).digest('hex'), 'utf8');
  const signature = Buffer.from(headers().get('x-signature'), 'utf8');

  // Verify the signature
  if (!crypto.timingSafeEqual(digest, signature)) {
    return new Response('Invalid signature.', {
      status: 400,
    });
  }

  // Create a private supabase client using the secret service_role API key
  const supabase = new SupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Get the payload
  const payload = JSON.parse(text);

  const eventName = payload.meta.event_name;
  const customerId = payload.data.attributes.customer_id.toString();

  try {
    switch (eventName) {
      case 'order_created': {
        // ✅ Grant access to the product
        const userId = payload.meta?.custom_data?.userId;
        const email = payload.data.attributes.user_email;
        const variantId =
          payload.data.attributes.first_order_item.variant_id.toString();
        const plan = config.lemonsqueezy.plans.find(
          (p) => p.variantId === variantId
        );

        if (!plan) break;

        let user;
        if (!userId) {
          // check if user already exists
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();
          if (profile) {
            user = profile;
          } else {
            // create a new user using supabase auth admin
            const { data } = await supabase.auth.admin.createUser({
              email,
            });

            user = data?.user;
          }
        } else {
          // find user by ID
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          user = profile;
        }

        await supabase
          .from('profiles')
          .update({
            customer_id: customerId,
            variant_id: variantId,
            has_access: true,
          })
          .eq('id', user?.id);

        // Extra: send email with user link, product page, etc...
        // try {
        //   await sendEmail(...);
        // } catch (e) {
        //   console.error("Email issue:" + e?.message);
        // }

        break;
      }

      case 'subscription_cancelled': {
        // The customer subscription stopped
        // ❌ Revoke access to the product

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('customer_id', customerId)
          .single();

        // Revoke access to your product
        await supabase
          .from('profiles')
          .update({
            has_access: false,
          })
          .eq('id', profile?.id);

        break;
      }

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error('lemonsqueezy error: ', e.message);
  }

  return NextResponse.json({});
}
