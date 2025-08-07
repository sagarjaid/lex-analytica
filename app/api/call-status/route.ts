/** @format */

import { createServiceClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Call status webhook received:', JSON.stringify(body));
    
    const { 
      call_id, 
      status, 
      call_length,
      error_message,
      completed,
      end_at,
      started_at,
      corrected_duration,
      concatenated_transcript,
      disposition_tag,
      answered_by,
      call_ended_by,
      price,
      summary
    } = body;

    if (!call_id) {
      console.error('Missing call_id in webhook');
      return NextResponse.json(
        { error: 'Call ID is required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createServiceClient();

    // Update the call log with comprehensive call data
    const { error: updateError } = await supabase
      .from('call_logs')
      .update({
        status: status,
        duration_seconds: call_length,
        error_message: error_message,
        completed: completed,
        started_at: started_at,
        end_at: end_at,
        corrected_duration: corrected_duration,
        transcript: concatenated_transcript,
        disposition_tag: disposition_tag,
        answered_by: answered_by,
        call_ended_by: call_ended_by,
        call_cost: price,
        call_summary: summary,
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

    // Also update the goal's call status and duration
    const { error: goalUpdateError } = await supabase
      .from('goals')
      .update({
        last_call_status: status,
        last_call_duration: call_length,
        updated_at: new Date().toISOString(),
      })
      .eq('call_id', call_id);

    if (goalUpdateError) {
      console.error('Error updating goal call status:', goalUpdateError);
      // Don't fail the webhook if goal update fails, just log it
    }

    // Log additional call details if available
    if (completed !== undefined || end_at || started_at || corrected_duration) {
      console.log('Call completed with details:', {
        completed,
        end_at,
        started_at,
        corrected_duration,
        disposition_tag,
        answered_by,
        call_ended_by,
        price
      });
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