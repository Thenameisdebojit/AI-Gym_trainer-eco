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

const CAT_COLORS = {
  gym: '#1D4ED8', cardio: '#DC2626', yoga: '#0891B2',
  calisthenics: '#065F46', 'martial arts': '#92400E', rehab: '#5B21B6', bodyweight: '#1E40AF',
};

const CAT_IMAGES = {
  gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop&auto=format',
  cardio: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=500&fit=crop&auto=format',
  yoga: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop&auto=format',
  calisthenics: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=500&fit=crop&auto=format',
  'martial arts': 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&h=500&fit=crop&auto=format',
  rehab: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop&auto=format',
  bodyweight: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=500&fit=crop&auto=format',
};

const LEVEL_COLORS = { Beginner: '#10B981', Intermediate: '#F59E0B', Advanced: '#EF4444' };

const WORKOUT_CATALOG = [
  {
    id: 1, title: 'Full Body Blast', category: 'gym', duration: 40, level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&h=420&fit=crop&auto=format',
    desc: 'Energizing yoga sequence to wake your body, improve mobility, and set a calm, focused tone for your day.',
    exercises: [
      { name: "Child's Pose", reps: 1, duration: 30, type: 'flexibility', cals: 3 },
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
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1486218119243-13301543a822?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a3?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=700&h=420&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=700&h=420&fit=crop&auto=format',
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

const EXERCISE_ICONS = {
  chest: '💪', legs: '🦵', back: '🎯', core: '🔥', cardio: '❤️',
  shoulders: '🙆', biceps: '💪', triceps: '💪', 'full body': '⚡',
  flexibility: '🧘', mobility: '🔄', balance: '⚖️', recovery: '😤',
  flow: '🌊', 'rotator cuff': '🩺', 'upper abs': '🔥', 'lower abs': '🔥',
  obliques: '🔥', punching: '🥊', kicking: '🦵', knees: '🦵',
  wrestling: '🤼', strength: '💪', grip: '✊', stability: '⚖️',
  'upper body': '💪', 'full abs': '🔥', quads: '🦵', hips: '🦵', glutes: '🍑',
};

function PulsingBall({ category, isActive }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    if (!isActive) return;
    const t = setInterval(() => setPulse(p => !p), 800);
    return () => clearInterval(t);
  }, [isActive]);
  const color = CAT_COLORS[category] || '#2563EB';
  return (
    <div style={{
      width: 128, height: 128, borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}, #7C3AED)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56,
      boxShadow: pulse && isActive
        ? `0 0 0 20px ${color}22, 0 0 0 40px ${color}0f`
        : `0 8px 32px ${color}55`,
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
        <div style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>sec</div>
      </div>
    </div>
  );
}

function WorkoutCard({ workout, onOpen, hovered, setHovered }) {
  const catColor = CAT_COLORS[workout.category] || '#2563EB';
  const levelColor = LEVEL_COLORS[workout.level] || '#10B981';
  const totalCals = workout.exercises.reduce((s, e) => s + (e.cals || 0), 0);
  const isHovered = hovered === workout.id;

  return (
    <button
      onClick={() => onOpen(workout)}
      onMouseEnter={() => setHovered(workout.id)}
      onMouseLeave={() => setHovered(null)}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: '18px',
        border: `2px solid ${isHovered ? catColor : 'var(--border)'}`,
        cursor: 'pointer', padding: 0, textAlign: 'left',
        background: 'var(--surface)',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered ? `0 20px 48px rgba(0,0,0,0.14), 0 0 0 1px ${catColor}30` : '0 2px 12px rgba(0,0,0,0.07)',
        transition: 'all 0.22s ease', outline: 'none',
      }}
    >
      <div style={{ position: 'relative', height: '150px', overflow: 'hidden' }}>
        <img
          src={workout.image}
          alt={workout.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: isHovered ? 'brightness(0.6)' : 'brightness(0.5)',
            transition: 'filter 0.3s ease',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(160deg, transparent 30%, ${catColor}bb)`,
        }} />
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)',
          borderRadius: '99px', padding: '4px 11px', fontSize: 11, fontWeight: 700, color: '#fff',
        }}>
          {workout.duration} min
        </div>
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: `${levelColor}dd`, borderRadius: '99px',
          padding: '4px 10px', fontSize: 10, fontWeight: 800, color: '#fff',
        }}>
          {workout.level}
        </div>
        {isHovered && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.95)', borderRadius: '50px',
              padding: '10px 22px', fontSize: 14, fontWeight: 800, color: catColor,
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}>
              ▶ Start
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 5, lineHeight: 1.3 }}>
          {workout.title}
        </div>
        <div style={{
          fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {workout.desc}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99,
            background: `${catColor}15`, color: catColor,
          }}>
            {CATEGORIES.find(c => c.id === workout.category)?.icon} {workout.category}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 99,
            background: 'var(--primary-50)', color: 'var(--primary)',
          }}>
            {workout.exercises.length} exercises
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 99,
            background: 'var(--surface-2)', color: 'var(--text-secondary)',
          }}>
            🔥 ~{totalCals} cal
          </span>
        </div>
      </div>
    </button>
  );
}

export default function Discover() {
  const [view, setView] = useState('browse');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

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
    if (view === 'session') setView('detail');
    else { setSelectedWorkout(null); setView('browse'); }
  };

  const exercises = selectedWorkout?.exercises || [];
  const currentExercise = exercises[exIdx];

  const markDone = useCallback(() => {
    clearInterval(timerRef.current);
    const ex = exercises[exIdx];
    if (ex) { setTotalCals(c => c + (ex.cals || 8)); setTotalReps(r => r + (ex.reps || 10)); setCompletedCount(c => c + 1); }
    if (exIdx < exercises.length - 1) { setExIdx(i => i + 1); setPhase('rest'); setRestTimer(15); }
    else { setPhase('done'); }
  }, [exIdx, exercises]);

  const skipExercise = useCallback(() => {
    clearInterval(timerRef.current);
    if (exIdx < exercises.length - 1) { setExIdx(i => i + 1); setPhase('rest'); setRestTimer(15); }
    else { setPhase('done'); }
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
            if (ex) { setTotalCals(c => c + (ex.cals || 8)); setTotalReps(r => r + (ex.reps || 10)); setCompletedCount(c => c + 1); }
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
          if (t <= 1) { clearInterval(timerRef.current); setExIdx(i => i + 1); setPhase('exercise'); setExerciseTimer(30); return 0; }
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
            <button onClick={goBack} style={{ background: 'transparent', border: 'none', color: '#475569', fontSize: 13, cursor: 'pointer' }}>
              ← Back to details
            </button>
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
                border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: saving ? 'wait' : 'pointer', boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
              }}>{saving ? 'Saving…' : '💾 Save Session'}</button>
            </div>
          </div>
        )}

        <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>
    );
  }

  if (view === 'detail' && selectedWorkout) {
    const catColor = CAT_COLORS[selectedWorkout.category] || '#2563EB';
    const levelColor = LEVEL_COLORS[selectedWorkout.level] || '#10B981';
    const cat = CATEGORIES.find(c => c.id === selectedWorkout.category);
    const totalCalsPreview = selectedWorkout.exercises.reduce((sum, ex) => sum + (ex.cals || 0), 0);
    const totalRepsPreview = selectedWorkout.exercises.reduce((sum, ex) => sum + (ex.reps || 0), 0);

    return (
      <div style={{ animation: 'fadeIn 0.3s ease', background: 'var(--bg)', minHeight: '100vh' }}>
        <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
          <img
            src={selectedWorkout.image}
            alt={selectedWorkout.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45)' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(160deg, transparent 20%, ${catColor}99 100%)`,
          }} />
          <button onClick={() => { setSelectedWorkout(null); setView('browse'); }} style={{
            position: 'absolute', top: 20, left: 20, background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)', border: 'none', color: '#fff',
            width: 42, height: 42, borderRadius: 12, fontSize: 18, cursor: 'pointer',
          }}>←</button>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 28px 28px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)',
                padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, color: '#fff',
              }}>{cat?.icon} {selectedWorkout.category}</span>
              <span style={{
                padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                background: `${levelColor}cc`, color: '#fff', backdropFilter: 'blur(6px)',
              }}>{selectedWorkout.level}</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
              {selectedWorkout.title}
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 28px', maxWidth: 800 }}>
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

          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>
            Exercise List
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
            {selectedWorkout.exercises.map((ex, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '14px 16px',
                border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${catColor}15`, border: `1.5px solid ${catColor}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800, color: catColor, flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {ex.reps} reps · {ex.duration}s · ~{ex.cals} cal
                  </div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
                  background: 'var(--surface-2)', padding: '3px 10px', borderRadius: 8,
                }}>
                  {EXERCISE_ICONS[ex.type] || '🏋️'} {ex.type}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={startWorkout}
            style={{
              width: '100%', padding: 18, borderRadius: 'var(--radius-md)',
              background: `linear-gradient(135deg, ${catColor}, #7C3AED)`,
              border: 'none', color: '#fff', fontSize: 18, fontWeight: 800, cursor: 'pointer',
              boxShadow: `0 12px 36px ${catColor}40`, letterSpacing: '-0.01em',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            ▶ Start Workout
          </button>
        </div>

        <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>
    );
  }

  const sections = [
    { key: 'picks', label: "Editor's Picks ⭐", items: WORKOUT_CATALOG.slice(0, 4) },
    { key: 'fast', label: 'Quick Workouts ⚡', items: WORKOUT_CATALOG.filter(w => w.duration <= 20) },
    { key: 'beginner', label: 'Great for Beginners 🌱', items: WORKOUT_CATALOG.filter(w => w.level === 'Beginner') },
    { key: 'advanced', label: 'Advanced Challenges 🔥', items: WORKOUT_CATALOG.filter(w => w.level === 'Advanced') },
  ];

  const isFiltering = search.trim() || category !== 'all';

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100, animation: 'fadeIn 0.35s ease' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 4 }}>Explore workouts</div>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 6 }}>Discover</h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
          {WORKOUT_CATALOG.length} workouts across {CATEGORIES.length - 1} categories
        </p>
      </div>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, category, or level…"
          style={{
            width: '100%', padding: '13px 44px 13px 44px',
            border: '1.5px solid var(--border)', borderRadius: '14px',
            fontSize: 14, color: 'var(--text)', background: 'var(--surface)',
            boxShadow: 'var(--shadow-sm)', outline: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.15s ease',
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

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)} style={{
            padding: '8px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600,
            border: category === c.id ? `2px solid ${c.color}` : '1.5px solid var(--border)',
            background: category === c.id ? `${c.color}15` : 'var(--surface)',
            color: category === c.id ? c.color : 'var(--text-secondary)',
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.15s ease',
            outline: 'none',
          }}>
            {c.icon} {c.label}
          </button>
        ))}
        {isFiltering && (
          <button onClick={() => { setSearch(''); setCategory('all'); }} style={{
            padding: '8px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600,
            border: '1.5px solid var(--border)', background: 'transparent',
            color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none',
          }}>✕ Clear</button>
        )}
      </div>

      {isFiltering ? (
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 18 }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            {search ? ` for "${search}"` : ''}
            {category !== 'all' ? ` in ${CATEGORIES.find(c => c.id === category)?.label}` : ''}
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>No workouts found</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Try a different search or category</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
              {filtered.map(w => (
                <WorkoutCard key={w.id} workout={w} onOpen={openDetail} hovered={hoveredCard} setHovered={setHoveredCard} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {sections.map(sec => {
            if (!sec.items.length) return null;
            return (
              <div key={sec.key} style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>{sec.label}</h3>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>{sec.items.length} workouts</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
                  {sec.items.map(w => (
                    <WorkoutCard key={w.id} workout={w} onOpen={openDetail} hovered={hoveredCard} setHovered={setHoveredCard} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
