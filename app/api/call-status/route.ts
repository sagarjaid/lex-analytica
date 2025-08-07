/** @format */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Call status webhook received:', JSON.stringify(body, null, 2));
    
    const { 
      call_id, 
      status, 
      duration_seconds, 
      error_message,
      goal_id 
    } = body;

    if (!call_id) {
      console.error('Missing call_id in webhook');
      return NextResponse.json(
        { error: 'Call ID is required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient();

    // Update the call log with the status
    const { error: updateError } = await supabase
      .from('call_logs')
      .update({
        status: status,
        duration_seconds: duration_seconds,
        error_message: error_message,
        updated_at: new Date().toISOString(),
      })
      .eq('call_id', call_id);

    if (updateError) {
      console.error('Error updating call log:', updateError);
      return NextResponse.json(
        { error: 'Failed to update call log' },
        { status: 500 }
      );
    }

    // If the call was successful, update the goal status
    if (status === 'completed' && goal_id) {
      console.log('Updating goal status to active for goal_id:', goal_id);
      const { error: goalUpdateError } = await supabase
        .from('goals')
        .update({
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', goal_id);
      
      if (goalUpdateError) {
        console.error('Error updating goal status to active:', goalUpdateError);
      }
    }

    // If the call failed, update the goal status
    if (['failed', 'no_answer', 'busy'].includes(status) && goal_id) {
      console.log('Updating goal status to failed for goal_id:', goal_id);
      const { error: goalUpdateError } = await supabase
        .from('goals')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', goal_id);
      
      if (goalUpdateError) {
        console.error('Error updating goal status to failed:', goalUpdateError);
      }
    }

    return NextResponse.json({
      message: 'Call status updated successfully',
      call_id: call_id,
      status: status,
    });
  } catch (error) {
    console.error('Error updating call status:', error);
    return NextResponse.json(
      { error: 'Failed to update call status' },
      { status: 500 }
    );
  }
} 