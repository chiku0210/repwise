# Workout Player UI Design Specification

**Version:** 1.2  
**Date:** 2026-02-14  
**Issue:** #22 - Build Workout Player UI  
**Status:** Design Approved  
**Last Updated:** Added template preview screen before workout start

---

## Design Philosophy

### Core Principles
1. **One-handed operation** - All primary actions thumb-reachable on mobile
2. **Calm confidence** - Dark navy UI, no visual clutter, clear focus
3. **Progressive disclosure** - Show only what's needed for current step
4. **Forgiving UX** - Easy to edit mistakes, clear confirmations for destructive actions
5. **Mobile-first PWA** - Optimized for gym usage (bright screens, sweaty fingers)
6. **Contextual help** - Form cues visible when needed, not hidden in menus
7. **Informed commitment** - Users see full workout details before starting

### User Context
- User is in gym, potentially mid-set, distracted
- Screen may be wet/dirty
- User wants minimal cognitive load
- Previous workout data helps build confidence
- Form guidance should be instantly accessible
- **NEW:** Users want to review workout before committing to start

---

## Theme & Colors

### Color Palette (from tailwind.config.ts)
```typescript
colors: {
  background: '#020617',     // Deep slate (dark navy)
  foreground: '#e5e7eb',     // Light gray text
  card: '#020617',           // Card background
  border: '#1f2937',         // Subtle borders
  muted: '#0f172a',          // Secondary surfaces
  'muted-foreground': '#9ca3af',  // Secondary text
  primary: '#3b82f6',        // Blue accent (actions)
  'primary-foreground': '#f9fafb',  // Text on primary
}
```

### Typography
- **Primary font:** Geist Sans (clean, modern)
- **Mono font:** Geist Mono (numbers, timers)
- **Sizes:**
  - Hero numbers (weight/reps input): `text-4xl` (36px)
  - Section headers: `text-xl font-semibold` (20px)
  - Body text: `text-base` (16px)
  - Helper text: `text-sm text-muted-foreground` (14px)

### Spacing
- Base unit: `4px` (Tailwind default)
- Touch targets: Minimum `44px × 44px` (iOS guideline)
- Screen padding: `p-4` (16px) on mobile
- Section gaps: `space-y-4` (16px)

---

## User Flow Overview (UPDATED)

```
Today Screen
    ↓ [Start Workout]
Template Picker (/workout)
    ↓ [Tap Template Card]
Template Detail/Preview (/workout/[templateId]/preview)  ← NEW
    ↓ [Start Workout Button]
Workout Player (/workout/[templateId])
    ├→ Exercise 1
    │   ├→ Set 1 → Rest Timer → Set 2 → Rest → Set 3
    │   └→ [Next Exercise]
    ├→ Exercise 2
    │   └→ ...
    └→ Exercise N
        └→ [Finish Workout]
Workout Summary
    ↓ [Save & Finish]
Today Screen (updated with completed workout)
```

---

## Screen 1: Template Picker

### Route
`/workout`

### Layout
```
┌─────────────────────────────────┐
│ ← Back          Templates       │  ← Header (sticky)
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │ Full Body A          [★]  │  │  ← Template Card
│  │ Beginner • 50 min        │  │
│  │                          │  │
│  │ Master the fundamental   │  │
│  │ compound movements...    │  │
│  │                          │  │
│  │ 5 exercises • Barbell    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Push Day            [★★] │  │
│  │ Intermediate • 55 min    │  │
│  │ ...                      │  │
│  └───────────────────────────┘  │
│                                 │
│  [Show more templates...]       │
│                                 │
└─────────────────────────────────┘
```

### Components

#### Template Card
```tsx
<div className="bg-muted border border-border rounded-lg p-4 space-y-3">
  {/* Header Row */}
  <div className="flex items-start justify-between">
    <div>
      <h3 className="text-lg font-semibold">{template.name}</h3>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
        <Badge difficulty={template.difficulty} />
        <span>•</span>
        <span>{template.estimated_duration_minutes} min</span>
      </div>
    </div>
    <StarButton isFavorite={false} /> {/* Phase 3 feature */}
  </div>
  
  {/* Description */}
  <p className="text-sm text-muted-foreground line-clamp-2">
    {template.description}
  </p>
  
  {/* Meta */}
  <div className="flex items-center gap-3 text-xs text-muted-foreground">
    <span>{exerciseCount} exercises</span>
    <span>•</span>
    <span>{equipment.join(', ')}</span>
  </div>
</div>
```

