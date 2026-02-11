-- Migration 006: Create Templates Table and Seed Starter Templates
-- Author: Repwise Dev Team
-- Date: 2026-02-12
-- Purpose: Create workout templates system with 12 comprehensive starter templates
-- Related: Issue #21

-- ========================================
-- STEP 1: Create Templates Table
-- ========================================

CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  exercises JSONB NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  estimated_duration_minutes INT NOT NULL,
  equipment_needed TEXT[] NOT NULL,
  recommended_for TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_templates_public ON templates(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_templates_creator ON templates(created_by) WHERE created_by IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_templates_difficulty ON templates(difficulty);
CREATE INDEX IF NOT EXISTS idx_templates_exercises_gin ON templates USING GIN (exercises);

-- Add helpful comments
COMMENT ON TABLE templates IS 'Workout template blueprints - reusable workout structures';
COMMENT ON COLUMN templates.exercises IS 'JSONB array of exercise configs: [{exercise_id, target_sets, reps_range, rest_seconds, order_index, notes}]';
COMMENT ON COLUMN templates.is_public IS 'true = system template, false = user-created template';
COMMENT ON COLUMN templates.estimated_duration_minutes IS 'Approximate workout duration including rest periods';
COMMENT ON COLUMN templates.equipment_needed IS 'Array of equipment types required: [barbell, dumbbell, cable, machine, bodyweight]';
COMMENT ON COLUMN templates.recommended_for IS 'Tags for filtering: [beginner, home_gym, ppl_split, upper_lower, etc]';

-- ========================================
-- STEP 2: Set Up RLS Policies
-- ========================================

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Anyone can view public templates
CREATE POLICY "Public templates are viewable by everyone"
  ON templates FOR SELECT
  USING (is_public = true);

-- Users can view their own templates
CREATE POLICY "Users can view their own templates"
  ON templates FOR SELECT
  USING (auth.uid() = created_by);

-- Users can create their own templates (Phase 3 feature)
CREATE POLICY "Users can create their own templates"
  ON templates FOR INSERT
  WITH CHECK (auth.uid() = created_by AND is_public = false);

-- Users can update their own templates
CREATE POLICY "Users can update their own templates"
  ON templates FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Users can delete their own templates
CREATE POLICY "Users can delete their own templates"
  ON templates FOR DELETE
  USING (auth.uid() = created_by);

-- ========================================
-- STEP 3: Seed 12 Starter Templates
-- ========================================

-- Template 1: Full Body A (Beginner)
INSERT INTO templates (name, description, difficulty, exercises, estimated_duration_minutes, equipment_needed, recommended_for, is_public, created_by) VALUES (
  'Full Body A',
  'Master the fundamental compound movements that build total-body strength. Perfect for beginners training 3x per week, focusing on the big 5 lifts with moderate volume.',
  'beginner',
  '[
    {"exercise_id": "10a9f5a6-b315-49e4-bae7-54fbbb1c2bf4", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 120, "order_index": 0, "notes": "Lower body foundation - focus on depth"},
    {"exercise_id": "31acfd27-29d3-4590-b93c-0eea7394b3e4", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 90, "order_index": 1, "notes": "Upper body push - retract scapula"},
    {"exercise_id": "76a9d3e8-d74c-4a2b-814a-c61785e8b58e", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 90, "order_index": 2, "notes": "Upper body pull - control the weight"},
    {"exercise_id": "71c70942-5f72-4de2-a7bf-8949546e762b", "target_sets": 3, "reps_range": "6-10", "rest_seconds": 90, "order_index": 3, "notes": "Shoulder strength builder"},
    {"exercise_id": "5d95c3f8-8199-490b-a574-cb87e10e0884", "target_sets": 3, "reps_range": "10-15", "rest_seconds": 90, "order_index": 4, "notes": "Posterior chain - feel the hamstring stretch"}
  ]'::jsonb,
  50,
  ARRAY['barbell', 'bench', 'rack'],
  ARRAY['beginner', 'full_body', '3x_per_week', 'strength_foundation'],
  true,
  NULL
);

