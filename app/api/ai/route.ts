/** @format */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  // Set cache control headers to prevent caching
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');

  return NextResponse.json(
    { message: 'API endpoint is working' },
    { status: 200, headers }
  );
}

export async function POST(req: Request) {
  // Set cache control headers to prevent caching
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');

  let body: any;
  try {
    // Handle different content types for cron job compatibility
    const contentType = req.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      body = await req.json();
    } else {
      // For cron jobs that might send form data or other formats
      const text = await req.text();
      try {
        body = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse request body:', parseError);
        return NextResponse.json(
          { error: 'Invalid JSON in request body' },
          { status: 400, headers }
        );
      }
    }

    const { goal_id, phoneNumber, task, language, voice } = body;

    console.log('Received request:', { goal_id, phoneNumber, task, language, voice });

    if (!goal_id) {
      console.error('Missing goal_id in request');
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400, headers }
      );
    }

    // Validate goal_id format
    if (typeof goal_id !== 'string' || goal_id.trim() === '') {
      console.error('Invalid goal_id format:', goal_id);
      return NextResponse.json(
        { error: 'Invalid Goal ID format' },
        { status: 400, headers }
      );
    }

    // Initialize Supabase client
    const supabase = createClient();

    // Get the goal details with proper headers
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('*')
      .eq('id', goal_id.trim())
      .single();

    if (goalError) {
      console.error('Supabase error fetching goal:', goalError);
      return NextResponse.json({ error: 'Goal not found' }, { status: 404, headers });
    }

    if (!goal) {
      console.error('Goal not found for ID:', goal_id);
      return NextResponse.json({ error: 'Goal not found' }, { status: 404, headers });
    }

    console.log('Found goal:', { id: goal.id, title: goal.title, is_active: goal.is_active });

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
        { status: 200, headers }
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

    console.log('Making Bland AI call with:', {
      phone_number: goal.phone_number,
      task: taskDescription,
      voice_id: voiceId,
      language: language || 'English'
    });

    // Validate Bland AI credentials
    if (!process.env.NEXT_PUBLIC_BLOND_AUTH) {
      console.error('Missing BLAND_AUTH environment variable');
      return NextResponse.json(
        { error: 'Bland AI configuration error' },
        { status: 500, headers }
      );
    }

    // Make call using Bland AI
    const response = await axios.post(
      'https://api.bland.ai/v1/calls',
      {
        phone_number: goal.phone_number,
        task: taskDescription,
        voice_id: voiceId,
        language: language || 'English',
        webhook_url: "https://nevermissai.com/api/call-status",
        reduce_latency: true,
        model: 'nova-2',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BLOND_AUTH}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log('Bland AI response:', response.data);

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
    }, { headers });
  } catch (error) {
    console.error('Error making call:', error);
    
    // Log the error
    try {
      const supabase = createClient();
      const { goal_id } = body || {};
      
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

    return NextResponse.json({ error: 'Failed to make call' }, { status: 500, headers });
  }
}