#### Difficulty Badge
```tsx
// Beginner: green-ish
<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
  Beginner
</span>

// Intermediate: blue
<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
  Intermediate
</span>

// Advanced: orange
<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400">
  Advanced
</span>
```

### Behavior (UPDATED)
- **On card tap:** Navigate to `/workout/{templateId}/preview` (preview screen)
- **Progressive disclosure:** Show 3 featured templates initially, "Show all" button expands
- **Filtering (Phase 3):** Equipment, difficulty, duration filters

---

## Screen 2: Template Detail/Preview (NEW)

### Route
`/workout/[templateId]/preview`

### Purpose
Allow users to review the full workout before committing to start. Shows complete exercise list, equipment needs, and full description.

### Layout
```
┌─────────────────────────────────┐
│ ← Back      Full Body A    [★] │  ← Header (sticky)
├─────────────────────────────────┤
│                                 │
│  Beginner • 50 min • 5 exercises│  ← Meta badges
│                                 │
│  Master the fundamental compound│  ← Full description
│  movements that build total-body│     (not truncated)
│  strength. Perfect for beginners│
│  training 3x per week...        │
│                                 │
│  📦 Equipment Needed             │
│  • Barbell                      │
│  • Bench                        │
│  • Squat rack                   │
│                                 │
│  💪 Exercises                    │
│                                 │
│  ┌─────────────────────────────┐│
│  │ 1. Squat                    ││  ← Exercise preview
│  │    3 sets • 8-12 reps   [>] ││
│  │    Quads, Glutes            ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ 2. Bench Press              ││
│  │    3 sets • 8-12 reps   [>] ││
│  │    Chest, Triceps           ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ 3. Barbell Row              ││
│  │    3 sets • 8-12 reps   [>] ││
│  │    Back, Biceps             ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ 4. Overhead Press           ││
│  │    3 sets • 8-12 reps   [>] ││
│  │    Shoulders, Triceps       ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ 5. Deadlift                 ││
│  │    3 sets • 5-8 reps    [>] ││
│  │    Back, Hamstrings, Glutes ││
│  └─────────────────────────────┘│
│                                 │
│                                 │
├─────────────────────────────────┤  ← Sticky footer
│  ┌─────────────────────────────┐│
│  │   Start Workout 🚀          ││  ← Primary CTA
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

### Component
```tsx
<div className="min-h-screen bg-background pb-24">
  {/* Header */}
  <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
    <button onClick={() => router.back()}>
      <ChevronLeft className="w-6 h-6" />
    </button>
    <h1 className="text-lg font-semibold">{template.name}</h1>
    <button onClick={handleToggleFavorite}>
      <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
    </button>
  </div>
  
  <div className="p-4 space-y-6">
    {/* Meta Row */}
    <div className="flex items-center gap-2 text-sm flex-wrap">
      <Badge difficulty={template.difficulty} />
      <span className="text-muted-foreground">•</span>
      <span className="text-muted-foreground">{template.estimated_duration_minutes} min</span>
      <span className="text-muted-foreground">•</span>
      <span className="text-muted-foreground">{exerciseCount} exercises</span>
    </div>
    
    {/* Full Description */}
    <p className="text-muted-foreground leading-relaxed">
      {template.description}
    </p>
    
    {/* Equipment Section */}
    <div>
      <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Package className="w-4 h-4" />
        Equipment Needed
      </h2>
      <div className="flex flex-wrap gap-2">
        {template.equipment_needed.map((eq) => (
          <span key={eq} className="px-3 py-1 bg-muted border border-border rounded-full text-sm">
            {eq}
          </span>
        ))}
      </div>
    </div>
    
    {/* Exercises List */}
    <div>
      <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Dumbbell className="w-4 h-4" />
        Exercises
      </h2>
      <div className="space-y-2">
        {exercises.map((exercise, i) => (
          <ExercisePreviewCard
            key={exercise.id}
            exercise={exercise}
            orderIndex={i + 1}
          />
        ))}
      </div>
    </div>
  </div>
  
  {/* Sticky CTA Footer */}
  <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
    <button
      onClick={handleStartWorkout}
      className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg flex items-center justify-center gap-2 active:scale-95 transition"
    >
      Start Workout
      <Zap className="w-5 h-5" />
    </button>
  </div>
</div>
```

### ExercisePreviewCard Component
```tsx
interface ExercisePreviewCardProps {
  exercise: {
    id: string;
    name: string;
    target_sets: number;
    reps_range: string; // e.g., "8-12"
    primary_muscles: string[];
  };
  orderIndex: number;
}

