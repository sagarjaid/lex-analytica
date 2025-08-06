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

    // Call the blondai endpoint directly
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/blandai`,
      {
        goal_id: goal.id,
        phoneNumber: goal.phone_number,
        task: `${goal.persona}: ${goal.context}`,
        language: goal.language,
        voice: goal.voice,
      }
    );

    return NextResponse.json({
      message: 'Test call initiated successfully',
      response: response.data,
    });
  } catch (error) {
    console.error('Error in test goal:', error);
    return NextResponse.json(
      { error: 'Failed to test goal' },
      { status: 500 }
    );
  }
} 