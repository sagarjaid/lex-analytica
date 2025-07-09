/** @format */

import { NextResponse } from 'next/server';
import { createCustomerPortal } from '@/lib/lemonsqueezy';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (!profile?.customer_id) {
        return NextResponse.json(
          {
            error:
              "You don't have a billing account yet. Make a purchase first.",
          },
          { status: 400 }
        );
      }

      const url = await createCustomerPortal({
        customerId: profile?.customer_id,
      });

      return NextResponse.json({
        url,
      });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: e?.message }, { status: 500 });
    }
  } else {
    // Not Signed in
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }
}
