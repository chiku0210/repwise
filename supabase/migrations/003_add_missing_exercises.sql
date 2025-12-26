-- Migration 003: Add Missing Exercises from Issue #17
-- Date: 2025-12-26
-- Purpose: Complete exercise catalog with 5 ticket exercises + 2 common gym movements

DO $$
DECLARE
  chest_id UUID;
  front_delts_id UUID;
  triceps_id UUID;
  upper_back_id UUID;
  lats_id UUID;
  rear_delts_id UUID;
  biceps_id UUID;
  forearms_id UUID;
  traps_id UUID;
  glutes_id UUID;
  hamstrings_id UUID;
  core_id UUID;
BEGIN
  -- Fetch muscle IDs
  SELECT id INTO chest_id FROM muscles WHERE name = 'Chest';
  SELECT id INTO front_delts_id FROM muscles WHERE name = 'Front Delts';
  SELECT id INTO triceps_id FROM muscles WHERE name = 'Triceps';
  SELECT id INTO upper_back_id FROM muscles WHERE name = 'Upper Back';
  SELECT id INTO lats_id FROM muscles WHERE name = 'Lats';
  SELECT id INTO rear_delts_id FROM muscles WHERE name = 'Rear Delts';
  SELECT id INTO biceps_id FROM muscles WHERE name = 'Biceps';
  SELECT id INTO forearms_id FROM muscles WHERE name = 'Forearms';
  SELECT id INTO traps_id FROM muscles WHERE name = 'Traps';
  SELECT id INTO glutes_id FROM muscles WHERE name = 'Glutes';
  SELECT id INTO hamstrings_id FROM muscles WHERE name = 'Hamstrings';
  SELECT id INTO core_id FROM muscles WHERE name = 'Core';

  -- Insert missing exercises from ticket #17
  INSERT INTO exercises (name, category, equipment_type, primary_muscles, secondary_muscles, form_cues, is_compound) VALUES
    
    -- CHEST FLY (Cable isolation)
    ('Chest Fly', 'push', 'cable', 
      ARRAY[chest_id], 
      ARRAY[]::UUID[], 
      ARRAY[
        'Set cables at chest height',
        'Slight bend in elbows, maintain throughout',
        'Bring hands together in front of chest',
        'Feel stretch in chest at start position'
      ], false),
    
    -- PUSH-UP (Bodyweight compound)
    ('Push-up', 'push', 'bodyweight', 
      ARRAY[chest_id], 
      ARRAY[front_delts_id, triceps_id, core_id], 
      ARRAY[
        'Hands slightly wider than shoulders',
        'Body in straight line from head to heels',
        'Lower chest to ground, elbows ~45°',
        'Push explosively to start position'
      ], true),
    
    -- REAR DELT FLY (Dumbbell isolation)
    ('Rear Delt Fly', 'pull', 'dumbbell', 
      ARRAY[rear_delts_id], 
      ARRAY[upper_back_id], 
      ARRAY[
        'Bend forward at hips, chest parallel to ground',
        'Slight bend in elbows',
        'Raise arms out to sides, leading with elbows',
        'Squeeze rear delts at top'
      ], false),
    
    -- TRICEP PUSHDOWN (Cable isolation)
    ('Tricep Pushdown', 'push', 'cable', 
      ARRAY[triceps_id], 
      ARRAY[]::UUID[], 
      ARRAY[
        'Elbows pinned at sides, don''t flare',
        'Push rope/bar down to full extension',
        'Squeeze triceps at bottom',
        'Control the return, don''t let weight pull arms up'
      ], false),
    
    -- HAMMER CURL (Dumbbell variation)
    ('Hammer Curl', 'pull', 'dumbbell', 
      ARRAY[biceps_id], 
      ARRAY[forearms_id], 
      ARRAY[
        'Neutral grip (palms facing each other)',
        'Elbows at sides, curl dumbbells up',
        'Keep wrists straight throughout',
        'Great for brachialis and forearm development'
      ], false),
    
    -- SHRUGS (Dumbbell - common trap builder)
    ('Shrug', 'pull', 'dumbbell', 
      ARRAY[traps_id], 
      ARRAY[]::UUID[], 
      ARRAY[
        'Dumbbells at sides, neutral grip',
        'Elevate shoulders straight up toward ears',
        'Hold squeeze at top for 1 second',
        'Lower under control, don''t roll shoulders'
      ], false),
    
    -- HYPEREXTENSION / BACK EXTENSION (Machine/bodyweight for lower back)
    ('Back Extension', 'legs', 'machine', 
      ARRAY[glutes_id, hamstrings_id], 
      ARRAY[lats_id, core_id], 
      ARRAY[
        'Hips on pad, feet secured',
        'Lower torso with control, neutral spine',
        'Raise back up to parallel or slightly above',
        'Don''t hyperextend, focus on glutes/hams'
      ], false);

  RAISE NOTICE 'Added 7 exercises: 5 from issue #17 + 2 common gym movements';

END $$;

-- Verify insertion
SELECT 
  name, 
  equipment_type, 
  category,
  is_compound,
  ARRAY_LENGTH(form_cues, 1) as cue_count
FROM exercises 
WHERE name IN ('Chest Fly', 'Push-up', 'Rear Delt Fly', 'Tricep Pushdown', 'Hammer Curl', 'Shrug', 'Back Extension')
ORDER BY category, name;

-- Show total exercise count
SELECT COUNT(*) as total_exercises FROM exercises;
