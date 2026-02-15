-- Migration: Add missing columns for workout player (Phase 1C)
-- Tables already exist, this migration only adds missing columns

-- Add template_id, created_at, updated_at to workout_sessions
ALTER TABLE workout_sessions 
  ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Add completed flag to workout_exercises
ALTER TABLE workout_exercises
  ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE;

-- Add notes column to exercise_sets
ALTER TABLE exercise_sets
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workout_sessions_template_id ON workout_sessions(template_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_started_at ON workout_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_exercise_sets_workout_exercise_id ON exercise_sets(workout_exercise_id);

-- Enable RLS
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workout_sessions
DROP POLICY IF EXISTS "Users can view their own workout sessions" ON workout_sessions;
DROP POLICY IF EXISTS "Users can create their own workout sessions" ON workout_sessions;
DROP POLICY IF EXISTS "Users can update their own workout sessions" ON workout_sessions;
DROP POLICY IF EXISTS "Users can delete their own workout sessions" ON workout_sessions;

CREATE POLICY "Users can view their own workout sessions"
  ON workout_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workout sessions"
  ON workout_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions"
  ON workout_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout sessions"
  ON workout_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for workout_exercises
DROP POLICY IF EXISTS "Users can view workout exercises for their sessions" ON workout_exercises;
DROP POLICY IF EXISTS "Users can create workout exercises for their sessions" ON workout_exercises;
DROP POLICY IF EXISTS "Users can update workout exercises for their sessions" ON workout_exercises;
DROP POLICY IF EXISTS "Users can delete workout exercises for their sessions" ON workout_exercises;

CREATE POLICY "Users can view workout exercises for their sessions"
  ON workout_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = workout_exercises.workout_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create workout exercises for their sessions"
  ON workout_exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = workout_exercises.workout_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update workout exercises for their sessions"
  ON workout_exercises FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = workout_exercises.workout_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete workout exercises for their sessions"
  ON workout_exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = workout_exercises.workout_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- RLS Policies for exercise_sets
DROP POLICY IF EXISTS "Users can view sets for their workout exercises" ON exercise_sets;
DROP POLICY IF EXISTS "Users can create sets for their workout exercises" ON exercise_sets;
DROP POLICY IF EXISTS "Users can update sets for their workout exercises" ON exercise_sets;
DROP POLICY IF EXISTS "Users can delete sets for their workout exercises" ON exercise_sets;

CREATE POLICY "Users can view sets for their workout exercises"
  ON exercise_sets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workout_sessions ON workout_sessions.id = workout_exercises.workout_id
      WHERE workout_exercises.id = exercise_sets.workout_exercise_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create sets for their workout exercises"
  ON exercise_sets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workout_sessions ON workout_sessions.id = workout_exercises.workout_id
      WHERE workout_exercises.id = exercise_sets.workout_exercise_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update sets for their workout exercises"
  ON exercise_sets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workout_sessions ON workout_sessions.id = workout_exercises.workout_id
      WHERE workout_exercises.id = exercise_sets.workout_exercise_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete sets for their workout exercises"
  ON exercise_sets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workout_sessions ON workout_sessions.id = workout_exercises.workout_id
      WHERE workout_exercises.id = exercise_sets.workout_exercise_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_workout_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS workout_sessions_updated_at ON workout_sessions;
CREATE TRIGGER workout_sessions_updated_at
  BEFORE UPDATE ON workout_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_workout_sessions_updated_at();
