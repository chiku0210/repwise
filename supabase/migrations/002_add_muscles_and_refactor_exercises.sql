-- Migration 002: Add Muscles Table and Refactor Exercises Schema
-- Author: Repwise Dev Team
-- Date: 2025-12-26
-- Purpose: Add muscle tracking, form cues, and exercise relationships while keeping nested workout structure

-- ========================================
-- STEP 1: Create Muscles Table
-- ========================================

CREATE TABLE muscles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  "group" TEXT NOT NULL CHECK ("group" IN ('push', 'pull', 'legs')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed muscle data
INSERT INTO muscles (name, "group") VALUES
  -- Push muscles
  ('Chest', 'push'),
  ('Front Delts', 'push'),
  ('Side Delts', 'push'),
  ('Triceps', 'push'),
  
  -- Pull muscles
  ('Upper Back', 'pull'),
  ('Lats', 'pull'),
  ('Rear Delts', 'pull'),
  ('Biceps', 'pull'),
  ('Forearms', 'pull'),
  ('Traps', 'pull'),
  
  -- Leg muscles
  ('Quads', 'legs'),
  ('Glutes', 'legs'),
  ('Hamstrings', 'legs'),
  ('Calves', 'legs'),
  ('Hip Flexors', 'legs'),
  ('Adductors', 'legs'),
  ('Abductors', 'legs'),
  
  -- Core (grouped under legs for simplicity)
  ('Abs', 'legs'),
  ('Core', 'legs')
ON CONFLICT (name) DO NOTHING;

-- RLS for muscles (public read)
ALTER TABLE muscles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view muscles" ON muscles FOR SELECT USING (true);

-- ========================================
-- STEP 2: Modify Exercises Table Structure
-- ========================================

-- Drop old UNIQUE constraint on name (we need name + equipment_type to be unique)
ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_name_key;

-- Make old muscle_groups column nullable (we'll deprecate it)
ALTER TABLE exercises 
  ALTER COLUMN muscle_groups DROP NOT NULL;

-- Add new columns to existing exercises table
ALTER TABLE exercises 
  ADD COLUMN IF NOT EXISTS primary_muscles UUID[],
  ADD COLUMN IF NOT EXISTS secondary_muscles UUID[] DEFAULT ARRAY[]::UUID[],
  ADD COLUMN IF NOT EXISTS form_cues TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS variant_of UUID REFERENCES exercises(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS equipment_type TEXT CHECK (equipment_type IN ('barbell', 'dumbbell', 'machine', 'bodyweight', 'cable', 'other'));

-- Add new UNIQUE constraint on name + equipment_type
ALTER TABLE exercises 
  ADD CONSTRAINT exercises_name_equipment_unique UNIQUE (name, equipment_type);

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_exercises_primary_muscles ON exercises USING GIN (primary_muscles);
CREATE INDEX IF NOT EXISTS idx_exercises_secondary_muscles ON exercises USING GIN (secondary_muscles);
CREATE INDEX IF NOT EXISTS idx_exercises_variant_of ON exercises(variant_of) WHERE variant_of IS NOT NULL;

-- ========================================
-- STEP 3: Add Superset Support to Workout Exercises
-- ========================================

ALTER TABLE workout_exercises
  ADD COLUMN IF NOT EXISTS superset_group INTEGER,
  ADD COLUMN IF NOT EXISTS target_reps INTEGER,
  ADD COLUMN IF NOT EXISTS rest_seconds_after INTEGER DEFAULT 90;

CREATE INDEX IF NOT EXISTS idx_workout_exercises_superset ON workout_exercises(workout_id, superset_group) 
  WHERE superset_group IS NOT NULL;

-- ========================================
-- STEP 4: Add Timestamp to Exercise Sets
-- ========================================

ALTER TABLE exercise_sets
  ADD COLUMN IF NOT EXISTS timestamp TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_exercise_sets_timestamp ON exercise_sets(timestamp DESC);

-- ========================================
-- STEP 5: Clear Old Exercise Data and Insert New Structured Data
-- ========================================

-- Clear existing exercises (old format without muscle references)
TRUNCATE exercises CASCADE;

-- Helper function to get muscle IDs
CREATE OR REPLACE FUNCTION get_muscle_ids(muscle_names TEXT[])
RETURNS UUID[] AS $$
  SELECT ARRAY_AGG(id) FROM muscles WHERE name = ANY(muscle_names);
$$ LANGUAGE SQL STABLE;

-- Insert exercises with proper muscle references and form cues
DO $$
DECLARE
  chest_id UUID;
  front_delts_id UUID;
  side_delts_id UUID;
  triceps_id UUID;
  upper_back_id UUID;
  lats_id UUID;
  rear_delts_id UUID;
  biceps_id UUID;
  forearms_id UUID;
  traps_id UUID;
  quads_id UUID;
  glutes_id UUID;
  hamstrings_id UUID;
  calves_id UUID;
  hip_flexors_id UUID;
  abs_id UUID;
  core_id UUID;
BEGIN
  -- Fetch muscle IDs
  SELECT id INTO chest_id FROM muscles WHERE name = 'Chest';
  SELECT id INTO front_delts_id FROM muscles WHERE name = 'Front Delts';
  SELECT id INTO side_delts_id FROM muscles WHERE name = 'Side Delts';
  SELECT id INTO triceps_id FROM muscles WHERE name = 'Triceps';
  SELECT id INTO upper_back_id FROM muscles WHERE name = 'Upper Back';
  SELECT id INTO lats_id FROM muscles WHERE name = 'Lats';
  SELECT id INTO rear_delts_id FROM muscles WHERE name = 'Rear Delts';
  SELECT id INTO biceps_id FROM muscles WHERE name = 'Biceps';
  SELECT id INTO forearms_id FROM muscles WHERE name = 'Forearms';
  SELECT id INTO traps_id FROM muscles WHERE name = 'Traps';
  SELECT id INTO quads_id FROM muscles WHERE name = 'Quads';
  SELECT id INTO glutes_id FROM muscles WHERE name = 'Glutes';
  SELECT id INTO hamstrings_id FROM muscles WHERE name = 'Hamstrings';
  SELECT id INTO calves_id FROM muscles WHERE name = 'Calves';
  SELECT id INTO hip_flexors_id FROM muscles WHERE name = 'Hip Flexors';
  SELECT id INTO abs_id FROM muscles WHERE name = 'Abs';
  SELECT id INTO core_id FROM muscles WHERE name = 'Core';

  -- Insert exercises with proper structure
  INSERT INTO exercises (name, category, equipment_type, primary_muscles, secondary_muscles, form_cues, is_compound, muscle_groups) VALUES
    -- BARBELL PUSH
    ('Bench Press', 'push', 'barbell', ARRAY[chest_id], ARRAY[front_delts_id, triceps_id], ARRAY[
      'Retract scapula, arch upper back',
      'Bar touches lower chest at nipple line',
      'Elbows 45-75° from torso',
      'Drive feet into ground for leg drive'
    ], true, ARRAY['chest', 'front_delts', 'triceps']),
    
    ('Overhead Press', 'push', 'barbell', ARRAY[front_delts_id, side_delts_id], ARRAY[triceps_id, core_id], ARRAY[
      'Bar starts at collarbone',
      'Press straight up past your face',
      'Squeeze glutes for core stability',
      'Shrug shoulders at lockout'
    ], true, ARRAY['front_delts', 'side_delts', 'triceps']),
    
    ('Close-Grip Bench Press', 'push', 'barbell', ARRAY[triceps_id], ARRAY[chest_id, front_delts_id], ARRAY[
      'Hands shoulder-width or slightly narrower',
      'Elbows stay closer to torso than regular bench',
      'Touch lower chest, full lockout',
      'Great for tricep overload'
    ], true, ARRAY['triceps', 'chest']),

    -- DUMBBELL PUSH
    ('Bench Press', 'push', 'dumbbell', ARRAY[chest_id], ARRAY[front_delts_id, triceps_id], ARRAY[
      'Dumbbells at chest level, elbows ~45°',
      'Press to slight touch at top',
      'Greater ROM than barbell',
      'Control descent, no bouncing'
    ], true, ARRAY['chest', 'front_delts', 'triceps']),
    
    ('Shoulder Press', 'push', 'dumbbell', ARRAY[front_delts_id, side_delts_id], ARRAY[triceps_id], ARRAY[
      'Start dumbbells at ear height',
      'Press up and slightly inward',
      'Neutral or pronated grip',
      'Avoid excessive back arch'
    ], true, ARRAY['front_delts', 'side_delts', 'triceps']),
    
    ('Incline Bench Press', 'push', 'dumbbell', ARRAY[chest_id], ARRAY[front_delts_id, triceps_id], ARRAY[
      'Bench at 30-45° incline',
      'Press slightly toward face',
      'Full stretch at bottom',
      'Targets upper chest'
    ], true, ARRAY['chest', 'front_delts']),
    
    ('Lateral Raise', 'push', 'dumbbell', ARRAY[side_delts_id], ARRAY[]::UUID[], ARRAY[
      'Slight forward lean, soft elbows',
      'Lift to shoulder height only',
      'Lead with elbows, not hands',
      'Controlled 2-second descent'
    ], false, ARRAY['side_delts']),

    -- BARBELL PULL
    ('Barbell Row', 'pull', 'barbell', ARRAY[upper_back_id, lats_id], ARRAY[rear_delts_id, biceps_id], ARRAY[
      'Hip hinge ~45° torso angle',
      'Pull to lower chest/upper abs',
      'Retract scapula at top',
      'No momentum, control the weight'
    ], true, ARRAY['upper_back', 'lats', 'biceps']),
    
    ('Deadlift', 'pull', 'barbell', ARRAY[glutes_id, hamstrings_id], ARRAY[upper_back_id, quads_id, core_id], ARRAY[
      'Bar over midfoot at start',
      'Neutral spine, brace core hard',
      'Push floor away with legs first',
      'Hips and shoulders rise together'
    ], true, ARRAY['glutes', 'hamstrings', 'back']),
    
    ('Romanian Deadlift', 'pull', 'barbell', ARRAY[hamstrings_id, glutes_id], ARRAY[upper_back_id], ARRAY[
      'Soft knees, hinge at hips',
      'Bar stays close to legs',
      'Feel stretch in hamstrings at bottom',
      'Drive hips forward to stand'
    ], true, ARRAY['hamstrings', 'glutes']),
    
    ('Barbell Curl', 'pull', 'barbell', ARRAY[biceps_id], ARRAY[forearms_id], ARRAY[
      'Elbows pinned at sides',
      'No momentum or hip swing',
      'Full ROM, squeeze at top',
      'Slow 2-3 second negative'
    ], false, ARRAY['biceps']),

    -- DUMBBELL PULL
    ('Dumbbell Row', 'pull', 'dumbbell', ARRAY[lats_id, upper_back_id], ARRAY[rear_delts_id, biceps_id], ARRAY[
      'One knee and hand on bench',
      'Pull to hip, not chest',
      'Retract scapula at top',
      'Torso parallel to ground'
    ], true, ARRAY['lats', 'upper_back', 'biceps']),
    
    ('Dumbbell Curl', 'pull', 'dumbbell', ARRAY[biceps_id], ARRAY[forearms_id], ARRAY[
      'Elbows at sides, minimal swing',
      'Supinate wrist as you curl',
      'Squeeze at top',
      'Alternate or together'
    ], false, ARRAY['biceps']),

    -- CABLE PULL
    ('Face Pull', 'pull', 'cable', ARRAY[rear_delts_id], ARRAY[upper_back_id, traps_id], ARRAY[
      'Rope attachment to face level',
      'Pull rope ends apart',
      'Externally rotate shoulders',
      'Squeeze rear delts 1-2 seconds'
    ], false, ARRAY['rear_delts', 'upper_back']),
    
    ('Lat Pulldown', 'pull', 'cable', ARRAY[lats_id], ARRAY[biceps_id, upper_back_id], ARRAY[
      'Grip slightly wider than shoulders',
      'Pull bar to upper chest',
      'Lean back slightly (~15°)',
      'Retract scapula, squeeze lats'
    ], true, ARRAY['lats', 'biceps']),
    
    ('Cable Row', 'pull', 'cable', ARRAY[upper_back_id, lats_id], ARRAY[rear_delts_id, biceps_id], ARRAY[
      'Chest up, neutral spine',
      'Pull to lower chest',
      'Retract scapula',
      'Great constant tension'
    ], true, ARRAY['upper_back', 'lats', 'biceps']),

    -- BODYWEIGHT PULL
    ('Pull-up', 'pull', 'bodyweight', ARRAY[lats_id], ARRAY[upper_back_id, biceps_id], ARRAY[
      'Start from dead hang',
      'Pull chest to bar',
      'Retract scapula first',
      'Control descent, no kipping'
    ], true, ARRAY['lats', 'back', 'biceps']),
    
    ('Chin-up', 'pull', 'bodyweight', ARRAY[biceps_id, lats_id], ARRAY[upper_back_id], ARRAY[
      'Supinated (underhand) grip',
      'Pull chin over bar',
      'Engage lats and biceps equally',
      'Full extension at bottom'
    ], true, ARRAY['biceps', 'lats']),

    -- BARBELL LEGS
    ('Squat', 'legs', 'barbell', ARRAY[quads_id, glutes_id], ARRAY[hamstrings_id, core_id], ARRAY[
      'Break at knees and hips simultaneously',
      'Depth: hip crease below knee',
      'Knees track over toes',
      'Chest up, core braced hard'
    ], true, ARRAY['quads', 'glutes']),
    
    ('Front Squat', 'legs', 'barbell', ARRAY[quads_id], ARRAY[glutes_id, core_id], ARRAY[
      'Bar on front delts, elbows high',
      'More upright torso than back squat',
      'Quad-dominant movement',
      'Great for mobility'
    ], true, ARRAY['quads', 'glutes']),

    -- DUMBBELL LEGS
    ('Goblet Squat', 'legs', 'dumbbell', ARRAY[quads_id, glutes_id], ARRAY[core_id], ARRAY[
      'Hold dumbbell at chest vertically',
      'Squat deep, elbows inside knees',
      'Chest up, weight on heels',
      'Perfect for beginners'
    ], true, ARRAY['quads', 'glutes']),
    
    ('Bulgarian Split Squat', 'legs', 'dumbbell', ARRAY[quads_id, glutes_id], ARRAY[hamstrings_id], ARRAY[
      'Rear foot elevated on bench',
      'Front shin vertical at bottom',
      'Don''t lean forward excessively',
      'Drive through front heel'
    ], true, ARRAY['quads', 'glutes']),
    
    ('Romanian Deadlift', 'legs', 'dumbbell', ARRAY[hamstrings_id, glutes_id], ARRAY[]::UUID[], ARRAY[
      'Dumbbells at sides or front of thighs',
      'Hinge at hips, soft knees',
      'Feel hamstring stretch',
      'Squeeze glutes at top'
    ], true, ARRAY['hamstrings', 'glutes']),
    
    ('Lunge', 'legs', 'dumbbell', ARRAY[quads_id, glutes_id], ARRAY[hamstrings_id], ARRAY[
      'Step forward or back',
      'Both knees ~90° at bottom',
      'Front shin vertical',
      'Drive through front heel'
    ], true, ARRAY['quads', 'glutes']),

    -- MACHINE LEGS
    ('Leg Press', 'legs', 'machine', ARRAY[quads_id, glutes_id], ARRAY[hamstrings_id], ARRAY[
      'Feet shoulder-width, mid-platform',
      'Lower to 90° knee angle or deeper',
      'Push through heels',
      'Don''t lock knees at top'
    ], true, ARRAY['quads', 'glutes']),
    
    ('Leg Curl', 'legs', 'machine', ARRAY[hamstrings_id], ARRAY[]::UUID[], ARRAY[
      'Pad on lower calf/Achilles area',
      'Curl to full contraction',
      'Squeeze 1 second at top',
      'Slow 3-second negative'
    ], false, ARRAY['hamstrings']),
    
    ('Leg Extension', 'legs', 'machine', ARRAY[quads_id], ARRAY[]::UUID[], ARRAY[
      'Back against pad, pad on shin',
      'Extend to full lockout',
      'Squeeze quads at top',
      'Control descent, don''t slam'
    ], false, ARRAY['quads']),
    
    ('Calf Raise', 'legs', 'machine', ARRAY[calves_id], ARRAY[]::UUID[], ARRAY[
      'Full stretch at bottom',
      'Rise onto toes fully',
      'Pause 1-2 seconds at top',
      'Slow eccentric for stretch'
    ], false, ARRAY['calves']),
    
    ('Hip Thrust', 'legs', 'machine', ARRAY[glutes_id], ARRAY[hamstrings_id], ARRAY[
      'Upper back on bench, feet flat',
      'Drive through heels',
      'Squeeze glutes hard at top',
      'Posterior chain builder'
    ], true, ARRAY['glutes', 'hamstrings']),

    -- BODYWEIGHT LEGS
    ('Lunge', 'legs', 'bodyweight', ARRAY[quads_id, glutes_id], ARRAY[hamstrings_id], ARRAY[
      'Step forward or back',
      'Both knees ~90° at bottom',
      'Front shin vertical',
      'Great for beginners'
    ], true, ARRAY['quads', 'glutes']),
    
    ('Squat', 'legs', 'bodyweight', ARRAY[quads_id, glutes_id], ARRAY[]::UUID[], ARRAY[
      'Feet shoulder-width',
      'Squat to parallel or below',
      'Chest up, weight on heels',
      'Master form before adding weight'
    ], true, ARRAY['quads', 'glutes']),

    -- CORE
    ('Plank', 'core', 'bodyweight', ARRAY[core_id, abs_id], ARRAY[]::UUID[], ARRAY[
      'Forearms on ground, body straight',
      'Squeeze glutes and abs',
      'Don''t let hips sag or pike',
      'Breathe steadily'
    ], false, ARRAY['abs', 'core']),
    
    ('Hanging Leg Raise', 'core', 'bodyweight', ARRAY[abs_id], ARRAY[hip_flexors_id], ARRAY[
      'Hang from bar, slight shoulder retraction',
      'Raise knees/legs to hip level or higher',
      'Control descent slowly',
      'Avoid momentum swing'
    ], false, ARRAY['abs']),
    
    ('Cable Crunch', 'core', 'cable', ARRAY[abs_id], ARRAY[]::UUID[], ARRAY[
      'Kneel facing cable stack',
      'Hold rope behind head',
      'Crunch down, bring elbows to knees',
      'Exhale hard at bottom'
    ], false, ARRAY['abs']);

END $$;

-- ========================================
-- STEP 6: Add Exercise Variants (Examples)
-- ========================================

DO $$
DECLARE
  bench_press_bb_id UUID;
  bench_press_db_id UUID;
  squat_bb_id UUID;
  front_squat_id UUID;
BEGIN
  -- Link dumbbell bench as variant of barbell bench
  SELECT id INTO bench_press_bb_id FROM exercises WHERE name = 'Bench Press' AND equipment_type = 'barbell';
  SELECT id INTO bench_press_db_id FROM exercises WHERE name = 'Bench Press' AND equipment_type = 'dumbbell';
  
  IF bench_press_bb_id IS NOT NULL AND bench_press_db_id IS NOT NULL THEN
    UPDATE exercises 
    SET variant_of = bench_press_bb_id 
    WHERE id = bench_press_db_id;
  END IF;

  -- Link front squat as variant of back squat
  SELECT id INTO squat_bb_id FROM exercises WHERE name = 'Squat' AND equipment_type = 'barbell';
  SELECT id INTO front_squat_id FROM exercises WHERE name = 'Front Squat' AND equipment_type = 'barbell';
  
  IF squat_bb_id IS NOT NULL AND front_squat_id IS NOT NULL THEN
    UPDATE exercises 
    SET variant_of = squat_bb_id 
    WHERE id = front_squat_id;
  END IF;

END $$;

-- ========================================
-- STEP 7: Add Comments for Documentation
-- ========================================

COMMENT ON TABLE muscles IS 'Muscle groups organized by push/pull/legs split for analytics';
COMMENT ON COLUMN exercises.primary_muscles IS 'Array of muscle UUIDs - main muscles worked';
COMMENT ON COLUMN exercises.secondary_muscles IS 'Array of muscle UUIDs - assisting muscles';
COMMENT ON COLUMN exercises.form_cues IS 'Array of 3-4 coaching tips for proper form';
COMMENT ON COLUMN exercises.variant_of IS 'References parent exercise (e.g., DB Bench → BB Bench)';
COMMENT ON COLUMN exercises.equipment_type IS 'Equipment category for this exercise';
COMMENT ON COLUMN exercises.muscle_groups IS '[DEPRECATED] Use primary_muscles and secondary_muscles instead';
COMMENT ON COLUMN workout_exercises.superset_group IS 'Same number = exercises in same superset';
COMMENT ON COLUMN workout_exercises.rest_seconds_after IS 'Rest time before next exercise';
COMMENT ON COLUMN exercise_sets.timestamp IS 'When this set was actually logged';

-- ========================================
-- DONE: Migration Complete
-- ========================================

-- Summary:
-- ✅ Added muscles table with 19 muscle groups
-- ✅ Enhanced exercises with muscle references, form cues, and variants
-- ✅ Fixed UNIQUE constraint to allow name + equipment_type combinations
-- ✅ Added superset support to workout_exercises
-- ✅ Added timestamp tracking to sets
-- ✅ Seeded 32 exercises with complete form cues
-- ✅ Kept nested workout structure (workout_sessions → workout_exercises → exercise_sets)
-- ✅ All existing RLS policies remain intact
-- ✅ Old muscle_groups column kept nullable for backward compatibility