-- Template 2: Push Day (Intermediate)
INSERT INTO templates (name, description, difficulty, exercises, estimated_duration_minutes, equipment_needed, recommended_for, is_public, created_by) VALUES (
  'Push Day',
  'High-volume push workout targeting chest, shoulders, and triceps. Part of a Push/Pull/Legs split, emphasizing compound movements first followed by isolation work for complete development.',
  'intermediate',
  '[
    {"exercise_id": "31acfd27-29d3-4590-b93c-0eea7394b3e4", "target_sets": 4, "reps_range": "6-10", "rest_seconds": 120, "order_index": 0, "notes": "Heavy compound - main chest builder"},
    {"exercise_id": "24eb504e-ea55-4bfd-a35c-7f63d789312d", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 90, "order_index": 1, "notes": "Upper chest focus - full stretch at bottom"},
    {"exercise_id": "71c70942-5f72-4de2-a7bf-8949546e762b", "target_sets": 3, "reps_range": "6-10", "rest_seconds": 90, "order_index": 2, "notes": "Primary shoulder mass builder"},
    {"exercise_id": "f6d12a6d-c772-442a-ac79-5599d0ed3ffe", "target_sets": 3, "reps_range": "12-15", "rest_seconds": 60, "order_index": 3, "notes": "Side delt isolation - controlled reps"},
    {"exercise_id": "1a8d2262-6a2a-4211-b990-7e6227ba8b94", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 90, "order_index": 4, "notes": "Tricep emphasis - elbows stay close"}
  ]'::jsonb,
  55,
  ARRAY['barbell', 'dumbbell', 'bench'],
  ARRAY['intermediate', 'ppl_split', 'push', 'chest_shoulders_triceps'],
  true,
  NULL
);

-- Template 3: Upper Body (Intermediate)
INSERT INTO templates (name, description, difficulty, exercises, estimated_duration_minutes, equipment_needed, recommended_for, is_public, created_by) VALUES (
  'Upper Body',
  'Balanced upper body session with equal push and pull volume to prevent muscle imbalances. Ideal for upper/lower splits or when lower body training isn''t possible.',
  'intermediate',
  '[
    {"exercise_id": "31acfd27-29d3-4590-b93c-0eea7394b3e4", "target_sets": 4, "reps_range": "6-10", "rest_seconds": 120, "order_index": 0, "notes": "Heavy horizontal push"},
    {"exercise_id": "76a9d3e8-d74c-4a2b-814a-c61785e8b58e", "target_sets": 4, "reps_range": "6-10", "rest_seconds": 120, "order_index": 1, "notes": "Heavy horizontal pull - match push volume"},
    {"exercise_id": "71c70942-5f72-4de2-a7bf-8949546e762b", "target_sets": 3, "reps_range": "6-10", "rest_seconds": 90, "order_index": 2, "notes": "Vertical push movement"},
    {"exercise_id": "47fe206a-9dd0-4080-9c45-b16c237162ef", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 90, "order_index": 3, "notes": "Vertical pull - balance shoulders"},
    {"exercise_id": "46273916-b548-4491-bfd9-061e709f3f9b", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 60, "order_index": 4, "notes": "Bicep isolation finisher"}
  ]'::jsonb,
  60,
  ARRAY['barbell', 'cable', 'bench'],
  ARRAY['intermediate', 'upper_lower', 'balanced', 'push_pull_balanced'],
  true,
  NULL
);

-- Template 4: Pull Day (Intermediate)
INSERT INTO templates (name, description, difficulty, exercises, estimated_duration_minutes, equipment_needed, recommended_for, is_public, created_by) VALUES (
  'Pull Day',
  'Complete back and biceps workout hitting all angles. Combines heavy deadlifts with horizontal and vertical pulling patterns for comprehensive back development.',
  'intermediate',
  '[
    {"exercise_id": "76a9d3e8-d74c-4a2b-814a-c61785e8b58e", "target_sets": 4, "reps_range": "6-10", "rest_seconds": 120, "order_index": 0, "notes": "Primary back builder - heavy and controlled"},
    {"exercise_id": "1771e0b9-1040-4b03-a38c-57320aae4bed", "target_sets": 3, "reps_range": "6-8", "rest_seconds": 180, "order_index": 1, "notes": "Posterior chain powerhouse - brace hard"},
    {"exercise_id": "47fe206a-9dd0-4080-9c45-b16c237162ef", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 90, "order_index": 2, "notes": "Lat width and thickness"},
    {"exercise_id": "1aeb9b32-aef3-4897-937b-33aa0d406bbc", "target_sets": 3, "reps_range": "12-15", "rest_seconds": 60, "order_index": 3, "notes": "Rear delt health - pull rope apart"},
    {"exercise_id": "46273916-b548-4491-bfd9-061e709f3f9b", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 60, "order_index": 4, "notes": "Bicep pump finisher"}
  ]'::jsonb,
  60,
  ARRAY['barbell', 'cable'],
  ARRAY['intermediate', 'ppl_split', 'pull', 'back_biceps'],
  true,
  NULL
);

