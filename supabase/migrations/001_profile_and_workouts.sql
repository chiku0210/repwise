-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm DECIMAL(5, 2),
  current_weight_kg DECIMAL(5, 2),
  target_weight_kg DECIMAL(5, 2),
  experience_level TEXT DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  primary_goal TEXT CHECK (primary_goal IN ('strength', 'hypertrophy', 'endurance', 'general_fitness', 'weight_loss')),
  training_frequency INTEGER DEFAULT 3 CHECK (training_frequency >= 1 AND training_frequency <= 7),
  preferred_split TEXT CHECK (preferred_split IN ('ppl', 'upper_lower', 'full_body', 'custom')),
  weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lbs')),
  height_unit TEXT DEFAULT 'cm' CHECK (height_unit IN ('cm', 'ft_in')),
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weight Logs Table
CREATE TABLE IF NOT EXISTS weight_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5, 2) NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  CONSTRAINT weight_positive CHECK (weight_kg > 0)
);

-- Exercises Table (pre-populated with common exercises)
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('push', 'pull', 'legs', 'core', 'cardio', 'other')),
  muscle_groups TEXT[] NOT NULL,
  equipment TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_compound BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout Sessions Table
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_name TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  total_sets INTEGER DEFAULT 0,
  total_reps INTEGER DEFAULT 0,
  total_volume_kg DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  CONSTRAINT duration_positive CHECK (duration_minutes IS NULL OR duration_minutes >= 0)
);

-- Workout Exercises Table (exercises within a workout)
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  sets_completed INTEGER DEFAULT 0,
  target_sets INTEGER NOT NULL,
  notes TEXT,
  CONSTRAINT sets_positive CHECK (sets_completed >= 0 AND target_sets > 0)
);

-- Exercise Sets Table (individual sets within an exercise)
CREATE TABLE IF NOT EXISTS exercise_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_exercise_id UUID NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  reps INTEGER,
  weight_kg DECIMAL(6, 2),
  rest_seconds INTEGER,
  rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10), -- Rate of Perceived Exertion
  completed BOOLEAN DEFAULT false,
  CONSTRAINT reps_positive CHECK (reps IS NULL OR reps > 0),
  CONSTRAINT weight_positive CHECK (weight_kg IS NULL OR weight_kg >= 0)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_id ON weight_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_logs_logged_at ON weight_logs(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_completed_at ON workout_sessions(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_exercise_sets_workout_exercise_id ON exercise_sets(workout_exercise_id);

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Weight Logs Policies
CREATE POLICY "Users can view own weight logs" ON weight_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight logs" ON weight_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight logs" ON weight_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight logs" ON weight_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Exercises Policies (public read, admin write)
CREATE POLICY "Anyone can view exercises" ON exercises
  FOR SELECT USING (true);

-- Workout Sessions Policies
CREATE POLICY "Users can view own workout sessions" ON workout_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout sessions" ON workout_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout sessions" ON workout_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout sessions" ON workout_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Workout Exercises Policies
CREATE POLICY "Users can view own workout exercises" ON workout_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = workout_exercises.workout_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own workout exercises" ON workout_exercises
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = workout_exercises.workout_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workout exercises" ON workout_exercises
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = workout_exercises.workout_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own workout exercises" ON workout_exercises
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = workout_exercises.workout_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- Exercise Sets Policies
CREATE POLICY "Users can view own exercise sets" ON exercise_sets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workout_sessions ON workout_sessions.id = workout_exercises.workout_id
      WHERE workout_exercises.id = exercise_sets.workout_exercise_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own exercise sets" ON exercise_sets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workout_sessions ON workout_sessions.id = workout_exercises.workout_id
      WHERE workout_exercises.id = exercise_sets.workout_exercise_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own exercise sets" ON exercise_sets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workout_sessions ON workout_sessions.id = workout_exercises.workout_id
      WHERE workout_exercises.id = exercise_sets.workout_exercise_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own exercise sets" ON exercise_sets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workout_sessions ON workout_sessions.id = workout_exercises.workout_id
      WHERE workout_exercises.id = exercise_sets.workout_exercise_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some common exercises (starter data)
INSERT INTO exercises (name, category, muscle_groups, equipment, is_compound) VALUES
  ('Barbell Bench Press', 'push', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['barbell', 'bench'], true),
  ('Barbell Squat', 'legs', ARRAY['quads', 'glutes', 'hamstrings'], ARRAY['barbell', 'rack'], true),
  ('Conventional Deadlift', 'pull', ARRAY['back', 'glutes', 'hamstrings'], ARRAY['barbell'], true),
  ('Pull-ups', 'pull', ARRAY['back', 'biceps'], ARRAY['pull-up bar'], true),
  ('Overhead Press', 'push', ARRAY['shoulders', 'triceps'], ARRAY['barbell'], true),
  ('Barbell Row', 'pull', ARRAY['back', 'biceps'], ARRAY['barbell'], true),
  ('Dumbbell Bench Press', 'push', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['dumbbells', 'bench'], true),
  ('Romanian Deadlift', 'legs', ARRAY['hamstrings', 'glutes', 'back'], ARRAY['barbell'], true),
  ('Lat Pulldown', 'pull', ARRAY['back', 'biceps'], ARRAY['cable machine'], false),
  ('Leg Press', 'legs', ARRAY['quads', 'glutes'], ARRAY['leg press machine'], true),
  ('Dumbbell Shoulder Press', 'push', ARRAY['shoulders', 'triceps'], ARRAY['dumbbells'], false),
  ('Bicep Curls', 'pull', ARRAY['biceps'], ARRAY['dumbbells'], false),
  ('Tricep Dips', 'push', ARRAY['triceps', 'chest'], ARRAY['dip bars'], false),
  ('Leg Curl', 'legs', ARRAY['hamstrings'], ARRAY['leg curl machine'], false),
  ('Calf Raises', 'legs', ARRAY['calves'], ARRAY['calf raise machine'], false),
  ('Plank', 'core', ARRAY['abs', 'core'], ARRAY['bodyweight'], false),
  ('Hanging Leg Raises', 'core', ARRAY['abs'], ARRAY['pull-up bar'], false)
ON CONFLICT (name) DO NOTHING;