export function ExercisePreviewCard({ exercise, orderIndex }: ExercisePreviewCardProps) {
  return (
    <div className="bg-muted border border-border rounded-lg p-3 hover:bg-muted/80 transition cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground font-semibold">
              {orderIndex}.
            </span>
            <h3 className="font-semibold">{exercise.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {exercise.target_sets} sets • {exercise.reps_range} reps
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {exercise.primary_muscles.join(', ')}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      </div>
    </div>
  );
}
```

### Behavior
- **On mount:** Fetch template details with exercises via JOIN query
- **Star button:** Toggle favorite status (Phase 3 feature, non-blocking)
- **Exercise card tap (Phase 3):** Open exercise detail modal with form cues, video demos
- **Start Workout button:**
  - Navigate to `/workout/{templateId}` (workout player)
  - Initialize workout session in memory
  - Start localStorage persistence
  - Record `startedAt` timestamp
- **Back button:** Return to template picker

### Why This Screen is Important
1. ✅ **Informed decision** - User sees full commitment before starting
2. ✅ **Equipment check** - User can verify they have needed equipment
3. ✅ **Mental preparation** - User knows what's coming
4. ✅ **Reduces errors** - Prevents accidental workout starts
5. ✅ **Builds confidence** - Clear expectations for beginners
6. ✅ **Standard UX pattern** - Matches user expectations from other fitness apps

---

## Screen 3: Workout Player - Exercise View

### Route
`/workout/[templateId]`

### Layout (Active Set Input)
```
┌─────────────────────────────────┐
│ ←  Squat              [⋮ Menu] │  ← Header (sticky)
│ Exercise 1 of 5                │  ← Progress
├─────────────────────────────────┤
│ ▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← Progress bar (20%)
├─────────────────────────────────┤
│                                 │
│  Primary: Quads, Glutes         │  ← Muscle tags
│                                 │
│  ┌─────────────────────────────┐│  ← Form cues (collapsed)
│  │ 💡 Form Tips        [▼]     ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ Set 1 of 3                  ││  ← Set tracker
│  └─────────────────────────────┘│
│                                 │
│  Weight (kg)                    │
│  ┌─────────────────────────────┐│
│  │         100                 ││  ← Large input
│  └─────────────────────────────┘│
│  Last time: 95 kg               │  ← Hint
│                                 │
│  Reps                           │
│  ┌─────────────────────────────┐│
│  │          8                  ││  ← Large input
│  └─────────────────────────────┘│
│  Last time: 10 reps             │  ← Hint
│                                 │
│  Target: 8-12 reps             │  ← Template guidance
│                                 │
│  ┌─────────────────────────────┐│
│  │      Log Set                ││  ← Primary CTA
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

### Layout (Form Cues Expanded)
```
┌─────────────────────────────────┐
│  Primary: Quads, Glutes         │
│                                 │
│  ┌─────────────────────────────┐│  ← Form cues (expanded)
│  │ 💡 Form Tips        [▲]     ││
│  ├─────────────────────────────┤│
│  │ ✓ Feet shoulder-width       ││
│  │   apart                     ││
│  │                             ││
│  │ ✓ Chest up, core braced     ││
│  │                             ││
│  │ ✓ Break at hips and knees   ││
│  │   simultaneously            ││
│  │                             ││
│  │ ✓ Descend until thighs      ││
│  │   parallel to ground        ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ Set 1 of 3                  ││
│  └─────────────────────────────┘│
│                                 │
│  Weight (kg)                    │
│  ...                            │
└─────────────────────────────────┘
```

### Layout (Logged Sets View)
```
┌─────────────────────────────────┐
│ ←  Squat              [⋮ Menu] │
│ Exercise 1 of 5                │
├─────────────────────────────────┤
│ ▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░ │
├─────────────────────────────────┤
│                                 │
│  ✓ Completed Sets               │
│                                 │
│  ┌─────────────────────────────┐│
│  │ Set 1  100 kg × 8 reps  [✏] ││  ← Editable
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ Set 2  100 kg × 8 reps  [✏] ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ Set 3  100 kg × 7 reps  [✏] ││
│  └─────────────────────────────┘│
│                                 │
│                                 │
│  ┌─────────────────────────────┐│
│  │   Next Exercise →           ││  ← Next action
│  └─────────────────────────────┘│
│                                 │
│  [+ Add Set]                    │  ← Optional 4th set
│                                 │
└─────────────────────────────────┘
```

### Components

#### Exercise Header
```tsx
<div className="flex items-center justify-between px-4 py-3 border-b border-border">
  <div className="flex items-center gap-3">
    <button onClick={handleBack}>
      <ChevronLeft className="w-6 h-6" />
    </button>
    <div>
      <h1 className="text-xl font-semibold">{exercise.name}</h1>
      <p className="text-sm text-muted-foreground">
        Exercise {currentIndex + 1} of {totalExercises}
      </p>
    </div>
  </div>
  <button onClick={handleMenu}>
    <MoreVertical className="w-6 h-6" />
  </button>
</div>
```

#### Progress Bar
```tsx
<div className="h-1 bg-muted">
  <div 
    className="h-full bg-primary transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

#### Form Cues Collapsible
```tsx
'use client';

import { useState } from 'react';
import { Lightbulb, ChevronDown, Check } from 'lucide-react';

interface FormCuesCollapsibleProps {
  cues: string[];
  defaultOpen?: boolean;
}

export function FormCuesCollapsible({ cues, defaultOpen = false }: FormCuesCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3 bg-muted/50 hover:bg-muted transition"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium">Form Tips</span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      {isOpen && (
        <div className="p-3 space-y-2 border-t border-border animate-in slide-in-from-top-2">
          {cues.map((cue, i) => (
            <div key={i} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{cue}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Usage in Exercise View:**
```tsx
<div className="space-y-4 p-4">
  {/* Muscle Tags */}
  <div className="text-sm text-muted-foreground">
    Primary: {exercise.primary_muscles.join(', ')}
  </div>
  
  {/* Form Cues (open on first set, closed after) */}
  <FormCuesCollapsible 
    cues={exercise.form_cues}
    defaultOpen={currentSetIndex === 0}
  />
  
  {/* Set Tracker */}
  <div className="text-center py-2 bg-muted rounded-lg">
    <p className="text-sm font-medium">
      Set {currentSetIndex + 1} of {targetSets}
    </p>
  </div>
  
  {/* Weight/Reps Inputs ... */}
</div>
```

#### Set Input Form
```tsx
<div className="space-y-6 p-4">
  {/* Weight Input */}
  <div className="space-y-2">
    <label className="text-sm font-medium">Weight (kg)</label>
    <input
      type="number"
      inputMode="decimal"
      className="w-full text-4xl font-mono text-center bg-muted border border-border rounded-lg py-4 focus:ring-2 focus:ring-primary"
      value={weight}
      onChange={(e) => setWeight(e.target.value)}
      placeholder="0"
    />
    {lastWeight && (
      <p className="text-sm text-muted-foreground">
        Last time: {lastWeight} kg
      </p>
    )}
  </div>
  
  {/* Reps Input */}
  <div className="space-y-2">
    <label className="text-sm font-medium">Reps</label>
    <input
      type="number"
      inputMode="numeric"
      className="w-full text-4xl font-mono text-center bg-muted border border-border rounded-lg py-4 focus:ring-2 focus:ring-primary"
      value={reps}
      onChange={(e) => setReps(e.target.value)}
      placeholder="0"
    />
    {lastReps && (
      <p className="text-sm text-muted-foreground">
        Last time: {lastReps} reps
      </p>
    )}
  </div>
  
  {/* Template Guidance */}
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <Target className="w-4 h-4" />
    <span>Target: {targetRepsRange} reps</span>
  </div>
  
  {/* Primary Action */}
  <button
    onClick={handleLogSet}
    disabled={!weight || !reps}
    className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition"
  >
    Log Set
  </button>
</div>
```

#### Logged Set Item
```tsx
<div className="flex items-center justify-between bg-muted border border-border rounded-lg p-4">
  <div>
    <p className="text-sm text-muted-foreground">Set {setNumber}</p>
    <p className="text-lg font-semibold font-mono">
      {weight} kg × {reps} reps
    </p>
  </div>
  <button 
    onClick={() => handleEdit(setIndex)}
    className="p-2 hover:bg-background rounded"
  >
    <Edit2 className="w-5 h-5 text-muted-foreground" />
  </button>
</div>
```

### Behavior
- **Form Cues Collapsible:**
  - Default **open** on Set 1 of each exercise (help when most needed)
  - Default **closed** on Set 2+ (less clutter after user has seen cues)
  - User can toggle open/closed anytime
  - Smooth expand/collapse animation (200ms)
  - Zero extra taps when expanded (contextual help)
- **Weight/Reps inputs:** 
  - `inputMode="decimal"` for weight (allows decimals like 22.5 kg)
  - `inputMode="numeric"` for reps (integers only)
  - Auto-focus weight input when set starts
- **Log Set button:**
  - Disabled until both weight and reps filled
  - On tap: Add to logged sets, show rest timer (if not last set)
  - Haptic feedback on success
- **Edit logged set:**
  - Opens bottom sheet with pre-filled weight/reps
  - "Save" or "Delete" options
- **Next Exercise:**
  - Only appears after all target sets logged
  - Advances to next exercise in template

---

## Screen 4: Rest Timer

### Layout (Overlay)
```
┌─────────────────────────────────┐
│                                 │
│                                 │
│         Rest Timer              │
│                                 │
│            ⏱️                   │
│                                 │
│           01:30                 │  ← Countdown (MM:SS)
│                                 │
│    Next: Set 2 of 3             │
│                                 │
│                                 │
│  ┌─────────────────────────┐   │
│  │   Start Next Set        │   │  ← Green CTA
│  └─────────────────────────┘   │
│                                 │
│  [Skip Rest]                    │  ← Secondary action
│                                 │
└─────────────────────────────────┘
```

### Component
```tsx
<div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
  <div className="text-center space-y-8 p-8">
    <div>
      <p className="text-muted-foreground mb-2">Rest Timer</p>
      <p className="text-6xl font-mono font-bold">
        {formatTime(remainingSeconds)}
      </p>
    </div>
    
    <p className="text-lg text-muted-foreground">
      Next: Set {nextSetNumber} of {totalSets}
    </p>
    
    <div className="space-y-3">
      <button
        onClick={handleStartNextSet}
        className="w-full py-4 bg-green-600 text-white rounded-lg font-semibold text-lg active:scale-95 transition"
      >
        Start Next Set
      </button>
      
      <button
        onClick={handleSkipRest}
        className="text-muted-foreground underline"
      >
        Skip Rest
      </button>
    </div>
  </div>
</div>
```

### Behavior
- **Auto-start:** Appears immediately after logging a set (not on last set of exercise)
- **Default duration:** From template's `rest_seconds` (usually 60-180s)
- **Countdown:** Updates every second
- **Audio/Haptic:** Optional beep/vibrate at 10s, 5s, 0s
- **Skip:** Immediately closes, returns to set input
- **Start Next Set:** Closes timer, increments set counter, resets inputs
- **Keep screen awake:** Use Wake Lock API during rest

---

## Screen 5: Workout Summary

### Layout
```
┌─────────────────────────────────┐
│         Workout Complete! 🎉    │  ← Celebration
├─────────────────────────────────┤
│                                 │
│  Full Body A                    │  ← Template name
│  Friday, Feb 13 • 10:27 PM     │  ← Timestamp
│                                 │
│  ┌─────────────────────────┐   │
│  │ ⏱️  Duration             │   │
│  │    52 minutes            │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 💪 Exercises             │   │
│  │    5 completed           │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔢 Total Sets            │   │
│  │    15 logged             │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🏋️ Total Volume          │   │
│  │    4,250 kg              │   │
│  └─────────────────────────┘   │
│                                 │
│                                 │
│  ┌─────────────────────────┐   │
│  │   Save & Finish         │   │  ← Primary CTA
│  └─────────────────────────┘   │
│                                 │
│  [Discard Workout]              │  ← Danger action
│                                 │
└─────────────────────────────────┘
```

### Component
```tsx
<div className="min-h-screen bg-background p-4">
  <div className="max-w-md mx-auto space-y-6">
    {/* Header */}
    <div className="text-center space-y-2">
      <h1 className="text-2xl font-bold">Workout Complete! 🎉</h1>
      <div className="text-muted-foreground">
        <p className="font-semibold">{template.name}</p>
        <p className="text-sm">{formatDate(finishedAt)}</p>
      </div>
    </div>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-2 gap-4">
      <StatCard icon="⏱️" label="Duration" value={`${duration} min`} />
      <StatCard icon="💪" label="Exercises" value={`${exerciseCount} completed`} />
      <StatCard icon="🔢" label="Total Sets" value={`${setCount} logged`} />
      <StatCard icon="🏋️" label="Total Volume" value={`${volume.toLocaleString()} kg`} />
    </div>
    
    {/* Actions */}
    <div className="space-y-3 pt-4">
      <button
        onClick={handleSave}
        className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg"
      >
        Save & Finish
      </button>
      
      <button
        onClick={handleDiscard}
        className="w-full text-red-400 underline"
      >
        Discard Workout
      </button>
    </div>
  </div>
</div>
```

### Behavior
- **Auto-show:** Appears after last set of last exercise logged
- **Calculations:**
  - Duration: `finishedAt - startedAt` (rounded to minutes)
  - Exercises: Count of exercises with ≥1 logged set
  - Total sets: Sum of all logged sets
  - Total volume: `Σ(weight × reps)` across all sets
- **Save & Finish:**
  1. Create `workout` row (template_id, started_at, finished_at, user_id)
  2. Insert all `sets` rows (workout_id, exercise_id, set_number, weight_kg, reps)
  3. Clear localStorage
  4. Navigate to Today screen (shows workout in history)
- **Discard:**
  - Show confirmation: "Are you sure? All progress will be lost."
  - On confirm: Clear state, navigate to Today

---

## Interaction: Back Button During Workout

### Improved Flow

**Scenario:** User taps back button mid-workout (has logged ≥1 set).

```
┌─────────────────────────────────┐
│    Save workout progress?       │  ← Bottom sheet
├─────────────────────────────────┤
│                                 │
│  You've completed 2 exercises   │
│  and logged 6 sets.             │
│                                 │
│  What would you like to do?     │
│                                 │
│  ┌─────────────────────────┐   │
│  │  Save & Exit            │   │  ← Primary (green)
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  Continue Workout       │   │  ← Secondary
│  └─────────────────────────┘   │
│                                 │
│  [Discard & Exit]               │  ← Danger (red)
│                                 │
└─────────────────────────────────┘
```

### Component
```tsx
<BottomSheet isOpen={showExitDialog} onClose={() => setShowExitDialog(false)}>
  <div className="p-6 space-y-4">
    <div className="text-center space-y-2">
      <h2 className="text-xl font-semibold">Save workout progress?</h2>
      <p className="text-muted-foreground">
        You've completed {completedExercises} exercises and logged {totalSets} sets.
      </p>
      <p className="text-sm text-muted-foreground">
        What would you like to do?
      </p>
    </div>
    
    <div className="space-y-3">
      {/* Primary: Save partial workout */}
      <button
        onClick={handleSaveAndExit}
        className="w-full py-4 bg-green-600 text-white rounded-lg font-semibold"
      >
        Save & Exit
      </button>
      
      {/* Secondary: Resume */}
      <button
        onClick={() => setShowExitDialog(false)}
        className="w-full py-4 bg-muted border border-border rounded-lg font-semibold"
      >
        Continue Workout
      </button>
      
      {/* Danger: Discard */}
      <button
        onClick={handleDiscardAndExit}
        className="w-full text-red-400 underline"
      >
        Discard & Exit
      </button>
    </div>
  </div>
</BottomSheet>
```

### Behavior
- **Trigger:** Back button tap when `loggedSets.length > 0`
- **Save & Exit:**
  - Save workout as "partial" (could add `status: 'partial' | 'complete'` field)
  - Persist all logged sets
  - Mark incomplete exercises as skipped (don't create set rows)
  - Clear localStorage
  - Navigate to Today
- **Continue Workout:**
  - Close dialog
  - Return to current exercise
- **Discard & Exit:**
  - Show second confirmation: "Really discard? This can't be undone."
  - Clear all state and localStorage
  - Navigate to Today

**Database Impact:**
```sql
-- Add status field to workouts table (future migration)
ALTER TABLE workouts ADD COLUMN status TEXT DEFAULT 'complete' 
  CHECK (status IN ('complete', 'partial'));

-- Partial workout = some exercises have 0 sets logged
-- Complete workout = all exercises have ≥1 set logged
```

---

## Interaction: Edit/Delete Logged Set

### Edit Flow
```
┌─────────────────────────────────┐
│         Edit Set                │  ← Bottom sheet
├─────────────────────────────────┤
│                                 │
│  Set 2                          │
│                                 │
│  Weight (kg)                    │
│  ┌─────────────────────────┐   │
│  │         100             │   │  ← Pre-filled
│  └─────────────────────────┘   │
│                                 │
│  Reps                           │
│  ┌─────────────────────────┐   │
│  │          8              │   │  ← Pre-filled
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │      Save Changes       │   │  ← Primary
│  └─────────────────────────┘   │
│                                 │
│  [Delete Set]                   │  ← Danger
│  [Cancel]                       │  ← Secondary
│                                 │
└─────────────────────────────────┘
```

### Behavior
- **Edit:** Updates logged set in memory, re-saves to localStorage
- **Delete:** Removes set from logged sets array, shifts subsequent set numbers
- **Cancel:** Closes sheet without changes

---

## Interaction: Menu (Exercise Screen)

### Menu Options
```
┌─────────────────────────────────┐
│         Workout Options         │  ← Bottom sheet
├─────────────────────────────────┤
│                                 │
│  Skip This Exercise             │  ← Jump to next
│  Add Note to Workout            │  ← Phase 3: workout notes
│  End Workout Early              │  ← Go to summary
│                                 │
│  [Cancel]                       │
│                                 │
└─────────────────────────────────┘
```

**Note:** "View Form Cues" removed from menu since cues are now inline via collapsible component.

---

## Responsive Design

### Mobile (< 768px)
- Full width cards
- Single column layout
- Bottom navigation fixed
- Large touch targets (48px minimum)

### Tablet (≥ 768px)
- Max-width container: `max-w-2xl mx-auto`
- Two-column template picker grid
- Larger text for readability at distance

### Desktop (≥ 1024px)
- Max-width container: `max-w-4xl mx-auto`
- Three-column template picker grid
- Side-by-side set input (weight | reps)

---

## Accessibility

### Touch Targets
- Minimum 44×44px for all interactive elements
- Spacing between adjacent buttons ≥ 8px

### Color Contrast
- Text on background: ≥ 4.5:1 ratio
- Primary button text: ≥ 4.5:1 ratio
- Border contrast: ≥ 3:1 ratio

### Screen Reader Support
- Semantic HTML (`<nav>`, `<main>`, `<button>`)
- ARIA labels for icon-only buttons
- Form labels properly associated
- Focus management (auto-focus inputs)
- Collapsible regions use `aria-expanded`

### Keyboard Navigation
- Tab order logical (top to bottom, left to right)
- Enter to submit forms
- Escape to close modals/sheets
- Space to toggle collapsibles

---

## Performance Considerations

### Data Loading
- **Templates list:** Fetch once on `/workout` mount, cache in memory
- **Template detail (NEW):** Fetch on preview page mount, include exercises via JOIN
- **Workout player:** Use cached template data from preview, no re-fetch
- **Previous workout data:** Fetch on exercise change (lazy load per exercise)

### State Persistence
- **localStorage schema:**
  ```json
  {
    "version": 1,
    "templateId": "uuid",
    "templateName": "Full Body A",
    "startedAt": "2026-02-13T22:27:00Z",
    "currentExerciseIndex": 2,
    "currentSetIndex": 1,
    "loggedSets": [
      {
        "exerciseId": "uuid",
        "exerciseIndex": 0,
        "setNumber": 1,
        "weight": 100,
        "reps": 8,
        "loggedAt": "2026-02-13T22:30:00Z"
      }
    ]
  }
  ```
- **Auto-save:** On every set log, debounced by 500ms
- **Recovery:** On player mount, check localStorage, show "Resume workout?" dialog

### Wake Lock API
```typescript
let wakeLock: WakeLockSentinel | null = null;

async function keepScreenAwake() {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
  } catch (err) {
    console.warn('Wake Lock failed:', err);
  }
}

function releaseWakeLock() {
  wakeLock?.release();
  wakeLock = null;
}

// Call keepScreenAwake() on workout start
// Call releaseWakeLock() on workout end/exit
```

---

## Error Handling

### Network Errors
- **Template fetch fails:** Show retry button with error message
- **Save fails:** Queue in localStorage, retry on reconnect
- **Offline mode:** Show banner "Working offline. Changes will sync when online."

### Validation Errors
- **Invalid weight/reps:** Show inline error "Must be > 0"
- **Database constraint violation:** Catch and show user-friendly message

### Edge Cases
- **User leaves mid-workout:** localStorage preserves state, offer resume on return
- **Template deleted during workout:** Gracefully degrade (show cached data)
- **Session expires:** Re-authenticate before saving workout

---

## Animation & Transitions

### Micro-interactions
- **Button press:** `active:scale-95` (subtle press effect)
- **Set logged:** Green checkmark animation + haptic pulse
- **Next exercise:** Slide-in transition (left to right)
- **Rest timer:** Circular progress ring around countdown
- **Collapsible expand/collapse:** Smooth 200ms transition with chevron rotation

### Page Transitions
- **Enter:** Fade in + slide up (200ms)
- **Exit:** Fade out (150ms)
- **Bottom sheets:** Slide up from bottom (300ms ease-out)

### Loading States
- **Template list:** Skeleton cards (pulse animation)
- **Template preview:** Skeleton for exercises list
- **Save workout:** Button shows spinner, disabled state

---

## Implementation Phases

### Phase 1: Core Flow (MVP)
- [ ] Template picker page
- [ ] **Template preview/detail page** (NEW - shows exercises before start)
- [ ] Exercise view with set logging
- [ ] **Form cues collapsible component** (inline, contextual)
- [ ] Basic rest timer
- [ ] Workout summary & save to DB
- [ ] localStorage persistence

### Phase 2: Polish
- [ ] "Last time" hints from previous workouts
- [ ] Edit/delete logged sets
- [ ] Improved back button (save/discard dialog)
- [ ] Progress bar and exercise counter

### Phase 3: Enhancements
- [ ] Workout notes
- [ ] Skip exercise
- [ ] Add extra set beyond template
- [ ] Workout history view
- [ ] PR celebrations (🎉 when new personal record)
- [ ] Exercise detail modal from preview (form cues, video demos)

---

## Component Library

### Reusable Components to Build
```typescript
// UI Primitives
<Button variant="primary | secondary | danger" size="sm | md | lg" />
<Input type="text | number" label="..." hint="..." error="..." />
<Badge variant="success | info | warning | danger" />
<BottomSheet isOpen={bool} onClose={() => {}} />
<Modal isOpen={bool} onClose={() => {}} />
<Collapsible defaultOpen={bool}>
  <CollapsibleTrigger />
  <CollapsibleContent />
</Collapsible>

// Domain Components
<TemplateCard template={Template} onSelect={() => {}} />
<ExercisePreviewCard exercise={Exercise} orderIndex={number} /> {/* NEW */}
<ExerciseHeader exercise={Exercise} progress={number} />
<FormCuesCollapsible cues={string[]} defaultOpen={bool} />
<SetInputForm onSubmit={(data) => {}} />
<LoggedSetItem set={Set} onEdit={() => {}} onDelete={() => {}} />
<RestTimer duration={number} onComplete={() => {}} />
<ProgressBar current={number} total={number} />
<WorkoutSummary stats={Stats} onSave={() => {}} onDiscard={() => {}} />
```

---

## Route Structure (UPDATED)

```
/workout                           → Template picker
/workout/[templateId]/preview      → Template preview/detail (NEW)
/workout/[templateId]              → Workout player (active session)
```

**Navigation Flow:**
1. User taps template card → Navigate to `/workout/[id]/preview`
2. User reviews exercises, equipment → Taps "Start Workout"
3. Navigate to `/workout/[id]` → Player starts, `startedAt` recorded

---

## Technical Stack Summary

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS (dark navy theme)
- **State:** React hooks + Context (or Zustand)
- **Database:** Supabase (PostgreSQL + Realtime)
- **Storage:** localStorage (workout state persistence)
- **PWA:** Service worker + manifest (already configured)
- **TypeScript:** Strict mode, no `any`
- **Icons:** Lucide React (Lightbulb, ChevronDown, Check, Package, Dumbbell, Zap, etc.)

---

## Design Decisions Log

### v1.2 (2026-02-14)
**Decision:** Add template preview/detail screen before workout start  
**Rationale:** 
- User needs to see full commitment before starting workout
- Equipment verification prevents mid-workout surprises
- Reduces accidental workout starts
- Builds user confidence (especially beginners)
- Matches standard fitness app UX patterns

**Impact:**
- Added new route: `/workout/[templateId]/preview`
- Template card now navigates to preview (not directly to player)
- Added `ExercisePreviewCard` component
- Updated user flow diagram
- Added to Phase 1 checklist
- Improved data loading strategy (fetch on preview, cache for player)

### v1.1 (2026-02-14)
**Decision:** Move form cues from menu to inline collapsible component  
**Rationale:** 
- Better UX - zero friction access to form guidance
- Contextual help when needed (open on Set 1, closed after)
- More discoverable than hidden menu option
- Reduces menu clutter

**Impact:**
- Added `FormCuesCollapsible` component to Phase 1
- Updated Exercise View layout
- Simplified menu to 3 options (removed "View Form Cues")

---

## Open Questions / Decisions Needed

1. **State management:** React Context vs Zustand for workout player state?
2. **Timer audio:** Should rest timer beep at intervals? (Configurable in settings?)
3. **Partial workouts:** Do we add `status` field to workouts table now or Phase 3?
4. **Set deletion:** If user deletes Set 2 of 3, do we renumber (Set 3 → Set 2) or keep gaps?
5. **Template filtering:** Implement in Phase 2 or Phase 3?
6. **Offline queue:** Build retry logic now or assume connectivity?

---

## Success Metrics

### User Experience
- Template preview → workout start < 2 taps
- Average time to log a set < 10 seconds
- Zero data loss on refresh/navigate away
- 95%+ of workouts saved successfully
- Form cues accessed within first 2 sets (80%+ of new users)
- **NEW:** <5% accidental workout starts (preview screen prevents errors)

### Technical
- Page load time < 1s
- localStorage recovery rate 100%
- No layout shift during input focus
- Smooth 60fps animations
- Collapsible animations render at 60fps

---

**Status:** Design approved and ready for implementation  
**Next:** Begin Phase 1 development (core flow with preview screen)