-- Template 5: Leg Day (Intermediate)
INSERT INTO templates (name, description, difficulty, exercises, estimated_duration_minutes, equipment_needed, recommended_for, is_public, created_by) VALUES (
  'Leg Day',
  'Complete lower body workout hitting quads, hamstrings, glutes, and calves. Balanced between compound and isolation movements for comprehensive leg development.',
  'intermediate',
  '[
    {"exercise_id": "10a9f5a6-b315-49e4-bae7-54fbbb1c2bf4", "target_sets": 4, "reps_range": "6-10", "rest_seconds": 150, "order_index": 0, "notes": "King of leg exercises - go deep"},
    {"exercise_id": "5d95c3f8-8199-490b-a574-cb87e10e0884", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 90, "order_index": 1, "notes": "Hamstring and glute builder"},
    {"exercise_id": "7436cf94-bf2f-49a0-bddd-2118f28462f5", "target_sets": 3, "reps_range": "10-15", "rest_seconds": 90, "order_index": 2, "notes": "Quad volume builder"},
    {"exercise_id": "e1d71169-4694-4ede-a150-a6c396b7caff", "target_sets": 3, "reps_range": "10-15", "rest_seconds": 60, "order_index": 3, "notes": "Hamstring isolation"},
    {"exercise_id": "2d12fb0d-1644-4f66-9331-e4aaea48a1cd", "target_sets": 4, "reps_range": "12-20", "rest_seconds": 60, "order_index": 4, "notes": "Calf endurance - full ROM"}
  ]'::jsonb,
  55,
  ARRAY['barbell', 'machine', 'rack'],
  ARRAY['intermediate', 'ppl_split', 'legs', 'quad_hamstring_glute'],
  true,
  NULL
);

-- Template 6: Lower Body (Intermediate)
INSERT INTO templates (name, description, difficulty, exercises, estimated_duration_minutes, equipment_needed, recommended_for, is_public, created_by) VALUES (
  'Lower Body',
  'Lower body focused session for upper/lower splits. Emphasizes unilateral work and posterior chain development with a mix of compound and accessory movements.',
  'intermediate',
  '[
    {"exercise_id": "10a9f5a6-b315-49e4-bae7-54fbbb1c2bf4", "target_sets": 4, "reps_range": "6-10", "rest_seconds": 150, "order_index": 0, "notes": "Primary leg builder"},
    {"exercise_id": "5d95c3f8-8199-490b-a574-cb87e10e0884", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 90, "order_index": 1, "notes": "Hamstring and glute emphasis"},
    {"exercise_id": "d2ee9f8d-27bb-4395-8b34-5fc98456e6f2", "target_sets": 3, "reps_range": "10-12", "rest_seconds": 90, "order_index": 2, "notes": "Unilateral strength and balance"},
    {"exercise_id": "e1d71169-4694-4ede-a150-a6c396b7caff", "target_sets": 3, "reps_range": "12-15", "rest_seconds": 60, "order_index": 3, "notes": "Hamstring isolation"},
    {"exercise_id": "df9d03f4-cf34-47b0-9da2-2ae6dfdbf778", "target_sets": 3, "reps_range": "10-15", "rest_seconds": 90, "order_index": 4, "notes": "Glute activation and strength"}
  ]'::jsonb,
  60,
  ARRAY['barbell', 'dumbbell', 'machine', 'rack'],
  ARRAY['intermediate', 'upper_lower', 'legs', 'unilateral_work'],
  true,
  NULL
);

