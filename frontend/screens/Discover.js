'use client';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '⚡', color: '#2563EB' },
  { id: 'gym', label: 'Gym', icon: '🏋️', color: '#1D4ED8' },
  { id: 'cardio', label: 'Cardio', icon: '🏃', color: '#DC2626' },
  { id: 'yoga', label: 'Yoga', icon: '🧘', color: '#0891B2' },
  { id: 'calisthenics', label: 'Calisthenics', icon: '🤸', color: '#065F46' },
  { id: 'martial arts', label: 'Martial Arts', icon: '🥊', color: '#92400E' },
  { id: 'rehab', label: 'Rehab', icon: '♿', color: '#5B21B6' },
  { id: 'bodyweight', label: 'Bodyweight', icon: '💪', color: '#1E40AF' },
];

const CAT_GRADIENTS = {
  gym: 'linear-gradient(135deg, #1D4ED8, #7C3AED)',
  cardio: 'linear-gradient(135deg, #DC2626, #F97316)',
  yoga: 'linear-gradient(135deg, #0891B2, #06B6D4)',
  calisthenics: 'linear-gradient(135deg, #065F46, #10B981)',
  'martial arts': 'linear-gradient(135deg, #92400E, #F59E0B)',
  rehab: 'linear-gradient(135deg, #5B21B6, #8B5CF6)',
  bodyweight: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
};

const LEVEL_COLORS = { Beginner: '#10B981', Intermediate: '#F59E0B', Advanced: '#EF4444' };

