/** @format */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
    const { goal_id, phoneNumber, task, language, voice } = body;

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
      // Log that the goal is inactive
      await supabase.from('call_logs').insert({
        goal_id: goal.id,
        user_id: goal.user_id,
        call_id: `inactive-${Date.now()}`,
        status: 'cancelled',
        goal_title: goal.title,
        phone_number: goal.phone_number,
        error_message: 'Goal is inactive',
        created_at: new Date().toISOString(),
      });

      return NextResponse.json(
        { message: 'Goal is inactive' },
        { status: 200 }
      );
    }

    // Update goal execution count and last executed time
    await supabase
      .from('goals')
      .update({
        execution_count: (goal.execution_count || 0) + 1,
        last_executed_at: new Date().toISOString(),
      })
      .eq('id', goal.id);

    // Determine voice ID based on selection
    const voiceId = voice === 'Female' ? 'female-1' : 'male-1';

    // Create the task description
    const taskDescription = `${goal.persona || 'AI Assistant'}: ${goal.context || task}`;

    // Make call using Bland AI
    const response = await axios.post(
      'https://api.bland.ai/v1/calls',
      {
        phone_number: goal.phone_number,
        task: taskDescription,
        voice_id: voiceId,
        language: language || 'English',
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/call-status`,
        reduce_latency: true,
        model: 'nova-2',
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
      goal_title: goal.title,
      phone_number: goal.phone_number,
      execution_time: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      message: 'Call initiated successfully',
      call_id: response.data.call_id,
      goal_id: goal.id,
    });
  } catch (error) {
    console.error('Error making call:', error);
    
    // Log the error
    try {
      const supabase = createClient();
      const { goal_id } = body;
      
      if (goal_id) {
        const { data: goal } = await supabase
          .from('goals')
          .select('user_id, title, phone_number')
          .eq('id', goal_id)
          .single();

        if (goal) {
          await supabase.from('call_logs').insert({
            goal_id: goal_id,
            user_id: goal.user_id,
            call_id: `error-${Date.now()}`,
            status: 'failed',
            goal_title: goal.title,
            phone_number: goal.phone_number,
            error_message: error instanceof Error ? error.message : 'Unknown error',
            created_at: new Date().toISOString(),
          });
        }
      }
    } catch (logError) {
      console.error('Error logging call failure:', logError);
    }

    return NextResponse.json({ error: 'Failed to make call' }, { status: 500 });
  }
}