-- Template 7: Full Body B (Beginner)
INSERT INTO templates (name, description, difficulty, exercises, estimated_duration_minutes, equipment_needed, recommended_for, is_public, created_by) VALUES (
  'Full Body B',
  'Dumbbell-focused full body routine perfect for home gyms or beginners building foundational movement patterns. Less intimidating than barbell work while still highly effective.',
  'beginner',
  '[
    {"exercise_id": "0a05ac57-3acb-4207-896c-64c09ed8441c", "target_sets": 3, "reps_range": "10-12", "rest_seconds": 90, "order_index": 0, "notes": "Squat pattern - chest up, elbows inside knees"},
    {"exercise_id": "8bd0e7f7-3055-4de8-a932-2d5ee4996699", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 90, "order_index": 1, "notes": "Greater ROM than barbell"},
    {"exercise_id": "4cb70998-c735-42b6-808b-baee49f516a7", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 90, "order_index": 2, "notes": "Pull to hip, not chest"},
    {"exercise_id": "7dab65d1-3036-47e8-8a73-bd8706bc8b74", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 90, "order_index": 3, "notes": "Press up and slightly inward"},
    {"exercise_id": "f1ed41fc-e4f6-42cb-8ee6-32af569a71a2", "target_sets": 3, "reps_range": "10-15", "rest_seconds": 90, "order_index": 4, "notes": "Hinge at hips, soft knees"}
  ]'::jsonb,
  45,
  ARRAY['dumbbell', 'bench'],
  ARRAY['beginner', 'full_body', 'dumbbell_only', 'home_gym'],
  true,
  NULL
);

-- Template 8: Full Body C (Advanced)
INSERT INTO templates (name, description, difficulty, exercises, estimated_duration_minutes, equipment_needed, recommended_for, is_public, created_by) VALUES (
  'Full Body C',
  'High-intensity full body workout with lower rep ranges for pure strength development. Advanced lifters seeking to maximize neural adaptations and push heavy weights.',
  'advanced',
  '[
    {"exercise_id": "1771e0b9-1040-4b03-a38c-57320aae4bed", "target_sets": 3, "reps_range": "5-8", "rest_seconds": 180, "order_index": 0, "notes": "Heavy pull - brace core hard, neutral spine"},
    {"exercise_id": "31acfd27-29d3-4590-b93c-0eea7394b3e4", "target_sets": 4, "reps_range": "6-10", "rest_seconds": 120, "order_index": 1, "notes": "Upper body strength cornerstone"},
    {"exercise_id": "5f6d8175-ee2c-418b-b157-4b57374332c6", "target_sets": 3, "reps_range": "6-10", "rest_seconds": 120, "order_index": 2, "notes": "Bodyweight mastery - full ROM"},
    {"exercise_id": "dd3c503f-bea8-450e-ac32-cf03f2af33ab", "target_sets": 3, "reps_range": "6-10", "rest_seconds": 120, "order_index": 3, "notes": "Quad-dominant squat variation"},
    {"exercise_id": "71c70942-5f72-4de2-a7bf-8949546e762b", "target_sets": 3, "reps_range": "6-10", "rest_seconds": 90, "order_index": 4, "notes": "Overhead strength builder"}
  ]'::jsonb,
  65,
  ARRAY['barbell', 'rack', 'pull_up_bar'],
  ARRAY['advanced', 'full_body', 'strength_focus', 'low_reps'],
  true,
  NULL
);

-- Template 9: Beginner Machine Circuit (Beginner)
INSERT INTO templates (name, description, difficulty, exercises, estimated_duration_minutes, equipment_needed, recommended_for, is_public, created_by) VALUES (
  'Beginner Machine Circuit',
  'Machine-based full body workout providing guided movement patterns ideal for complete beginners. Builds confidence and familiarity with gym equipment in a safe, controlled manner.',
  'beginner',
  '[
    {"exercise_id": "7436cf94-bf2f-49a0-bddd-2118f28462f5", "target_sets": 3, "reps_range": "10-15", "rest_seconds": 90, "order_index": 0, "notes": "Leg builder - feet mid-platform"},
    {"exercise_id": "c5658343-59b5-472d-b1ae-ec5ec148e4db", "target_sets": 3, "reps_range": "10-15", "rest_seconds": 90, "order_index": 1, "notes": "Chest development - adjust seat height"},
    {"exercise_id": "47fe206a-9dd0-4080-9c45-b16c237162ef", "target_sets": 3, "reps_range": "10-15", "rest_seconds": 90, "order_index": 2, "notes": "Back builder - pull to upper chest"},
    {"exercise_id": "e1d71169-4694-4ede-a150-a6c396b7caff", "target_sets": 3, "reps_range": "10-15", "rest_seconds": 60, "order_index": 3, "notes": "Hamstring isolation"},
    {"exercise_id": "6d10a389-00ec-4217-b070-be6499e2b210", "target_sets": 3, "reps_range": "10-15", "rest_seconds": 60, "order_index": 4, "notes": "Quad isolation"}
  ]'::jsonb,
  40,
  ARRAY['machine', 'cable'],
  ARRAY['beginner', 'machine_only', 'guided_movement', 'gym_newbie'],
  true,
  NULL
);