const WORKOUT_CATALOG = [
  {
    id: 1, title: 'Full Body Blast', category: 'gym', duration: 40, level: 'Intermediate',
    desc: 'Complete full-body strength circuit combining compound movements for maximum muscle activation and calorie burn.',
    exercises: [
      { name: 'Barbell Squat', reps: 10, duration: 30, type: 'legs', cals: 13 },
      { name: 'Bench Press', reps: 10, duration: 30, type: 'chest', cals: 11 },
      { name: 'Deadlift', reps: 8, duration: 30, type: 'back', cals: 13 },
      { name: 'Overhead Press', reps: 10, duration: 30, type: 'shoulders', cals: 10 },
      { name: 'Pull-Ups', reps: 8, duration: 30, type: 'back', cals: 11 },
      { name: 'Dips', reps: 10, duration: 30, type: 'chest', cals: 10 },
      { name: 'Cable Row', reps: 12, duration: 30, type: 'back', cals: 9 },
      { name: 'Hanging Leg Raises', reps: 12, duration: 30, type: 'core', cals: 9 },
    ],
  },
  {
    id: 2, title: 'HIIT Cardio Burn', category: 'cardio', duration: 25, level: 'Intermediate',
    desc: 'High-intensity intervals that torch calories fast and keep your metabolism elevated for hours afterward.',
    exercises: [
      { name: 'Jumping Jacks', reps: 30, duration: 30, type: 'cardio', cals: 8 },
      { name: 'High Knees', reps: 30, duration: 30, type: 'cardio', cals: 10 },
      { name: 'Burpees', reps: 10, duration: 30, type: 'full body', cals: 14 },
      { name: 'Mountain Climbers', reps: 20, duration: 30, type: 'core', cals: 10 },
      { name: 'Jump Squats', reps: 15, duration: 30, type: 'legs', cals: 12 },
      { name: 'Box Jumps', reps: 10, duration: 30, type: 'legs', cals: 13 },
      { name: 'Plyo Push-Ups', reps: 10, duration: 30, type: 'chest', cals: 12 },
      { name: 'Lateral Shuffles', reps: 20, duration: 30, type: 'cardio', cals: 9 },
      { name: 'Sprint in Place', reps: 30, duration: 30, type: 'cardio', cals: 11 },
      { name: 'Cool Down Walk', reps: 1, duration: 30, type: 'recovery', cals: 4 },
    ],
  },
  {
    id: 3, title: 'Morning Yoga Flow', category: 'yoga', duration: 30, level: 'Beginner',
    desc: 'Energizing yoga sequence to wake your body, improve mobility, and set a calm, focused tone for your day.',
    exercises: [
      { name: 'Child\'s Pose', reps: 1, duration: 30, type: 'flexibility', cals: 3 },
      { name: 'Cat-Cow Stretch', reps: 10, duration: 30, type: 'mobility', cals: 4 },
      { name: 'Downward Dog', reps: 1, duration: 30, type: 'strength', cals: 5 },
      { name: 'Sun Salutation A', reps: 3, duration: 30, type: 'flow', cals: 6 },
      { name: 'Warrior I', reps: 1, duration: 30, type: 'balance', cals: 5 },
      { name: 'Warrior II', reps: 1, duration: 30, type: 'balance', cals: 5 },
      { name: 'Triangle Pose', reps: 1, duration: 30, type: 'flexibility', cals: 4 },
      { name: 'Seated Forward Fold', reps: 1, duration: 30, type: 'flexibility', cals: 3 },
      { name: 'Spinal Twist', reps: 1, duration: 30, type: 'mobility', cals: 3 },
      { name: 'Savasana', reps: 1, duration: 30, type: 'recovery', cals: 2 },
      { name: 'Bridge Pose', reps: 10, duration: 30, type: 'strength', cals: 5 },
      { name: 'Happy Baby', reps: 1, duration: 30, type: 'flexibility', cals: 3 },
    ],
  },
  {
    id: 4, title: 'Calisthenics Power', category: 'calisthenics', duration: 45, level: 'Advanced',
    desc: 'Bodyweight mastery session focusing on pushing, pulling, and core strength for elite bodyweight control.',
    exercises: [
      { name: 'Muscle-Up Progressions', reps: 5, duration: 30, type: 'upper body', cals: 14 },
      { name: 'Pistol Squats', reps: 8, duration: 30, type: 'legs', cals: 13 },
      { name: 'Planche Lean', reps: 1, duration: 20, type: 'core', cals: 10 },
      { name: 'L-Sit Hold', reps: 1, duration: 20, type: 'core', cals: 9 },
      { name: 'One-Arm Push-Up', reps: 6, duration: 30, type: 'chest', cals: 13 },
      { name: 'Dragon Flag', reps: 6, duration: 30, type: 'core', cals: 12 },
      { name: 'Handstand Hold', reps: 1, duration: 20, type: 'shoulders', cals: 10 },
      { name: 'Typewriter Pull-Ups', reps: 6, duration: 30, type: 'back', cals: 13 },
      { name: 'Front Lever Row', reps: 5, duration: 30, type: 'back', cals: 13 },
      { name: 'Human Flag Progressions', reps: 1, duration: 20, type: 'core', cals: 11 },
    ],
  },
  {
    id: 5, title: '7-Minute Abs', category: 'cardio', duration: 7, level: 'Intermediate',
    desc: 'Science-backed 7-minute core circuit targeting every abdominal muscle for definition and functional strength.',
    exercises: [
      { name: 'Crunches', reps: 20, duration: 30, type: 'upper abs', cals: 7 },
      { name: 'Leg Raises', reps: 15, duration: 30, type: 'lower abs', cals: 7 },
      { name: 'Bicycle Crunches', reps: 20, duration: 30, type: 'obliques', cals: 8 },
      { name: 'Plank Hold', reps: 1, duration: 30, type: 'core', cals: 6 },
      { name: 'Russian Twists', reps: 20, duration: 30, type: 'obliques', cals: 7 },
      { name: 'Mountain Climbers', reps: 20, duration: 30, type: 'cardio', cals: 10 },
      { name: 'V-Ups', reps: 12, duration: 30, type: 'full abs', cals: 9 },
    ],
  },
  {
    id: 6, title: 'Strength Builder', category: 'gym', duration: 55, level: 'Advanced',
    desc: 'Progressive overload program with compound and isolation movements designed for maximum hypertrophy and strength gains.',
    exercises: [
      { name: 'Barbell Back Squat', reps: 5, duration: 30, type: 'legs', cals: 14 },
      { name: 'Incline Bench Press', reps: 8, duration: 30, type: 'chest', cals: 12 },
      { name: 'Romanian Deadlift', reps: 8, duration: 30, type: 'legs', cals: 12 },
      { name: 'Weighted Pull-Ups', reps: 6, duration: 30, type: 'back', cals: 13 },
      { name: 'Barbell Row', reps: 8, duration: 30, type: 'back', cals: 12 },
      { name: 'Overhead Press', reps: 8, duration: 30, type: 'shoulders', cals: 10 },
      { name: 'Skull Crushers', reps: 10, duration: 30, type: 'triceps', cals: 9 },
      { name: 'Barbell Curl', reps: 10, duration: 30, type: 'biceps', cals: 9 },
      { name: 'Leg Press', reps: 12, duration: 30, type: 'legs', cals: 10 },
      { name: 'Cable Fly', reps: 15, duration: 30, type: 'chest', cals: 9 },
      { name: 'Lat Pulldown', reps: 12, duration: 30, type: 'back', cals: 9 },
      { name: 'Hanging Leg Raises', reps: 12, duration: 30, type: 'core', cals: 9 },
    ],
  },
  {
    id: 7, title: 'Gentle Morning Stretch', category: 'yoga', duration: 15, level: 'Beginner',
    desc: 'Easy flexibility and mobility work suitable for all ages and fitness levels. Perfect to start any morning.',
    exercises: [
      { name: 'Neck Rolls', reps: 5, duration: 30, type: 'mobility', cals: 2 },
      { name: 'Shoulder Rolls', reps: 10, duration: 30, type: 'mobility', cals: 2 },
      { name: 'Standing Side Stretch', reps: 5, duration: 30, type: 'flexibility', cals: 3 },
      { name: 'Forward Fold', reps: 1, duration: 30, type: 'flexibility', cals: 3 },
      { name: 'Hip Circles', reps: 10, duration: 30, type: 'mobility', cals: 3 },
      { name: 'Quad Stretch', reps: 1, duration: 30, type: 'flexibility', cals: 3 },
      { name: 'Calf Raises & Stretch', reps: 10, duration: 30, type: 'flexibility', cals: 4 },
      { name: 'Seated Spinal Twist', reps: 1, duration: 30, type: 'mobility', cals: 3 },
    ],
  },
  {
    id: 8, title: 'Push Day Classic', category: 'gym', duration: 50, level: 'Intermediate',
    desc: 'Complete chest, shoulders, and triceps session with progressive sets and optimal rep ranges for growth.',
    exercises: [
      { name: 'Flat Bench Press', reps: 10, duration: 30, type: 'chest', cals: 12 },
      { name: 'Incline Dumbbell Press', reps: 12, duration: 30, type: 'chest', cals: 11 },
      { name: 'Decline Bench Press', reps: 10, duration: 30, type: 'chest', cals: 11 },
      { name: 'Cable Crossover', reps: 15, duration: 30, type: 'chest', cals: 9 },
      { name: 'Overhead Press', reps: 10, duration: 30, type: 'shoulders', cals: 10 },
      { name: 'Lateral Raises', reps: 15, duration: 30, type: 'shoulders', cals: 7 },
      { name: 'Front Raises', reps: 12, duration: 30, type: 'shoulders', cals: 7 },
      { name: 'Tricep Pushdown', reps: 15, duration: 30, type: 'triceps', cals: 7 },
      { name: 'Overhead Tricep Extension', reps: 12, duration: 30, type: 'triceps', cals: 8 },
    ],
  },
  {
    id: 9, title: 'Bodyweight Only', category: 'bodyweight', duration: 30, level: 'Beginner',
    desc: 'No equipment needed. A complete total-body session you can do anywhere — hotel room, park, or living room.',
    exercises: [
      { name: 'Warm-Up Jog in Place', reps: 1, duration: 30, type: 'cardio', cals: 5 },
      { name: 'Push-Ups', reps: 15, duration: 30, type: 'chest', cals: 9 },
      { name: 'Squats', reps: 20, duration: 30, type: 'legs', cals: 8 },
      { name: 'Plank Hold', reps: 1, duration: 30, type: 'core', cals: 6 },
      { name: 'Lunges', reps: 12, duration: 30, type: 'legs', cals: 9 },
      { name: 'Tricep Dips (chair)', reps: 12, duration: 30, type: 'triceps', cals: 8 },
      { name: 'Glute Bridges', reps: 20, duration: 30, type: 'glutes', cals: 7 },
      { name: 'Bicycle Crunches', reps: 20, duration: 30, type: 'core', cals: 8 },
    ],
  },
  {
    id: 10, title: 'Sprint Intervals', category: 'cardio', duration: 20, level: 'Advanced',
    desc: 'Explosive sprint protocol for peak cardiovascular performance and fat burning in minimal time.',
    exercises: [
      { name: 'Dynamic Warm-Up', reps: 1, duration: 30, type: 'mobility', cals: 5 },
      { name: '30-Sec Sprint', reps: 1, duration: 30, type: 'cardio', cals: 16 },
      { name: '30-Sec Rest Walk', reps: 1, duration: 30, type: 'recovery', cals: 3 },
      { name: '30-Sec Sprint', reps: 1, duration: 30, type: 'cardio', cals: 16 },
      { name: '30-Sec Rest Walk', reps: 1, duration: 30, type: 'recovery', cals: 3 },
      { name: '30-Sec Sprint', reps: 1, duration: 30, type: 'cardio', cals: 16 },
    ],
  },
  {
    id: 11, title: 'Pull Day Classic', category: 'gym', duration: 45, level: 'Intermediate',
    desc: 'Back and bicep focused mass builder using vertical and horizontal pulling patterns.',
    exercises: [
      { name: 'Weighted Pull-Ups', reps: 8, duration: 30, type: 'back', cals: 13 },
      { name: 'Barbell Bent-Over Row', reps: 10, duration: 30, type: 'back', cals: 12 },
      { name: 'Lat Pulldown', reps: 12, duration: 30, type: 'back', cals: 9 },
      { name: 'Seated Cable Row', reps: 12, duration: 30, type: 'back', cals: 9 },
      { name: 'Single-Arm DB Row', reps: 10, duration: 30, type: 'back', cals: 10 },
      { name: 'Face Pulls', reps: 15, duration: 30, type: 'shoulders', cals: 7 },
      { name: 'Barbell Curl', reps: 10, duration: 30, type: 'biceps', cals: 9 },
      { name: 'Hammer Curl', reps: 12, duration: 30, type: 'biceps', cals: 7 },
      { name: 'Preacher Curl', reps: 12, duration: 30, type: 'biceps', cals: 8 },
      { name: 'Straight-Arm Pulldown', reps: 15, duration: 30, type: 'back', cals: 8 },
      { name: 'Reverse Fly', reps: 15, duration: 30, type: 'back', cals: 7 },
    ],
  },
  {
    id: 12, title: 'First Push-Up', category: 'bodyweight', duration: 20, level: 'Beginner',
    desc: 'Learn the correct push-up form from zero, progressing through the movement pattern safely.',
    exercises: [
      { name: 'Wall Push-Ups', reps: 15, duration: 30, type: 'chest', cals: 5 },
      { name: 'Incline Push-Ups', reps: 12, duration: 30, type: 'chest', cals: 6 },
      { name: 'Knee Push-Ups', reps: 10, duration: 30, type: 'chest', cals: 7 },
      { name: 'Standard Push-Ups', reps: 8, duration: 30, type: 'chest', cals: 9 },
      { name: 'Plank Hold', reps: 1, duration: 30, type: 'core', cals: 5 },
      { name: 'Shoulder Taps', reps: 10, duration: 30, type: 'stability', cals: 5 },
    ],
  },
  {
    id: 15, title: '100 Burpee Challenge', category: 'cardio', duration: 30, level: 'Advanced',
    desc: 'The ultimate mental and physical toughness test. 100 burpees — track your time and beat it next session.',
    exercises: [
      { name: 'Burpee Block 1 (×25)', reps: 25, duration: 30, type: 'full body', cals: 35 },
      { name: 'Rest & Breathe', reps: 1, duration: 30, type: 'recovery', cals: 3 },
      { name: 'Burpee Block 2 (×25)', reps: 25, duration: 30, type: 'full body', cals: 35 },
      { name: 'Rest & Breathe', reps: 1, duration: 30, type: 'recovery', cals: 3 },
      { name: 'Burpee Block 3 (×25)', reps: 25, duration: 30, type: 'full body', cals: 35 },
      { name: 'Rest & Breathe', reps: 1, duration: 30, type: 'recovery', cals: 3 },
      { name: 'Burpee Block 4 (×25)', reps: 25, duration: 30, type: 'full body', cals: 35 },
    ],
  },
  {
    id: 16, title: 'Muscle-Up Mastery', category: 'calisthenics', duration: 40, level: 'Advanced',
    desc: 'Structured progression to achieve your first muscle-up, combining pull and push strength patterns.',
    exercises: [
      { name: 'Scapular Pull-Ups', reps: 10, duration: 30, type: 'back', cals: 8 },
      { name: 'Explosive Pull-Ups', reps: 6, duration: 30, type: 'back', cals: 12 },
      { name: 'Chest-to-Bar Pull-Ups', reps: 5, duration: 30, type: 'back', cals: 13 },
      { name: 'False Grip Hold', reps: 1, duration: 20, type: 'grip', cals: 6 },
      { name: 'Ring Muscle-Up', reps: 3, duration: 30, type: 'full body', cals: 14 },
      { name: 'Bar Muscle-Up Attempt', reps: 3, duration: 30, type: 'full body', cals: 14 },
      { name: 'Dip Lockout', reps: 8, duration: 30, type: 'triceps', cals: 10 },
    ],
  },
  {
    id: 17, title: 'Rehab Shoulder', category: 'rehab', duration: 20, level: 'Beginner',
    desc: 'Evidence-based shoulder rehabilitation protocol to restore strength, mobility, and pain-free movement.',
    exercises: [
      { name: 'Pendulum Swings', reps: 20, duration: 30, type: 'mobility', cals: 3 },
      { name: 'External Rotation (band)', reps: 15, duration: 30, type: 'rotator cuff', cals: 4 },
      { name: 'Wall Slides', reps: 15, duration: 30, type: 'mobility', cals: 4 },
      { name: 'Prone Y-T-W', reps: 10, duration: 30, type: 'back', cals: 5 },
      { name: 'Side-Lying ER', reps: 15, duration: 30, type: 'rotator cuff', cals: 4 },
      { name: 'Band Pull-Apart', reps: 15, duration: 30, type: 'back', cals: 4 },
      { name: 'Doorway Stretch', reps: 1, duration: 30, type: 'flexibility', cals: 2 },
      { name: 'Overhead Reach', reps: 10, duration: 30, type: 'mobility', cals: 3 },
    ],
  },
  {
    id: 18, title: 'Muay Thai Basics', category: 'martial arts', duration: 30, level: 'Beginner',
    desc: 'Fundamental Muay Thai strikes, footwork, and conditioning. Build power and technique from the ground up.',
    exercises: [
      { name: 'Shadow Boxing Warm-Up', reps: 1, duration: 30, type: 'cardio', cals: 8 },
      { name: 'Jab-Cross Combos', reps: 20, duration: 30, type: 'punching', cals: 9 },
      { name: 'Left-Right Teep (Push Kick)', reps: 10, duration: 30, type: 'kicking', cals: 10 },
      { name: 'Roundhouse Kicks (L)', reps: 10, duration: 30, type: 'kicking', cals: 10 },
      { name: 'Roundhouse Kicks (R)', reps: 10, duration: 30, type: 'kicking', cals: 10 },
      { name: 'Knee Strikes', reps: 15, duration: 30, type: 'knees', cals: 9 },
      { name: 'Footwork Drills', reps: 1, duration: 30, type: 'movement', cals: 7 },
      { name: 'Elbow Strikes', reps: 10, duration: 30, type: 'elbows', cals: 8 },
      { name: '3-Punch Combo', reps: 15, duration: 30, type: 'punching', cals: 10 },
      { name: 'Cool Down Stretch', reps: 1, duration: 30, type: 'recovery', cals: 3 },
    ],
  },
  {
    id: 20, title: 'Core Stability', category: 'bodyweight', duration: 20, level: 'Beginner',
    desc: 'Foundation core work combining anti-rotation, stability, and endurance for injury prevention and performance.',
    exercises: [
      { name: 'Dead Bug', reps: 10, duration: 30, type: 'core', cals: 5 },
      { name: 'Bird Dog', reps: 10, duration: 30, type: 'core', cals: 5 },
      { name: 'Plank Hold', reps: 1, duration: 30, type: 'core', cals: 6 },
      { name: 'Side Plank (L)', reps: 1, duration: 30, type: 'obliques', cals: 5 },
      { name: 'Side Plank (R)', reps: 1, duration: 30, type: 'obliques', cals: 5 },
      { name: 'Hollow Body Hold', reps: 1, duration: 30, type: 'core', cals: 6 },
      { name: 'Glute Bridge March', reps: 10, duration: 30, type: 'glutes', cals: 6 },
      { name: 'Superman Hold', reps: 10, duration: 30, type: 'back', cals: 5 },
    ],
  },
  {
    id: 22, title: 'Knee Rehab', category: 'rehab', duration: 25, level: 'Beginner',
    desc: 'Evidence-based knee injury recovery protocol strengthening the quad, hamstring, and glute chain safely.',
    exercises: [
      { name: 'Quad Sets', reps: 15, duration: 30, type: 'quads', cals: 3 },
      { name: 'Straight Leg Raise', reps: 15, duration: 30, type: 'quads', cals: 4 },
      { name: 'Terminal Knee Extension', reps: 15, duration: 30, type: 'quads', cals: 4 },
      { name: 'Mini Squat', reps: 15, duration: 30, type: 'legs', cals: 5 },
      { name: 'Step-Up (low)', reps: 10, duration: 30, type: 'legs', cals: 6 },
      { name: 'Calf Raise', reps: 20, duration: 30, type: 'legs', cals: 4 },
      { name: 'Hip Abduction', reps: 15, duration: 30, type: 'hips', cals: 4 },
    ],
  },
  {
    id: 23, title: 'MMA Conditioning', category: 'martial arts', duration: 45, level: 'Intermediate',
    desc: 'Fight-ready cardio and strength conditioning circuit used by MMA athletes for peak performance.',
    exercises: [
      { name: 'Shadow Boxing', reps: 1, duration: 30, type: 'cardio', cals: 10 },
      { name: 'Burpee + Strike', reps: 10, duration: 30, type: 'full body', cals: 15 },
      { name: 'Sprawl Drill', reps: 10, duration: 30, type: 'wrestling', cals: 12 },
      { name: 'Jab-Cross-Hook-Cross', reps: 15, duration: 30, type: 'punching', cals: 10 },
      { name: 'Tire Flip Simulate', reps: 8, duration: 30, type: 'strength', cals: 13 },
      { name: 'Ground-and-Pound Drill', reps: 20, duration: 30, type: 'cardio', cals: 12 },
      { name: 'Takedown Drills', reps: 8, duration: 30, type: 'wrestling', cals: 11 },
      { name: 'Kettlebell Swings', reps: 15, duration: 30, type: 'strength', cals: 12 },
      { name: 'Grappling Dummy Work', reps: 1, duration: 30, type: 'wrestling', cals: 11 },
      { name: 'Sandbag Carries', reps: 1, duration: 30, type: 'strength', cals: 12 },
      { name: 'Jump Rope', reps: 1, duration: 30, type: 'cardio', cals: 10 },
      { name: 'Cool Down Stretch', reps: 1, duration: 30, type: 'recovery', cals: 3 },
    ],
  },
  {
    id: 24, title: 'Dumbbell Full Body', category: 'gym', duration: 35, level: 'Beginner',
    desc: 'Versatile dumbbell program hitting every major muscle group. Works equally well at home or in the gym.',
    exercises: [
      { name: 'DB Goblet Squat', reps: 15, duration: 30, type: 'legs', cals: 9 },
      { name: 'DB Chest Press', reps: 12, duration: 30, type: 'chest', cals: 10 },
      { name: 'DB Romanian Deadlift', reps: 12, duration: 30, type: 'legs', cals: 10 },
      { name: 'DB Bent-Over Row', reps: 12, duration: 30, type: 'back', cals: 9 },
      { name: 'DB Shoulder Press', reps: 12, duration: 30, type: 'shoulders', cals: 9 },
      { name: 'DB Lateral Raises', reps: 15, duration: 30, type: 'shoulders', cals: 7 },
      { name: 'DB Bicep Curl', reps: 12, duration: 30, type: 'biceps', cals: 7 },
      { name: 'DB Tricep Kickback', reps: 12, duration: 30, type: 'triceps', cals: 7 },
      { name: 'DB Walking Lunges', reps: 12, duration: 30, type: 'legs', cals: 10 },
      { name: 'DB Renegade Row', reps: 8, duration: 30, type: 'core', cals: 11 },
      { name: 'DB Russian Twist', reps: 20, duration: 30, type: 'core', cals: 7 },
      { name: 'DB Farmers Walk', reps: 1, duration: 30, type: 'full body', cals: 8 },
    ],
  },
];

