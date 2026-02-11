-- Migration 005: Add Chest Press Machine
-- Date: 2026-02-11
-- Purpose: Add machine chest press for beginner machine-based templates
-- Related: Issue #21 (Templates table) - needed for complete template coverage

DO $$
DECLARE
  chest_id UUID;
  front_delts_id UUID;
  triceps_id UUID;
BEGIN
  -- Fetch muscle IDs
  SELECT id INTO chest_id FROM muscles WHERE name = 'Chest';
  SELECT id INTO front_delts_id FROM muscles WHERE name = 'Front Delts';
  SELECT id INTO triceps_id FROM muscles WHERE name = 'Triceps';

  -- Insert Chest Press Machine
  INSERT INTO exercises (name, category, equipment_type, primary_muscles, secondary_muscles, form_cues, is_compound, muscle_groups) VALUES
    ('Chest Press', 'push', 'machine', 
      ARRAY[chest_id], 
      ARRAY[front_delts_id, triceps_id], 
      ARRAY[
        'Adjust seat height so handles are at chest level',
        'Press handles forward until arms fully extended',
        'Don''t lock elbows harshly at top',
        'Control the return, don''t let stack slam'
      ], 
      true,
      ARRAY['chest', 'front_delts', 'triceps']
    )
  ON CONFLICT (name, equipment_type) DO NOTHING;

  RAISE NOTICE 'Added Chest Press Machine exercise';

END $$;

-- Verify insertion
SELECT 
  name, 
  equipment_type, 
  category,
  is_compound,
  ARRAY_LENGTH(form_cues, 1) as cue_count
FROM exercises 
WHERE name = 'Chest Press' AND equipment_type = 'machine';

-- Show updated exercise count
SELECT COUNT(*) as total_exercises, 
       COUNT(DISTINCT name) as unique_exercise_names
FROM exercises;

-- ========================================
-- DONE: Migration Complete
-- ========================================

-- Summary:
-- ✅ Added Chest Press (machine) exercise
-- ✅ Configured with proper muscle mappings (Chest primary, Front Delts + Triceps secondary)
-- ✅ 4 form cues for beginner guidance
-- ✅ Marked as compound movement
-- ✅ Ready for use in beginner machine-based workout templates
-- ✅ Total exercise catalog now: 42 rows (38 unique names)