-- Template 10: Bodyweight Home Workout (Beginner)
INSERT INTO templates (name, description, difficulty, exercises, estimated_duration_minutes, equipment_needed, recommended_for, is_public, created_by) VALUES (
  'Bodyweight Home Workout',
  'Zero-equipment full body routine perfect for home training or travel. Builds foundational strength and movement quality using only your bodyweight.',
  'beginner',
  '[
    {"exercise_id": "75f0f005-b534-4342-8103-a744930b7530", "target_sets": 3, "reps_range": "15-20", "rest_seconds": 60, "order_index": 0, "notes": "Master the squat pattern first"},
    {"exercise_id": "a4cb1c38-9030-4094-a91d-1976ad0ed338", "target_sets": 3, "reps_range": "8-15", "rest_seconds": 60, "order_index": 1, "notes": "Body in straight line - no sagging hips"},
    {"exercise_id": "8db3658e-399c-4d7b-a851-232eb015eef3", "target_sets": 3, "reps_range": "12-15", "rest_seconds": 60, "order_index": 2, "notes": "Per leg - front shin vertical"},
    {"exercise_id": "5ae9038b-33c0-485a-a4b6-2040f685da15", "target_sets": 3, "reps_range": "30-60s", "rest_seconds": 60, "order_index": 3, "notes": "Core stability - squeeze glutes and abs"},
    {"exercise_id": "3dbaf998-a1e6-4b4e-aa7a-fbd9d9b39525", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 90, "order_index": 4, "notes": "Control descent - avoid momentum swing"}
  ]'::jsonb,
  35,
  ARRAY['bodyweight', 'pull_up_bar'],
  ARRAY['beginner', 'no_equipment', 'home_workout', 'travel_friendly'],
  true,
  NULL
);

-- Template 11: Upper/Lower Hybrid (Intermediate)
INSERT INTO templates (name, description, difficulty, exercises, estimated_duration_minutes, equipment_needed, recommended_for, is_public, created_by) VALUES (
  'Upper/Lower Hybrid',
  'Time-efficient hybrid workout combining upper and lower body in one session. Perfect for 3x per week training when you can''t commit to higher frequency splits.',
  'intermediate',
  '[
    {"exercise_id": "10a9f5a6-b315-49e4-bae7-54fbbb1c2bf4", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 120, "order_index": 0, "notes": "Start with legs while fresh"},
    {"exercise_id": "31acfd27-29d3-4590-b93c-0eea7394b3e4", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 90, "order_index": 1, "notes": "Primary upper push"},
    {"exercise_id": "76a9d3e8-d74c-4a2b-814a-c61785e8b58e", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 90, "order_index": 2, "notes": "Balance with upper pull"},
    {"exercise_id": "7436cf94-bf2f-49a0-bddd-2118f28462f5", "target_sets": 3, "reps_range": "10-15", "rest_seconds": 90, "order_index": 3, "notes": "Additional leg volume"},
    {"exercise_id": "71c70942-5f72-4de2-a7bf-8949546e762b", "target_sets": 3, "reps_range": "8-12", "rest_seconds": 90, "order_index": 4, "notes": "Shoulder finisher"}
  ]'::jsonb,
  55,
  ARRAY['barbell', 'machine', 'rack', 'bench'],
  ARRAY['intermediate', 'time_efficient', '3x_per_week', 'hybrid'],
  true,
  NULL
);