function ExerciseIcon({ type }) {
  const map = {
    chest: '💪', legs: '🦵', back: '🎯', core: '🔥', cardio: '❤️',
    shoulders: '🙆', biceps: '💪', triceps: '💪', 'full body': '⚡',
    flexibility: '🧘', mobility: '🔄', balance: '⚖️', recovery: '😤',
    flow: '🌊', 'rotator cuff': '🩺', 'upper abs': '🔥', 'lower abs': '🔥',
    obliques: '🔥', punching: '🥊', kicking: '🦵', knees: '🦵', elbows: '💥',
    wrestling: '🤼', strength: '💪', grip: '✊', stability: '⚖️',
  };
  return <span style={{ fontSize: '18px' }}>{map[type] || '🏋️'}</span>;
}

function PulsingBall({ category, isActive }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    if (!isActive) return;
    const t = setInterval(() => setPulse(p => !p), 800);
    return () => clearInterval(t);
  }, [isActive]);
  const grad = CAT_GRADIENTS[category] || 'linear-gradient(135deg,#2563EB,#7C3AED)';
  return (
    <div style={{
      width: 128, height: 128, borderRadius: '50%', background: grad,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px',
      boxShadow: pulse && isActive
        ? '0 0 0 20px rgba(37,99,235,0.15),0 0 0 40px rgba(37,99,235,0.07)'
        : '0 8px 32px rgba(37,99,235,0.35)',
      transition: 'all 0.4s ease',
    }}>
      {CATEGORIES.find(c => c.id === category)?.icon || '🏋️'}
    </div>
  );
}

