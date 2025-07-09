/** @format */

import { NextResponse } from 'next/server';
import axios from 'axios';

// Export a named function for handling POST requests
export async function POST(request: Request) {
  try {
    // Disable caching
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store');

    // Parse the request body
    const body = await request.json();

    console.log(body, 'body');

    // Validate required fields
    if (!body.phoneNumber || !body.task) {
      // Return an error if the required fields are missing
      console.log('400 got called');
      return NextResponse.json(
        { error: 'Missing required fields: phone_number, task' },
        { status: 400 }
      );
    }

    // Define the headers for the API call
    const apiHeaders = {
      Authorization: process.env.NEXT_PUBLIC_BLOND_AUTH,
    };

    // Create the data object for the API call based on the received body
    const data: Record<string, any> = {
      phone_number: body.phoneNumber,
      from: null,
      task: body.task,
      model: 'enhanced',
      language: body.language === 'English' ? 'en' : 'en',
      voice: body.voice === 'Male' ? 'matt' : 'matt',
      voice_settings: {},
      pathway_id: null,
      local_dialing: false,
      max_duration: '4',
      answered_by_enabled: false,
      wait_for_greeting: false,
      record: false,
      amd: false,
      interruption_threshold: 100,
      voicemail_message: null,
      background_track: 'none',
      voicemail_action: 'hangup',
      temperature: null,
      transfer_phone_number: null,
      transfer_list: {},
      metadata: null,
      pronunciation_guide: [],
      start_time: null,
      request_data: {},
      tools: [],
      dynamic_data: [],
      analysis_preset: null,
      analysis_schema: {},
      webhook: null,
      calendly: {},
    };

    // Send the POST request to the external API
    const response = await axios.post(
      'https://us.api.bland.ai/v1/calls',
      data,
      { headers: apiHeaders }
    );

    console.log('Call placed successfully', response.data);

    // Return the response from the external API as JSON
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error making the API call:', error);
    // Return error details as JSON with status 500
    return NextResponse.json(
      { error: 'Failed to make the API call', details: error.message },
      { status: 500 }
    );
  }
}
