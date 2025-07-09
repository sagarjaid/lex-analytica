/** @format */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { goal_id } = await req.json();

    if (!goal_id) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient();

    // Get the goal details
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('*')
      .eq('id', goal_id)
      .single();

    if (goalError || !goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    if (!goal.is_active) {
      return NextResponse.json(
        { message: 'Goal is inactive' },
        { status: 200 }
      );
    }

    // Get user profile to get phone number
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('phone_number')
      .eq('id', goal.user_id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Make call using Bland AI
    const response = await axios.post(
      'https://api.bland.ai/v1/calls',
      {
        phone_number: profile.phone_number,
        task: `Reminder: ${goal.title}. ${goal.description || ''}`,
        voice_id: 'male-1', // You can customize this
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/call-status`, // Optional: to track call status
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BLOND_AUTH}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Log the call attempt
    await supabase.from('call_logs').insert({
      goal_id: goal.id,
      user_id: goal.user_id,
      call_id: response.data.call_id,
      status: 'initiated',
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      message: 'Call initiated successfully',
      call_id: response.data.call_id,
    });
  } catch (error) {
    console.error('Error making call:', error);
    return NextResponse.json({ error: 'Failed to make call' }, { status: 500 });
  }
}
