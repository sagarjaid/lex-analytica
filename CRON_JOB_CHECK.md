# Cron Job Check Functionality

This document explains the new cron job checking functionality that ensures all active goals have a valid next execution date.

## Overview

The system now automatically checks if active goals have a valid next execution date by querying the cron-job.org API. 
- **One-time goals** without a next execution date are automatically paused (switch turned off)
- **Recurring goals** without a next execution date have their `next_execution_at` field updated to null but remain active

## Features

### 1. Automatic Cron Job Checking
- **API Route**: `/api/check-cron-jobs`
- **Method**: POST
- **Functionality**: 
  - Fetches all active goals with cron_job_id
  - Queries cron-job.org API for each goal's status
  - **One-time goals**: Pauses goals that don't have a next execution date (via switch)
  - **Recurring goals**: Updates next_execution_at to null but keeps goal active
  - Updates the database accordingly

### 2. Automatic Execution
- **Trigger**: Automatically runs when the goals page loads
- **Functionality**: Checks all active goals without user interaction
- **Process**: Runs in the background after goals are fetched

### 3. Visual Indicators
- **Next Execution Info**: Shows when the next execution will occur
- **Warning Indicators**: Red alerts for goals without next execution dates
- **Status Updates**: Real-time status updates in the UI

## Database Changes

### Migration: `20250108000003_add_next_execution_index.sql`
- Adds indexes for better performance on `next_execution_at` queries
- Composite index for active goals with next execution date

### Existing Column
The `next_execution_at` column already exists in the goals table (added in migration `20240320000002_update_goals_and_call_logs.sql`).

## How It Works

1. **Page Load**: When the goals page loads, it automatically fetches goals and then runs the cron job check
2. **Automatic Check**: The cron job check runs automatically for all active goals without user interaction
3. **API Call**: The check makes a POST request to `/api/check-cron-jobs`
4. **Goal Processing**: For each active goal:
   - Fetches cron job details from cron-job.org API
   - Checks if `nextRunTime` exists and is valid
   - **One-time goals without execution date**: Automatically pauses the cron job and updates the goal status to 'paused' (no user confirmation needed)
   - **Recurring goals without execution date**: Only updates the `next_execution_at` field to null (keeps goal active)
   - **Goals with execution date**: Updates the local `next_execution_at` field
5. **UI Update**: Goals list is automatically refreshed to show current state

## API Response Format

```json
{
  "message": "Cron job check completed",
  "updatedGoals": ["goal-id-1", "goal-id-2"],
  "failedGoals": ["goal-id-3"],
  "totalChecked": 5
}
```

## Error Handling

- **API Failures**: Goals that fail to be processed are logged and returned in `failedGoals`
- **Network Issues**: Errors are logged to console and don't block the UI
- **Database Errors**: Failed database updates are logged and tracked

## Usage

### Automatic Check
The check runs automatically when:
- Goals page loads (after goals are fetched)
- After creating a new goal
- After toggling goal status

**Note**: The cron job check is completely automatic and requires no user interaction.

## Environment Variables Required

- `NEXT_PUBLIC_CORN_AUTH`: Cron-job.org API authentication token

## Monitoring

The system logs all activities:
- Goals that are paused due to missing next execution dates
- API failures and errors
- Database update results

Check the browser console and server logs for detailed information about the cron job checking process.
