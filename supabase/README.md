# Supabase Setup

## Running Migrations

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/cwvxlnzuyndjtghohbq
2. Navigate to the SQL Editor
3. Copy the contents of `migrations/20250128_initial_schema.sql`
4. Paste and run the SQL

## Database Schema

The migration creates the following tables:
- `profiles` - User profiles (extends auth.users)
- `badges` - Achievement badges
- `user_badges` - User badge assignments
- `vibes` - Video posts
- `circles` - Interest-based groups
- `circle_members` - Circle memberships
- `connections` - Friend connections
- `messages` - Direct messages
- `events` - Social events
- `event_attendees` - Event RSVPs
- `notifications` - User notifications
- `vibe_comments` - Comments on vibes

## Row Level Security (RLS)

All tables have RLS enabled with appropriate policies for:
- Public read access where appropriate
- User-specific write access
- Privacy controls for private content
