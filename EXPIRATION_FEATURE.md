# Goal Expiration Feature

This document describes the implementation of the goal expiration feature that allows goals to automatically expire after a specified time.

## Overview

The expiration feature ensures that:
- One-time jobs expire 24 hours after their scheduled execution time
- Recurring jobs can have custom expiration dates set by users
- Expired goals are automatically marked as inactive and their status is updated to 'expired'
- The cron-job.org API is notified to disable expired jobs

## Database Changes

### New Migration: `20240320000004_add_expires_at.sql`

- Added `expires_at` column to the `goals` table (TIMESTAMP WITH TIME ZONE)
- Created index on `expires_at` for better performance
- Added trigger function `check_goal_expiration()` to automatically mark goals as expired
- Added trigger `trigger_check_goal_expiration` to run on insert/update

### Schema Updates

```sql
-- Goals table now includes:
expires_at TIMESTAMP WITH TIME ZONE

-- Status values include:
'created', 'active', 'paused', 'completed', 'failed', 'expired'
```

## Implementation Details

### One-time Jobs

- **Expiration Logic**: One-time jobs automatically expire 6 hours after their scheduled execution time
- **Purpose**: Ensures jobs expire after execution or if they fail to execute, preventing them from remaining active indefinitely
- **Database**: `expires_at` is set to execution time + 6 hours
- **Cron-job.org**: `expiresAt` is set to the actual execution time

### Recurring Jobs

- **Expiration Logic**: Users can optionally set a custom expiration date/time
- **Purpose**: Allows users to create temporary recurring reminders
- **Database**: `expires_at` is set to user-specified date/time (if provided)
- **Cron-job.org**: `expiresAt` uses the same user-specified date/time

### Automatic Expiration Handling

The system includes several mechanisms to handle expired goals:

1. **Database Trigger**: Automatically marks goals as expired when `expires_at` is reached
2. **API Endpoint**: `/api/check-expired-goals` can be called periodically to check for expired goals
3. **Utility Functions**: Helper functions in `lib/goal-utils.ts` for managing expiration

## API Endpoints

### `/api/check-expired-goals`

- **Method**: POST/GET
- **Purpose**: Check and update expired goals
- **Authentication**: Optional secret token via `EXPIRED_GOALS_SECRET` environment variable
- **Actions**:
  - Finds goals where `expires_at` has passed and `is_active` is true
  - Updates status to 'expired' and sets `is_active` to false
  - Disables corresponding cron jobs on cron-job.org

## UI Updates

### Add Goal Page (`app/dash/add/page.tsx`)

- **One-time Jobs**: Shows expiration preview (24 hours after execution)
- **Recurring Jobs**: Shows expiration preview if custom date is set
- **Schedule Preview**: Updated to include expiration information

### Goals List Page (`app/dash/goals/page.tsx`)

- **Expiration Display**: Shows time until expiration or "Expired" status
- **Visual Indicators**: 
  - Green clock icon for normal expiration times
  - Orange clock icon for expiring soon (≤1 day)
  - Red alert triangle for expired or expiring very soon
- **Expanded Details**: Shows exact expiration date/time

## Utility Functions

### `lib/goal-utils.ts`

- `checkAndUpdateExpiredGoals()`: Main function to process expired goals
- `getGoalsExpiringSoon()`: Find goals expiring within 24 hours
- `formatExpirationDate()`: Format expiration date for display
- `isGoalExpired()`: Check if a goal is expired
- `getTimeUntilExpiration()`: Get human-readable time until expiration

## Environment Variables

```env
# Optional: Secret token for the check-expired-goals API endpoint
EXPIRED_GOALS_SECRET=your-secret-token-here
```

## Usage Examples

### Setting up a cron job to check expired goals

You can set up a cron job to call the API endpoint periodically:

```bash
# Check every hour
0 * * * * curl -X POST https://your-domain.com/api/check-expired-goals \
  -H "Authorization: Bearer your-secret-token"
```

### Manual check via API

```bash
curl -X POST https://your-domain.com/api/check-expired-goals \
  -H "Authorization: Bearer your-secret-token"
```

## TypeScript Types

### Updated Goal Interface

```typescript
interface Goal {
  // ... existing fields
  expires_at?: string;
  status: 'created' | 'active' | 'paused' | 'completed' | 'failed' | 'expired';
}
```

## Testing

1. **One-time Job Expiration**: Create a one-time job and verify it shows expiration 24 hours after execution time
2. **Recurring Job Expiration**: Create a recurring job with custom expiration and verify it shows the correct expiration time
3. **API Endpoint**: Test the `/api/check-expired-goals` endpoint with and without authentication
4. **Database Trigger**: Verify that goals are automatically marked as expired when `expires_at` is reached

## Future Enhancements

- Email notifications for goals about to expire
- Bulk operations for expired goals
- Custom expiration rules (e.g., expire after N executions)
- Expiration templates for common use cases 