function CountdownRing({ value, max, color = '#2563EB' }) {
  const r = 54, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="130" height="130" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
        <circle cx="65" cy="65" r={r} fill="none" stroke="#334155" strokeWidth="8" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - value / max)}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontSize: '32px', fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>sec</div>
      </div>
    </div>
  );
}

export default function Discover() {
  const [view, setView] = useState('browse');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [apiExercises, setApiExercises] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const [phase, setPhase] = useState('countdown');
  const [countdown, setCountdown] = useState(5);
  const [exIdx, setExIdx] = useState(0);
  const [exerciseTimer, setExerciseTimer] = useState(30);
  const [restTimer, setRestTimer] = useState(15);
  const [paused, setPaused] = useState(false);
  const [totalCals, setTotalCals] = useState(0);
  const [totalReps, setTotalReps] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [sessionStart, setSessionStart] = useState(null);
  const [saving, setSaving] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    fetch('/api/recommendations').then(r => r.json())
      .then(d => { if (Array.isArray(d)) setApiExercises(d); }).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let r = WORKOUT_CATALOG;
    if (category !== 'all') r = r.filter(w => w.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(w =>
        w.title.toLowerCase().includes(q) ||
        w.desc.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.level.toLowerCase().includes(q)
      );
    }
    return r;
  }, [search, category]);

  const openDetail = (workout) => {
    setSelectedWorkout(workout);
    setView('detail');
  };

  const startWorkout = () => {
    setExIdx(0);
    setPhase('countdown');
    setCountdown(5);
    setExerciseTimer(30);
    setRestTimer(15);
    setPaused(false);
    setTotalCals(0);
    setTotalReps(0);
    setCompletedCount(0);
    setSessionStart(Date.now());
    setView('session');
  };

  const goBack = () => {
    clearInterval(timerRef.current);
    if (view === 'session') {
      setView('detail');
    } else {
      setSelectedWorkout(null);
      setView('browse');
    }
  };

  const exercises = selectedWorkout?.exercises || [];
  const currentExercise = exercises[exIdx];

  const markDone = useCallback(() => {
    clearInterval(timerRef.current);
    const ex = exercises[exIdx];
    if (ex) {
      setTotalCals(c => c + (ex.cals || 8));
      setTotalReps(r => r + (ex.reps || 10));
      setCompletedCount(c => c + 1);
    }
    if (exIdx < exercises.length - 1) {
      setExIdx(i => i + 1);
      setPhase('rest');
      setRestTimer(15);
    } else {
      setPhase('done');
    }
  }, [exIdx, exercises]);

  const skipExercise = useCallback(() => {
    clearInterval(timerRef.current);
    if (exIdx < exercises.length - 1) {
      setExIdx(i => i + 1);
      setPhase('rest');
      setRestTimer(15);
    } else {
      setPhase('done');
    }
  }, [exIdx, exercises]);

  useEffect(() => {
    if (view !== 'session') { clearInterval(timerRef.current); return; }
    if (paused) return;
    clearInterval(timerRef.current);

    if (phase === 'countdown') {
      timerRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) { clearInterval(timerRef.current); setPhase('exercise'); setExerciseTimer(30); return 0; }
          return c - 1;
        });
      }, 1000);
    } else if (phase === 'exercise') {
      timerRef.current = setInterval(() => {
        setExerciseTimer(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            const ex = exercises[exIdx];
            if (ex) {
              setTotalCals(c => c + (ex.cals || 8));
              setTotalReps(r => r + (ex.reps || 10));
              setCompletedCount(c => c + 1);
            }
            if (exIdx < exercises.length - 1) { setPhase('rest'); setRestTimer(15); }
            else { setPhase('done'); }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else if (phase === 'rest') {
      timerRef.current = setInterval(() => {
        setRestTimer(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setExIdx(i => i + 1);
            setPhase('exercise');
            setExerciseTimer(30);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [view, phase, paused, exIdx]);

  const saveSession = async () => {
    setSaving(true);
    const duration = sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : 0;
    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedWorkout?.title || 'Workout Session',
          exercises_completed: completedCount,
          duration,
          calories: Math.round(totalCals),
          body_part: selectedWorkout?.category || 'full_body',
          level: selectedWorkout?.level?.toLowerCase() || 'beginner',
        }),
      });
    } catch {}
    setSaving(false);
    setSelectedWorkout(null);
    setView('browse');
  };

  if (view === 'session' && selectedWorkout) {
    const totalDuration = sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : 0;
    const totalMin = Math.floor(totalDuration / 60);
    const totalSec = totalDuration % 60;
    const grad = CAT_GRADIENTS[selectedWorkout.category] || 'linear-gradient(135deg,#2563EB,#7C3AED)';

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)', color: '#fff' }}>

        {phase === 'countdown' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 24, animation: 'fadeIn 0.4s ease' }}>
            <div style={{ fontSize: 52 }}>🏁</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{selectedWorkout.title}</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Get ready — workout starts in</div>
            <CountdownRing value={countdown} max={5} color="#F97316" />
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{exercises.length} exercises · {selectedWorkout.level}</div>
            <button onClick={() => { clearInterval(timerRef.current); setPhase('exercise'); setExerciseTimer(30); }} style={{
              marginTop: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#94A3B8', padding: '10px 24px', borderRadius: 12, fontSize: 14, cursor: 'pointer',
            }}>Skip Countdown</button>
            <button onClick={goBack} style={{
              background: 'transparent', border: 'none', color: '#475569', fontSize: 13, cursor: 'pointer',
            }}>← Back to details</button>
          </div>
        )}

        {(phase === 'exercise' || phase === 'rest') && currentExercise && (
          <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <button onClick={goBack} style={{
                background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff',
                width: 40, height: 40, borderRadius: 12, fontSize: 18, cursor: 'pointer',
              }}>✕</button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {phase === 'rest' ? 'Rest' : `${exIdx + 1} / ${exercises.length}`}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{selectedWorkout.title}</div>
              </div>
              <button onClick={() => setPaused(p => !p)} style={{
                background: paused ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.08)',
                border: 'none', color: '#fff', width: 40, height: 40, borderRadius: 12, fontSize: 18, cursor: 'pointer',
              }}>{paused ? '▶' : '⏸'}</button>
            </div>

            <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
              {exercises.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: i < exIdx ? '#10B981' : i === exIdx ? '#2563EB' : 'rgba(255,255,255,0.12)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>

            {phase === 'rest' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, marginBottom: 32 }}>
                <div style={{ fontSize: 48 }}>😤</div>
                <div style={{ fontSize: 26, fontWeight: 800 }}>Rest</div>
                <CountdownRing value={restTimer} max={15} color="#10B981" />
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                  Next: <strong style={{ color: '#fff' }}>{exercises[exIdx + 1]?.name || 'Finish'}</strong>
                </div>
                <button onClick={() => { clearInterval(timerRef.current); setExIdx(i => i + 1); setPhase('exercise'); setExerciseTimer(30); }} style={{
                  background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                  color: '#10B981', padding: '12px 28px', borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer',
                }}>Skip Rest →</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                <PulsingBall category={selectedWorkout.category} isActive={!paused} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>{currentExercise.name}</div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 99, fontSize: 13 }}>🎯 {currentExercise.reps} reps</span>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 99, fontSize: 13 }}>🔥 ~{currentExercise.cals} cal</span>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 99, fontSize: 13 }}>{currentExercise.type}</span>
                  </div>
                </div>
                <CountdownRing value={exerciseTimer} max={30} color="#2563EB" />
                <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                  <button onClick={skipExercise} style={{
                    flex: 1, padding: 14, borderRadius: 16,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#64748B', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}>Skip ›</button>
                  <button onClick={markDone} style={{
                    flex: 2, padding: 14, borderRadius: 16,
                    background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                    border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
                  }}>✓ Done</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 14, marginTop: 28, background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
              {[
                { label: 'Calories', value: `${Math.round(totalCals)}`, icon: '🔥' },
                { label: 'Done', value: `${completedCount}/${exercises.length}`, icon: '✅' },
                { label: 'Time', value: `${totalMin}:${String(totalSec).padStart(2, '0')}`, icon: '⏱' },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 24, padding: 28, animation: 'fadeIn 0.5s ease' }}>
            <div style={{ fontSize: 72, lineHeight: 1 }}>🏆</div>
            <div style={{ fontSize: 32, fontWeight: 900, textAlign: 'center' }}>Workout Complete!</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>{selectedWorkout.title}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%', maxWidth: 380 }}>
              {[
                { icon: '🔥', label: 'Calories Burned', value: `${Math.round(totalCals)} kcal`, color: '#F97316' },
                { icon: '✅', label: 'Exercises Done', value: `${completedCount}`, color: '#10B981' },
                { icon: '💪', label: 'Total Reps', value: `${totalReps}`, color: '#7C3AED' },
                { icon: '⏱', label: 'Duration', value: sessionStart ? `${Math.floor((Date.now() - sessionStart) / 60000)} min` : '—', color: '#2563EB' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px 16px', textAlign: 'center',
                  border: `1px solid ${s.color}30`,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 380 }}>
              <button onClick={() => { setSelectedWorkout(null); setView('browse'); }} style={{
                flex: 1, padding: 16, borderRadius: 16,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#64748B', fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}>Browse</button>
              <button onClick={saveSession} disabled={saving} style={{
                flex: 2, padding: 16, borderRadius: 16,
                background: saving ? 'rgba(37,99,235,0.4)' : 'linear-gradient(135deg, #2563EB, #7C3AED)',
                border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
                boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
              }}>{saving ? 'Saving…' : '💾 Save Session'}</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'detail' && selectedWorkout) {
    const grad = CAT_GRADIENTS[selectedWorkout.category] || 'linear-gradient(135deg,#2563EB,#7C3AED)';
    const cat = CATEGORIES.find(c => c.id === selectedWorkout.category);
    const totalCalsPreview = selectedWorkout.exercises.reduce((sum, ex) => sum + (ex.cals || 0), 0);
    const totalRepsPreview = selectedWorkout.exercises.reduce((sum, ex) => sum + (ex.reps || 0), 0);

    return (
      <div style={{ animation: 'fadeIn 0.3s ease', background: 'var(--bg)', minHeight: '100vh' }}>
        <div style={{ height: 220, background: grad, position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
          <button onClick={() => { setSelectedWorkout(null); setView('browse'); }} style={{
            position: 'absolute', top: 20, left: 20, background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(6px)', border: 'none', color: '#fff',
            width: 40, height: 40, borderRadius: 12, fontSize: 18, cursor: 'pointer',
          }}>←</button>
          <div style={{ padding: '0 28px 28px', width: '100%' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)',
                padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, color: '#fff',
              }}>{cat?.icon} {selectedWorkout.category}</span>
              <span style={{
                padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                background: `${LEVEL_COLORS[selectedWorkout.level]}30`, color: '#fff',
                backdropFilter: 'blur(6px)',
              }}>{selectedWorkout.level}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
              {selectedWorkout.title}
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 28px', maxWidth: 760 }}>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
            {selectedWorkout.desc}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
            {[
              { icon: '⏱', label: 'Duration', value: `${selectedWorkout.duration} min` },
              { icon: '💪', label: 'Exercises', value: selectedWorkout.exercises.length },
              { icon: '🔥', label: 'Est. Calories', value: `~${totalCalsPreview}` },
              { icon: '🎯', label: 'Total Reps', value: `~${totalRepsPreview}` },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '16px 12px',
                textAlign: 'center', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>
              Exercise List
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedWorkout.exercises.map((ex, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '14px 16px',
                  border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, background: 'var(--primary-50)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 800, color: 'var(--primary)', flexShrink: 0,
                  }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{ex.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {ex.reps} reps · 30 sec · ~{ex.cals} cal
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <ExerciseIcon type={ex.type} />
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
                      background: 'var(--surface-2)', padding: '3px 8px', borderRadius: 6,
                    }}>{ex.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={startWorkout} style={{
            width: '100%', padding: 18, borderRadius: 'var(--radius-md)',
            background: grad, border: 'none', color: '#fff',
            fontSize: 18, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 12px 36px rgba(37,99,235,0.3)',
            letterSpacing: '-0.01em',
          }}>
            ▶ Start Workout
          </button>
        </div>
      </div>
    );
  }

  const sections = [
    { key: 'picks', label: "Editor's Picks ⭐", items: WORKOUT_CATALOG.slice(0, 4) },
    { key: 'fast', label: 'Quick Workouts ⚡ (< 15 min)', items: WORKOUT_CATALOG.filter(w => w.duration <= 15) },
    { key: 'beginner', label: 'Great for Beginners 🌱', items: WORKOUT_CATALOG.filter(w => w.level === 'Beginner') },
    { key: 'advanced', label: 'Advanced Challenges 🔥', items: WORKOUT_CATALOG.filter(w => w.level === 'Advanced').slice(0, 4) },
  ];

  return (
    <div style={{ padding: '24px 28px', maxWidth: 960, animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 4 }}>Explore workouts</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>Discover</h1>
      </div>

      <div style={{ position: 'relative', marginBottom: 20 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>🔍</span>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search workouts by name, category, or level…"
          style={{
            width: '100%', padding: '14px 14px 14px 42px',
            border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
            fontSize: 14, color: 'var(--text)', background: 'var(--surface)',
            boxShadow: 'var(--shadow-sm)', outline: 'none', boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'var(--surface-2)', border: 'none', borderRadius: '50%',
            width: 24, height: 24, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)',
          }}>✕</button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 24 }} className="hide-scroll">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)} style={{
            padding: '8px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600,
            border: category === c.id ? `2px solid ${c.color}` : '1.5px solid var(--border)',
            background: category === c.id ? `${c.color}15` : 'var(--surface)',
            color: category === c.id ? c.color : 'var(--text-secondary)',
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.15s ease',
          }}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {(search || category !== 'all') ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              {search ? ` for "${search}"` : ''}
              {category !== 'all' ? ` in ${CATEGORIES.find(c => c.id === category)?.label}` : ''}
            </h3>
            <button onClick={() => { setSearch(''); setCategory('all'); }} style={{
              background: 'none', border: 'none', color: 'var(--primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>Clear ✕</button>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>No workouts found</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Try a different search or category</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
              {filtered.map(w => <WorkoutCard key={w.id} workout={w} onOpen={openDetail} />)}
            </div>
          )}
        </div>
      ) : (
        <div>
          {sections.map(sec => {
            if (!sec.items.length) return null;
            return (
              <div key={sec.key} style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>{sec.label}</h3>
                <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 6 }} className="hide-scroll">
                  {sec.items.map(w => <WorkoutCard key={w.id} workout={w} onOpen={openDetail} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WorkoutCard({ workout, onOpen }) {
  const grad = CAT_GRADIENTS[workout.category] || 'linear-gradient(135deg,#2563EB,#7C3AED)';
  const cat = CATEGORIES.find(c => c.id === workout.category);
  return (
    <div onClick={() => onOpen(workout)} style={{
      background: 'var(--surface)', borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-light)', overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)', cursor: 'pointer', minWidth: 200, maxWidth: 240, flexShrink: 0,
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
    >
      <div style={{
        height: 90, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, position: 'relative',
      }}>
        {cat?.icon}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)',
          borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#fff',
        }}>{workout.duration} min</div>
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4, lineHeight: 1.3 }}>{workout.title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{workout.desc}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: `${LEVEL_COLORS[workout.level]}15`, color: LEVEL_COLORS[workout.level] }}>{workout.level}</span>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 99, background: 'var(--primary-50)', color: 'var(--primary)' }}>{workout.exercises.length} exercises</span>
        </div>
        <div style={{
          width: '100%', padding: '8px 12px', borderRadius: 8, textAlign: 'center',
          background: grad, color: '#fff', fontSize: 12, fontWeight: 700,
          border: 'none', cursor: 'pointer',
        }}>View & Start →</div>
      </div>
    </div>
  );
}