-- Template 12: Core & Conditioning (All Levels)
INSERT INTO templates (name, description, difficulty, exercises, estimated_duration_minutes, equipment_needed, recommended_for, is_public, created_by) VALUES (
  'Core & Conditioning',
  'Core-focused recovery session with light conditioning work. Perfect as a fourth training day or active recovery between heavy sessions to maintain movement quality.',
  'beginner',
  '[
    {"exercise_id": "c5f3e0ba-e5c0-4d44-9564-88da036ca7e1", "target_sets": 4, "reps_range": "12-15", "rest_seconds": 60, "order_index": 0, "notes": "Crunch down hard - exhale at bottom"},
    {"exercise_id": "3dbaf998-a1e6-4b4e-aa7a-fbd9d9b39525", "target_sets": 3, "reps_range": "10-12", "rest_seconds": 60, "order_index": 1, "notes": "Control descent slowly"},
    {"exercise_id": "5ae9038b-33c0-485a-a4b6-2040f685da15", "target_sets": 3, "reps_range": "45-60s", "rest_seconds": 60, "order_index": 2, "notes": "Hold perfect form - breathe steadily"},
    {"exercise_id": "0a05ac57-3acb-4207-896c-64c09ed8441c", "target_sets": 3, "reps_range": "15-20", "rest_seconds": 60, "order_index": 3, "notes": "Light conditioning - maintain quality"},
    {"exercise_id": "1aeb9b32-aef3-4897-937b-33aa0d406bbc", "target_sets": 3, "reps_range": "15-20", "rest_seconds": 60, "order_index": 4, "notes": "Shoulder health and posture work"}
  ]'::jsonb,
  35,
  ARRAY['cable', 'dumbbell', 'bodyweight', 'pull_up_bar'],
  ARRAY['beginner', 'intermediate', 'advanced', 'core_focus', 'active_recovery'],
  true,
  NULL
);

-- ========================================
-- STEP 4: Validation & Verification
-- ========================================

-- Verify all templates were created
DO $$
DECLARE
  template_count INT;
  invalid_exercise_count INT;
BEGIN
  -- Count templates
  SELECT COUNT(*) INTO template_count FROM templates WHERE is_public = true;
  
  IF template_count != 12 THEN
    RAISE EXCEPTION 'Expected 12 templates, found %', template_count;
  END IF;
  
  -- Validate all exercise_ids exist in exercises table
  SELECT COUNT(*) INTO invalid_exercise_count
  FROM (
    SELECT DISTINCT (jsonb_array_elements(exercises)->>'exercise_id')::uuid as exercise_id
    FROM templates
  ) t
  WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE id = t.exercise_id
  );
  
  IF invalid_exercise_count > 0 THEN
    RAISE EXCEPTION 'Found % invalid exercise_ids in templates', invalid_exercise_count;
  END IF;
  
  RAISE NOTICE '✅ All 12 templates created successfully';
  RAISE NOTICE '✅ All exercise references validated';
  RAISE NOTICE '✅ RLS policies configured';
END $$;

-- Display template summary
SELECT 
  name,
  difficulty,
  estimated_duration_minutes,
  jsonb_array_length(exercises) as exercise_count,
  array_length(equipment_needed, 1) as equipment_types,
  array_length(recommended_for, 1) as tag_count
FROM templates
WHERE is_public = true
ORDER BY 
  CASE difficulty 
    WHEN 'beginner' THEN 1 
    WHEN 'intermediate' THEN 2 
    WHEN 'advanced' THEN 3 
  END,
  name;

-- ========================================
-- DONE: Migration Complete
-- ========================================

-- Summary:
-- ✅ Created templates table with comprehensive schema
-- ✅ Added metadata columns: estimated_duration_minutes, equipment_needed, recommended_for
-- ✅ Set up RLS policies for public and user templates
-- ✅ Seeded 12 starter templates covering all major training styles:
--    - 5 Beginner templates (Full Body A/B, Machine Circuit, Bodyweight, Core)
--    - 6 Intermediate templates (PPL split complete, Upper/Lower split, Hybrid)
--    - 1 Advanced template (Full Body C - strength focus)
-- ✅ JSONB structure matches workout_exercises schema (target_sets, reps_range, rest_seconds, order_index)
-- ✅ All exercise_ids validated against exercises table
-- ✅ Descriptions are detailed but crisp
-- ✅ Equipment and tags for smart filtering
-- ✅ Ready for Workout Player implementation (Issue #22)
