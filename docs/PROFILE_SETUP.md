# Profile & Workout Setup Guide

This guide walks you through setting up the database tables for the professional profile and workout logging features.

## Prerequisites

- Supabase project created and configured
- Environment variables set up (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## Database Setup

### Option 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Copy the entire contents of `supabase/migrations/001_profile_and_workouts.sql`
   - Paste it into the SQL editor
   - Click "Run" or press `Ctrl/Cmd + Enter`

4. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see these tables:
     - `user_profiles`
     - `weight_logs`
     - `exercises`
     - `workout_sessions`
     - `workout_exercises`
     - `exercise_sets`

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

## What Gets Created

### Tables

1. **user_profiles** - User fitness profile and preferences
   - Personal info (name, age, gender, height, weight)
   - Fitness goals and experience level
   - Unit preferences (kg/lbs, cm/ft-in)

2. **weight_logs** - Track weight over time
   - Weight entries with timestamps
   - Optional notes

3. **exercises** - Exercise library (pre-populated with 17 common exercises)
   - Name, category, muscle groups
   - Equipment required
   - Compound vs isolation flag

4. **workout_sessions** - Individual workout sessions
   - Workout name and timestamps
   - Duration, total sets/reps/volume
   - Notes

5. **workout_exercises** - Exercises within a workout
   - Links exercises to workout sessions
   - Tracks sets completed vs target

6. **exercise_sets** - Individual sets
   - Reps, weight, rest time
   - RPE (Rate of Perceived Exertion)
   - Completion status

### Security (RLS Policies)

All tables have Row Level Security enabled:
- Users can only access their own data
- Exercises table is publicly readable (common library)
- Admin-only write access for exercises (can be customized later)

### Indexes

Performance indexes created for:
- User lookups
- Date-based queries (workout history, weight logs)
- Relational joins

## Verification

After running the migration, verify everything works:

1. **Test Profile Creation**
   - Run the app: `npm run dev --webpack`
   - Login with your account
   - Go to Profile → Edit
   - Fill in your details and save

2. **Check Database**
   - Go to Supabase Dashboard → Table Editor
   - Click on `user_profiles`
   - You should see your profile entry

3. **Test Exercises**
   - In Table Editor, click on `exercises`
   - You should see 17 pre-populated exercises

## Troubleshooting

### Error: "relation already exists"
- Some tables might already exist from previous runs
- Either drop them manually or the migration will skip them (using `IF NOT EXISTS`)

### Error: "permission denied"
- Make sure you're running the SQL as the project owner
- Check that RLS is properly configured

### Profile not saving
- Check browser console for errors
- Verify RLS policies are active
- Ensure user is authenticated

## Next Steps

After database setup:

1. **Test the Profile Flow**
   - Edit your profile with real data
   - Verify stats calculations (BMI, etc.)

2. **Start Building Workout Logging**
   - The tables are ready for workout tracking
   - Next PR will add workout logging UI

3. **Optional: Add More Exercises**
   - Go to `exercises` table in Supabase
   - Manually add exercises specific to your routine

## Schema Diagram

```
auth.users (Supabase Auth)
    |
    ├─> user_profiles (1:1)
    ├─> weight_logs (1:many)
    └─> workout_sessions (1:many)
            |
            └─> workout_exercises (1:many)
                    |
                    ├─> exercises (many:1)
                    └─> exercise_sets (1:many)
```

## Support

If you encounter issues:
1. Check Supabase logs in Dashboard → Logs
2. Verify environment variables are correct
3. Ensure you're using `--webpack` flag in npm scripts
