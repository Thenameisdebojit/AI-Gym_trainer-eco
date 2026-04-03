'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const BODY_PARTS = [
  {
    id: 'full_body', label: 'Full Body', subtitle: 'Total body strength & cardio',
    icon: '⚡', color: '#2563EB',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop&auto=format',
  },
  {
    id: 'chest', label: 'Chest', subtitle: 'Pecs, upper body push power',
    icon: '💪', color: '#DC2626',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&auto=format',
  },
  {
    id: 'arms', label: 'Arms', subtitle: 'Biceps, triceps & forearms',
    icon: '🦾', color: '#7C3AED',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop&auto=format',
  },
  {
    id: 'legs', label: 'Legs', subtitle: 'Quads, hamstrings & glutes',
    icon: '🦵', color: '#065F46',
    image: 'https://images.unsplash.com/photo-1434608519344-49d77a124f18?w=600&h=400&fit=crop&auto=format',
  },
  {
    id: 'back', label: 'Back', subtitle: 'Lats, traps & posterior chain',
    icon: '🎯', color: '#0891B2',
    image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=600&h=400&fit=crop&auto=format',
  },
  {
    id: 'abs', label: 'Abs', subtitle: 'Core strength & definition',
    icon: '🔥', color: '#F97316',
    image: 'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=600&h=400&fit=crop&auto=format',
  },
];

const LEVELS = [
  {
    id: 'beginner', label: 'Beginner', color: '#10B981', tagline: 'Build your foundation',
    duration: '15–25 min', exercises: '5 exercises',
    image: 'https://images.unsplash.com/photo-1486218119243-13301543a822?w=600&h=360&fit=crop&auto=format',
  },
  {
    id: 'intermediate', label: 'Intermediate', color: '#F59E0B', tagline: 'Level up your game',
    duration: '25–35 min', exercises: '5–6 exercises',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=360&fit=crop&auto=format',
  },
  {
    id: 'advanced', label: 'Advanced', color: '#EF4444', tagline: 'Push your limits',
    duration: '35–50 min', exercises: '5–6 exercises',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&h=360&fit=crop&auto=format',
  },
];

const MODES = [
  {
    id: 'home', label: 'Home', subtitle: 'Freehand & bodyweight', icon: '🏠',
    desc: 'No equipment needed. Train anywhere with bodyweight movements.',
    color: '#2563EB',
    image: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=600&h=360&fit=crop&auto=format',
  },
  {
    id: 'gym', label: 'Gym', subtitle: 'Weights & machines', icon: '🏋️',
    desc: 'Full gym access. Barbells, dumbbells, cables & machines.',
    color: '#7C3AED',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=360&fit=crop&auto=format',
  },
];

const EXERCISE_DB = {
  full_body: {
    home: {
      beginner: [
        { name: 'Jumping Jacks', duration: 30, reps: 20, category: 'cardio', cals: 8 },
        { name: 'Bodyweight Squats', duration: 30, reps: 15, category: 'legs', cals: 7 },
        { name: 'Push-Ups', duration: 30, reps: 10, category: 'chest', cals: 9 },
        { name: 'Mountain Climbers', duration: 30, reps: 20, category: 'core', cals: 10 },
        { name: 'Glute Bridges', duration: 30, reps: 15, category: 'legs', cals: 6 },
        { name: 'Plank Hold', duration: 30, reps: 1, category: 'core', cals: 5 },
      ],
      intermediate: [
        { name: 'Burpees', duration: 30, reps: 12, category: 'cardio', cals: 14 },
        { name: 'Jump Squats', duration: 30, reps: 15, category: 'legs', cals: 11 },
        { name: 'Diamond Push-Ups', duration: 30, reps: 12, category: 'chest', cals: 10 },
        { name: 'Spider-Man Planks', duration: 30, reps: 10, category: 'core', cals: 9 },
        { name: 'Reverse Lunges', duration: 30, reps: 12, category: 'legs', cals: 9 },
        { name: 'V-Ups', duration: 30, reps: 12, category: 'core', cals: 8 },
      ],
      advanced: [
        { name: 'Plyometric Push-Ups', duration: 30, reps: 15, category: 'chest', cals: 13 },
        { name: 'Pistol Squats', duration: 30, reps: 8, category: 'legs', cals: 12 },
        { name: 'Burpee Box Jumps', duration: 30, reps: 10, category: 'cardio', cals: 16 },
        { name: 'Handstand Push-Ups', duration: 30, reps: 6, category: 'shoulders', cals: 11 },
        { name: 'Dragon Flags', duration: 30, reps: 6, category: 'core', cals: 12 },
        { name: 'Human Flag Hold', duration: 20, reps: 1, category: 'core', cals: 10 },
      ],
    },
    gym: {
      beginner: [
        { name: 'Treadmill Walk', duration: 30, reps: 1, category: 'cardio', cals: 5 },
        { name: 'Leg Press', duration: 30, reps: 12, category: 'legs', cals: 8 },
        { name: 'Chest Press Machine', duration: 30, reps: 12, category: 'chest', cals: 9 },
        { name: 'Lat Pulldown', duration: 30, reps: 12, category: 'back', cals: 8 },
        { name: 'Cable Row', duration: 30, reps: 12, category: 'back', cals: 8 },
        { name: 'Ab Crunch Machine', duration: 30, reps: 15, category: 'core', cals: 6 },
      ],
      intermediate: [
        { name: 'Barbell Squat', duration: 30, reps: 10, category: 'legs', cals: 12 },
        { name: 'Bench Press', duration: 30, reps: 10, category: 'chest', cals: 11 },
        { name: 'Deadlift', duration: 30, reps: 8, category: 'back', cals: 13 },
        { name: 'Pull-Ups', duration: 30, reps: 8, category: 'back', cals: 11 },
        { name: 'Overhead Press', duration: 30, reps: 10, category: 'shoulders', cals: 10 },
        { name: 'Hanging Leg Raises', duration: 30, reps: 12, category: 'core', cals: 9 },
      ],
      advanced: [
        { name: 'Power Clean', duration: 30, reps: 6, category: 'full_body', cals: 16 },
        { name: 'Barbell Thruster', duration: 30, reps: 8, category: 'full_body', cals: 15 },
        { name: 'Romanian Deadlift', duration: 30, reps: 8, category: 'legs', cals: 13 },
        { name: 'Weighted Pull-Ups', duration: 30, reps: 6, category: 'back', cals: 13 },
        { name: 'Incline Bench Press', duration: 30, reps: 8, category: 'chest', cals: 12 },
        { name: 'Cable Woodchop', duration: 30, reps: 12, category: 'core', cals: 10 },
      ],
    },
  },
  chest: {
    home: {
      beginner: [
        { name: 'Standard Push-Ups', duration: 30, reps: 12, category: 'chest', cals: 9 },
        { name: 'Wide Push-Ups', duration: 30, reps: 10, category: 'chest', cals: 8 },
        { name: 'Incline Push-Ups', duration: 30, reps: 15, category: 'chest', cals: 7 },
        { name: 'Decline Push-Ups', duration: 30, reps: 10, category: 'chest', cals: 9 },
        { name: 'Close-Grip Push-Ups', duration: 30, reps: 10, category: 'chest', cals: 8 },
      ],
      intermediate: [
        { name: 'Diamond Push-Ups', duration: 30, reps: 12, category: 'chest', cals: 10 },
        { name: 'Pike Push-Ups', duration: 30, reps: 10, category: 'shoulders', cals: 9 },
        { name: 'Plyometric Push-Ups', duration: 30, reps: 10, category: 'chest', cals: 12 },
        { name: 'Archer Push-Ups', duration: 30, reps: 8, category: 'chest', cals: 11 },
        { name: 'Hindu Push-Ups', duration: 30, reps: 10, category: 'chest', cals: 10 },
      ],
      advanced: [
        { name: 'One-Arm Push-Ups', duration: 30, reps: 6, category: 'chest', cals: 14 },
        { name: 'Spiderman Push-Ups', duration: 30, reps: 10, category: 'chest', cals: 12 },
        { name: 'Handstand Push-Ups', duration: 30, reps: 6, category: 'shoulders', cals: 13 },
        { name: 'Planche Push-Up Progression', duration: 30, reps: 5, category: 'chest', cals: 15 },
        { name: 'Weighted Push-Ups', duration: 30, reps: 10, category: 'chest', cals: 12 },
      ],
    },
    gym: {
      beginner: [
        { name: 'Dumbbell Chest Press', duration: 30, reps: 12, category: 'chest', cals: 10 },
        { name: 'Pec Deck Machine', duration: 30, reps: 15, category: 'chest', cals: 8 },
        { name: 'Cable Crossover', duration: 30, reps: 15, category: 'chest', cals: 9 },
        { name: 'Incline Dumbbell Press', duration: 30, reps: 12, category: 'chest', cals: 10 },
        { name: 'Chest Dips', duration: 30, reps: 10, category: 'chest', cals: 11 },
      ],
      intermediate: [
        { name: 'Barbell Bench Press', duration: 30, reps: 10, category: 'chest', cals: 12 },
        { name: 'Incline Barbell Press', duration: 30, reps: 10, category: 'chest', cals: 12 },
        { name: 'Dumbbell Flyes', duration: 30, reps: 12, category: 'chest', cals: 10 },
        { name: 'Weighted Chest Dips', duration: 30, reps: 8, category: 'chest', cals: 12 },
        { name: 'Decline Bench Press', duration: 30, reps: 10, category: 'chest', cals: 11 },
      ],
      advanced: [
        { name: 'Close-Grip Bench Press', duration: 30, reps: 8, category: 'chest', cals: 13 },
        { name: 'Guillotine Press', duration: 30, reps: 6, category: 'chest', cals: 12 },
        { name: 'Cable Fly Superset', duration: 30, reps: 15, category: 'chest', cals: 11 },
        { name: 'Dumbbell Pullover', duration: 30, reps: 12, category: 'chest', cals: 11 },
        { name: 'Pause Bench Press', duration: 30, reps: 6, category: 'chest', cals: 13 },
      ],
    },
  },
  abs: {
    home: {
      beginner: [
        { name: 'Crunches', duration: 30, reps: 20, category: 'core', cals: 7 },
        { name: 'Plank Hold', duration: 30, reps: 1, category: 'core', cals: 6 },
        { name: 'Leg Raises', duration: 30, reps: 15, category: 'core', cals: 7 },
        { name: 'Bicycle Crunches', duration: 30, reps: 20, category: 'core', cals: 8 },
        { name: 'Russian Twists', duration: 30, reps: 20, category: 'core', cals: 7 },
      ],
      intermediate: [
        { name: 'V-Ups', duration: 30, reps: 15, category: 'core', cals: 9 },
        { name: 'Side Plank', duration: 30, reps: 1, category: 'core', cals: 6 },
        { name: 'Mountain Climbers', duration: 30, reps: 25, category: 'core', cals: 10 },
        { name: 'Toe Touches', duration: 30, reps: 15, category: 'core', cals: 8 },
        { name: 'Hollow Body Hold', duration: 30, reps: 1, category: 'core', cals: 7 },
      ],
      advanced: [
        { name: 'Dragon Flags', duration: 30, reps: 8, category: 'core', cals: 12 },
        { name: 'Ab Wheel Rollouts', duration: 30, reps: 12, category: 'core', cals: 11 },
        { name: 'L-Sit Hold', duration: 20, reps: 1, category: 'core', cals: 9 },
        { name: 'Pike Crunches', duration: 30, reps: 15, category: 'core', cals: 10 },
        { name: 'Windshield Wipers', duration: 30, reps: 10, category: 'core', cals: 11 },
      ],
    },
    gym: {
      beginner: [
        { name: 'Cable Crunches', duration: 30, reps: 20, category: 'core', cals: 8 },
        { name: 'Ab Crunch Machine', duration: 30, reps: 20, category: 'core', cals: 7 },
        { name: 'Plank on Bench', duration: 30, reps: 1, category: 'core', cals: 6 },
        { name: 'Seated Leg Raises', duration: 30, reps: 15, category: 'core', cals: 7 },
        { name: 'Ball Crunches', duration: 30, reps: 20, category: 'core', cals: 8 },
      ],
      intermediate: [
        { name: 'Hanging Leg Raises', duration: 30, reps: 12, category: 'core', cals: 10 },
        { name: 'Cable Woodchop', duration: 30, reps: 12, category: 'core', cals: 9 },
        { name: 'Ab Rollout (wheel)', duration: 30, reps: 12, category: 'core', cals: 11 },
        { name: 'Decline Sit-Ups', duration: 30, reps: 15, category: 'core', cals: 9 },
        { name: 'Pallof Press', duration: 30, reps: 12, category: 'core', cals: 8 },
      ],
      advanced: [
        { name: 'Toes-to-Bar', duration: 30, reps: 10, category: 'core', cals: 12 },
        { name: 'Dragon Flag (bench)', duration: 30, reps: 8, category: 'core', cals: 13 },
        { name: 'Weighted Decline Sit-Up', duration: 30, reps: 12, category: 'core', cals: 11 },
        { name: 'Barbell Rollout', duration: 30, reps: 10, category: 'core', cals: 12 },
        { name: 'Hanging Windshield Wipers', duration: 30, reps: 8, category: 'core', cals: 13 },
      ],
    },
  },
  arms: {
    home: {
      beginner: [
        { name: 'Tricep Dips (chair)', duration: 30, reps: 12, category: 'triceps', cals: 8 },
        { name: 'Diamond Push-Ups', duration: 30, reps: 10, category: 'triceps', cals: 9 },
        { name: 'Isometric Bicep Curl', duration: 30, reps: 1, category: 'biceps', cals: 5 },
        { name: 'Shadow Boxing', duration: 30, reps: 30, category: 'arms', cals: 10 },
        { name: 'Arm Circles', duration: 30, reps: 20, category: 'shoulders', cals: 4 },
      ],
      intermediate: [
        { name: 'Close-Grip Push-Ups', duration: 30, reps: 15, category: 'triceps', cals: 10 },
        { name: 'Pike Push-Ups', duration: 30, reps: 12, category: 'shoulders', cals: 9 },
        { name: 'Resistance Band Curl', duration: 30, reps: 15, category: 'biceps', cals: 7 },
        { name: 'Tricep Dips (elevated)', duration: 30, reps: 15, category: 'triceps', cals: 10 },
        { name: 'Bear Crawl', duration: 30, reps: 1, category: 'arms', cals: 11 },
      ],
      advanced: [
        { name: 'One-Arm Push-Ups', duration: 30, reps: 8, category: 'triceps', cals: 13 },
        { name: 'Weighted Dips', duration: 30, reps: 10, category: 'triceps', cals: 12 },
        { name: 'Inverted Row', duration: 30, reps: 12, category: 'biceps', cals: 11 },
        { name: 'Planche Lean', duration: 20, reps: 1, category: 'arms', cals: 10 },
        { name: 'Typewriter Push-Ups', duration: 30, reps: 8, category: 'chest', cals: 12 },
      ],
    },
    gym: {
      beginner: [
        { name: 'Dumbbell Bicep Curl', duration: 30, reps: 12, category: 'biceps', cals: 7 },
        { name: 'Tricep Pushdown', duration: 30, reps: 15, category: 'triceps', cals: 7 },
        { name: 'Hammer Curl', duration: 30, reps: 12, category: 'biceps', cals: 7 },
        { name: 'Overhead Tricep Extension', duration: 30, reps: 12, category: 'triceps', cals: 8 },
        { name: 'Cable Curl', duration: 30, reps: 15, category: 'biceps', cals: 7 },
      ],
      intermediate: [
        { name: 'Barbell Curl', duration: 30, reps: 10, category: 'biceps', cals: 9 },
        { name: 'Skull Crushers', duration: 30, reps: 10, category: 'triceps', cals: 9 },
        { name: 'Preacher Curl', duration: 30, reps: 12, category: 'biceps', cals: 8 },
        { name: 'Cable Tricep Kickback', duration: 30, reps: 12, category: 'triceps', cals: 8 },
        { name: 'Incline Dumbbell Curl', duration: 30, reps: 12, category: 'biceps', cals: 8 },
      ],
      advanced: [
        { name: 'Drag Curl', duration: 30, reps: 10, category: 'biceps', cals: 10 },
        { name: 'Close-Grip Bench Press', duration: 30, reps: 8, category: 'triceps', cals: 12 },
        { name: '21s Barbell Curl', duration: 30, reps: 21, category: 'biceps', cals: 11 },
        { name: 'Dip Machine Max', duration: 30, reps: 8, category: 'triceps', cals: 11 },
        { name: 'Reverse Curl', duration: 30, reps: 12, category: 'arms', cals: 9 },
      ],
    },
  },
  legs: {
    home: {
      beginner: [
        { name: 'Bodyweight Squats', duration: 30, reps: 20, category: 'legs', cals: 8 },
        { name: 'Reverse Lunges', duration: 30, reps: 12, category: 'legs', cals: 9 },
        { name: 'Glute Bridges', duration: 30, reps: 20, category: 'glutes', cals: 7 },
        { name: 'Wall Sit', duration: 30, reps: 1, category: 'legs', cals: 6 },
        { name: 'Calf Raises', duration: 30, reps: 25, category: 'legs', cals: 5 },
      ],
      intermediate: [
        { name: 'Jump Squats', duration: 30, reps: 15, category: 'legs', cals: 12 },
        { name: 'Bulgarian Split Squats', duration: 30, reps: 10, category: 'legs', cals: 11 },
        { name: 'Single-Leg Glute Bridge', duration: 30, reps: 12, category: 'glutes', cals: 9 },
        { name: 'Lateral Lunges', duration: 30, reps: 12, category: 'legs', cals: 9 },
        { name: 'Box Jumps', duration: 30, reps: 10, category: 'legs', cals: 13 },
      ],
      advanced: [
        { name: 'Pistol Squats', duration: 30, reps: 8, category: 'legs', cals: 13 },
        { name: 'Nordic Curls', duration: 30, reps: 6, category: 'legs', cals: 11 },
        { name: 'Single-Leg Deadlift', duration: 30, reps: 10, category: 'legs', cals: 11 },
        { name: 'Depth Jumps', duration: 30, reps: 8, category: 'legs', cals: 14 },
        { name: 'Shrimp Squats', duration: 30, reps: 8, category: 'legs', cals: 12 },
      ],
    },
    gym: {
      beginner: [
        { name: 'Leg Press', duration: 30, reps: 15, category: 'legs', cals: 10 },
        { name: 'Leg Extension', duration: 30, reps: 15, category: 'legs', cals: 8 },
        { name: 'Leg Curl', duration: 30, reps: 15, category: 'legs', cals: 8 },
        { name: 'Smith Machine Squat', duration: 30, reps: 12, category: 'legs', cals: 10 },
        { name: 'Seated Calf Raise', duration: 30, reps: 20, category: 'legs', cals: 6 },
      ],
      intermediate: [
        { name: 'Barbell Back Squat', duration: 30, reps: 10, category: 'legs', cals: 13 },
        { name: 'Romanian Deadlift', duration: 30, reps: 10, category: 'legs', cals: 12 },
        { name: 'Hack Squat', duration: 30, reps: 10, category: 'legs', cals: 12 },
        { name: 'Lying Leg Curl', duration: 30, reps: 12, category: 'legs', cals: 9 },
        { name: 'Walking Lunges', duration: 30, reps: 12, category: 'legs', cals: 10 },
      ],
      advanced: [
        { name: 'Front Squat', duration: 30, reps: 8, category: 'legs', cals: 14 },
        { name: 'Sumo Deadlift', duration: 30, reps: 6, category: 'legs', cals: 14 },
        { name: 'Pause Squat', duration: 30, reps: 6, category: 'legs', cals: 13 },
        { name: 'Single-Leg Press', duration: 30, reps: 10, category: 'legs', cals: 12 },
        { name: 'Hex Bar Deadlift', duration: 30, reps: 6, category: 'legs', cals: 14 },
      ],
    },
  },
  back: {
    home: {
      beginner: [
        { name: 'Superman Hold', duration: 30, reps: 12, category: 'back', cals: 6 },
        { name: 'Bird Dog', duration: 30, reps: 10, category: 'back', cals: 6 },
        { name: 'Good Mornings (BW)', duration: 30, reps: 15, category: 'back', cals: 6 },
        { name: 'Reverse Snow Angels', duration: 30, reps: 15, category: 'back', cals: 6 },
        { name: 'Cobra Stretch', duration: 30, reps: 5, category: 'back', cals: 4 },
      ],
      intermediate: [
        { name: 'Inverted Row (table)', duration: 30, reps: 10, category: 'back', cals: 10 },
        { name: 'Pull-Ups (if bar)', duration: 30, reps: 8, category: 'back', cals: 11 },
        { name: 'Chin-Ups', duration: 30, reps: 8, category: 'back', cals: 11 },
        { name: 'Door Row', duration: 30, reps: 12, category: 'back', cals: 8 },
        { name: 'Hip Hinge', duration: 30, reps: 15, category: 'back', cals: 7 },
      ],
      advanced: [
        { name: 'Weighted Pull-Ups', duration: 30, reps: 6, category: 'back', cals: 13 },
        { name: 'Muscle-Ups', duration: 30, reps: 5, category: 'back', cals: 14 },
        { name: 'Archer Row', duration: 30, reps: 8, category: 'back', cals: 12 },
        { name: 'Ring Row', duration: 30, reps: 10, category: 'back', cals: 11 },
        { name: 'L-Sit Pull-Up', duration: 30, reps: 6, category: 'back', cals: 13 },
      ],
    },
    gym: {
      beginner: [
        { name: 'Lat Pulldown', duration: 30, reps: 12, category: 'back', cals: 9 },
        { name: 'Cable Row', duration: 30, reps: 12, category: 'back', cals: 9 },
        { name: 'Assisted Pull-Up', duration: 30, reps: 10, category: 'back', cals: 10 },
        { name: 'Machine Row', duration: 30, reps: 12, category: 'back', cals: 9 },
        { name: 'Straight-Arm Pulldown', duration: 30, reps: 15, category: 'back', cals: 8 },
      ],
      intermediate: [
        { name: 'Bent-Over Barbell Row', duration: 30, reps: 10, category: 'back', cals: 12 },
        { name: 'Pull-Ups', duration: 30, reps: 8, category: 'back', cals: 11 },
        { name: 'Single-Arm Dumbbell Row', duration: 30, reps: 10, category: 'back', cals: 10 },
        { name: 'T-Bar Row', duration: 30, reps: 10, category: 'back', cals: 11 },
        { name: 'Face Pulls', duration: 30, reps: 15, category: 'back', cals: 8 },
      ],
      advanced: [
        { name: 'Rack Pulls', duration: 30, reps: 6, category: 'back', cals: 14 },
        { name: 'Weighted Pull-Ups', duration: 30, reps: 6, category: 'back', cals: 13 },
        { name: 'Pendlay Row', duration: 30, reps: 6, category: 'back', cals: 13 },
        { name: 'Meadows Row', duration: 30, reps: 8, category: 'back', cals: 12 },
        { name: 'Snatch-Grip Deadlift', duration: 30, reps: 5, category: 'back', cals: 15 },
      ],
    },
  },
};

const LEVEL_COLORS = { beginner: '#10B981', intermediate: '#F59E0B', advanced: '#EF4444' };

const CHALLENGES = [
  {
    id: 'abs28',
    name: '28 Day Abs Challenge',
    icon: '🔥',
    color: '#F97316',
    totalDays: 28,
    desc: 'Daily core work to build visible abs in 4 weeks',
    bodyPart: { id: 'abs', label: 'Abs', icon: '🔥', color: '#F97316', subtitle: 'Core strength & definition', image: 'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=600&h=400&fit=crop&auto=format' },
    mode: { id: 'home', label: 'Home' },
    levelSchedule: ['beginner', 'beginner', 'intermediate', 'intermediate', 'intermediate', 'advanced', 'advanced'],
  },
  {
    id: 'fullbody30',
    name: '30 Day Full Body',
    icon: '⚡',
    color: '#2563EB',
    totalDays: 30,
    desc: 'Progressive full-body program from foundation to elite',
    bodyPart: { id: 'full_body', label: 'Full Body', icon: '⚡', color: '#2563EB', subtitle: 'Total body strength & cardio', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop&auto=format' },
    mode: { id: 'home', label: 'Home' },
    levelSchedule: ['beginner', 'beginner', 'beginner', 'intermediate', 'intermediate', 'intermediate', 'advanced'],
  },
  {
    id: 'fatburn14',
    name: '14 Day Fat Burn',
    icon: '💪',
    color: '#EF4444',
    totalDays: 14,
    desc: 'Intense 2-week protocol for rapid fat loss',
    bodyPart: { id: 'full_body', label: 'Full Body', icon: '⚡', color: '#EF4444', subtitle: 'Total body strength & cardio', image: 'https://images.unsplash.com/photo-1434608519344-49d77a124f18?w=600&h=400&fit=crop&auto=format' },
    mode: { id: 'gym', label: 'Gym' },
    levelSchedule: ['intermediate', 'intermediate', 'advanced', 'advanced', 'advanced', 'advanced', 'advanced'],
  },
];

function ExerciseAnimIcon({ category }) {
  const icons = {
    chest: '🏋️', core: '🔥', legs: '🦵', back: '🎯', arms: '💪',
    biceps: '💪', triceps: '💪', glutes: '🍑', cardio: '❤️', shoulders: '🙆', full_body: '⚡',
  };
  return <span style={{ fontSize: '64px', lineHeight: 1 }}>{icons[category] || '🏋️'}</span>;
}

function PulsingExercise({ exercise, isActive }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => setPulse(p => !p), 800);
    return () => clearInterval(interval);
  }, [isActive]);
  return (
    <div style={{
      width: '140px', height: '140px', borderRadius: '50%',
      background: pulse && isActive
        ? 'linear-gradient(135deg, #1D4ED8, #7C3AED)'
        : 'linear-gradient(135deg, #2563EB, #7C3AED)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: pulse && isActive
        ? '0 0 0 20px rgba(37,99,235,0.15), 0 0 0 40px rgba(37,99,235,0.07)'
        : '0 8px 32px rgba(37,99,235,0.35)',
      transition: 'all 0.4s ease',
    }}>
      <ExerciseAnimIcon category={exercise?.category} />
    </div>
  );
}

function CountdownRing({ value, max, color = '#2563EB' }) {
  const r = 54, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="130" height="130" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
        <circle cx="65" cy="65" r={r} fill="none" stroke="#E2E8F0" strokeWidth="8" />
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

function Breadcrumb({ steps, onBack }) {
  if (steps.length === 0) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
      <button onClick={onBack} style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '10px', padding: '7px 14px', fontSize: '13px', fontWeight: 600,
        color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s ease',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
      >
        ← Back
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
        <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>Training</span>
        {steps.map((s, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ opacity: 0.5 }}>›</span>
            <span style={{ color: i === steps.length - 1 ? 'var(--text)' : 'var(--text-tertiary)', fontWeight: i === steps.length - 1 ? 700 : 500 }}>
              {s}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Training() {
  const [navStep, setNavStep] = useState('home');
  const [selectedBody, setSelectedBody] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [stats, setStats] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const [exercises, setExercises] = useState([]);
  const [exIdx, setExIdx] = useState(0);
  const [phase, setPhase] = useState('countdown');
  const [countdown, setCountdown] = useState(5);
  const [exerciseTimer, setExerciseTimer] = useState(30);
  const [restTimer, setRestTimer] = useState(15);
  const [paused, setPaused] = useState(false);
  const [repsCount, setRepsCount] = useState(0);
  const [sessionStart, setSessionStart] = useState(null);
  const [totalCals, setTotalCals] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null);
  const [challengeProgress, setChallengeProgress] = useState({});
  const [activeChallengeId, setActiveChallengeId] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    fetch('/api/workout/stats').then(r => r.json()).then(setStats).catch(() => {});
    fetch('/api/sessions?type=stats').then(r => r.json()).then(setSessionStats).catch(() => {});
    try {
      const saved = JSON.parse(localStorage.getItem('fitai_workout_progress'));
      if (saved && saved.exercises?.length > 0) setSavedProgress(saved);
      const cp = JSON.parse(localStorage.getItem('fitai_challenge_progress') || '{}');
      setChallengeProgress(cp);
    } catch {}
  }, []);

  useEffect(() => {
    if (navStep === 'session' && exercises.length > 0) {
      try {
        localStorage.setItem('fitai_workout_progress', JSON.stringify({
          exercises, exIdx, phase, totalCals, repsCount, completedCount,
          sessionStart, selectedBody, selectedLevel, selectedMode, activeChallengeId,
        }));
      } catch {}
    }
  }, [navStep, exercises, exIdx, phase, totalCals, repsCount, completedCount, activeChallengeId]);

  const getExercises = useCallback(() => {
    if (!selectedBody || !selectedMode || !selectedLevel) return [];
    return EXERCISE_DB[selectedBody?.id]?.[selectedMode?.id]?.[selectedLevel?.id] || [];
  }, [selectedBody, selectedMode, selectedLevel]);

  const startWorkout = (challengeId = null) => {
    const exs = getExercises();
    setExercises(exs);
    setExIdx(0);
    setPhase('countdown');
    setCountdown(5);
    setExerciseTimer(30);
    setRestTimer(15);
    setPaused(false);
    setRepsCount(0);
    setTotalCals(0);
    setCompletedCount(0);
    setSessionStart(Date.now());
    setActiveChallengeId(challengeId);
    setSavedProgress(null);
    setNavStep('session');
  };

  const resumeWorkout = () => {
    if (!savedProgress) return;
    setExercises(savedProgress.exercises);
    setExIdx(savedProgress.exIdx || 0);
    setPhase('exercise');
    setExerciseTimer(30);
    setRestTimer(15);
    setPaused(true);
    setRepsCount(savedProgress.repsCount || 0);
    setTotalCals(savedProgress.totalCals || 0);
    setCompletedCount(savedProgress.completedCount || 0);
    setSessionStart(savedProgress.sessionStart || Date.now());
    setSelectedBody(savedProgress.selectedBody);
    setSelectedLevel(savedProgress.selectedLevel);
    setSelectedMode(savedProgress.selectedMode);
    setActiveChallengeId(savedProgress.activeChallengeId || null);
    setSavedProgress(null);
    setNavStep('session');
  };

  const startChallenge = (challenge) => {
    const cp = challengeProgress[challenge.id] || { currentDay: 0, completedDays: [] };
    const nextDay = cp.currentDay;
    const levelIdx = Math.floor((nextDay / challenge.totalDays) * challenge.levelSchedule.length);
    const levelId = challenge.levelSchedule[Math.min(levelIdx, challenge.levelSchedule.length - 1)];
    const levelObj = LEVELS.find(l => l.id === levelId) || LEVELS[0];
    setSelectedBody(challenge.bodyPart);
    setSelectedLevel(levelObj);
    setSelectedMode(challenge.mode);
    const exs = EXERCISE_DB[challenge.bodyPart.id]?.[challenge.mode.id]?.[levelId] || [];
    setExercises(exs);
    setExIdx(0);
    setPhase('countdown');
    setCountdown(5);
    setExerciseTimer(30);
    setRestTimer(15);
    setPaused(false);
    setRepsCount(0);
    setTotalCals(0);
    setCompletedCount(0);
    setSessionStart(Date.now());
    setActiveChallengeId(challenge.id);
    setSavedProgress(null);
    setNavStep('session');
  };

  useEffect(() => {
    if (navStep !== 'session') { clearInterval(timerRef.current); return; }
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
              setRepsCount(r => r + (ex.reps || 10));
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
  }, [navStep, phase, paused, exIdx, exercises]);

  const skipExercise = () => {
    clearInterval(timerRef.current);
    const ex = exercises[exIdx];
    if (ex) setTotalCals(c => c + Math.round((ex.cals || 8) * 0.5));
    if (exIdx < exercises.length - 1) { setExIdx(i => i + 1); setPhase('rest'); setRestTimer(15); }
    else { setPhase('done'); }
  };

  const markDone = () => {
    clearInterval(timerRef.current);
    const ex = exercises[exIdx];
    if (ex) { setTotalCals(c => c + (ex.cals || 8)); setRepsCount(r => r + (ex.reps || 10)); setCompletedCount(c => c + 1); }
    if (exIdx < exercises.length - 1) { setExIdx(i => i + 1); setPhase('rest'); setRestTimer(15); }
    else { setPhase('done'); }
  };

  const saveSession = async () => {
    setSaving(true);
    const duration = sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : 0;
    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${selectedBody?.label} ${selectedLevel?.label} ${selectedMode?.label} Workout`,
          exercises_completed: completedCount,
          duration,
          calories: Math.round(totalCals),
          body_part: selectedBody?.id,
          level: selectedLevel?.id,
        }),
      });
    } catch {}
    try {
      localStorage.removeItem('fitai_workout_progress');
      if (activeChallengeId) {
        const cp = JSON.parse(localStorage.getItem('fitai_challenge_progress') || '{}');
        const prev = cp[activeChallengeId] || { currentDay: 0, completedDays: [] };
        const nextDay = prev.currentDay + 1;
        const updated = { ...cp, [activeChallengeId]: { currentDay: nextDay, completedDays: [...(prev.completedDays || []), prev.currentDay] } };
        localStorage.setItem('fitai_challenge_progress', JSON.stringify(updated));
        setChallengeProgress(updated);
      }
    } catch {}
    setSaving(false);
    setActiveChallengeId(null);
    setSavedProgress(null);
    setNavStep('home');
    setSelectedBody(null); setSelectedLevel(null); setSelectedMode(null);
    fetch('/api/sessions?type=stats').then(r => r.json()).then(setSessionStats).catch(() => {});
    fetch('/api/workout/stats').then(r => r.json()).then(setStats).catch(() => {});
  };

  const exitSession = () => {
    clearInterval(timerRef.current);
    setPaused(false);
    try { localStorage.removeItem('fitai_workout_progress'); } catch {}
    setActiveChallengeId(null);
    setSavedProgress(null);
    setNavStep('workoutList');
  };

  const currentExercise = exercises[exIdx];

  const goBack = () => {
    if (navStep === 'levels') { setNavStep('home'); setSelectedBody(null); }
    else if (navStep === 'modes') { setNavStep('levels'); setSelectedLevel(null); }
    else if (navStep === 'workoutList') { setNavStep('modes'); setSelectedMode(null); }
    else { setNavStep('home'); }
  };

  const getBreadcrumbs = () => {
    const crumbs = [];
    if (navStep === 'levels' && selectedBody) crumbs.push(selectedBody.label);
    if (navStep === 'modes') { crumbs.push(selectedBody?.label); crumbs.push(selectedLevel?.label); }
    if (navStep === 'workoutList') { crumbs.push(selectedBody?.label); crumbs.push(selectedLevel?.label); crumbs.push(selectedMode?.label); }
    return crumbs.filter(Boolean);
  };

  if (navStep === 'session') {
    const totalDurationSec = sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : 0;
    const totalMin = Math.floor(totalDurationSec / 60);
    const totalSec = totalDurationSec % 60;

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)', color: '#fff', padding: '0' }}>
        {phase === 'countdown' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ fontSize: '48px' }}>🏁</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>Get Ready!</div>
            <CountdownRing value={countdown} max={5} color="#F97316" />
            <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
              {exercises.length} exercises · {selectedMode?.label} · {selectedLevel?.label}
            </div>
            <button onClick={exitSession} style={{
              marginTop: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', padding: '10px 24px', borderRadius: '12px', fontSize: '14px', cursor: 'pointer',
            }}>Cancel</button>
          </div>
        )}

        {(phase === 'exercise' || phase === 'rest') && !currentExercise && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '16px' }}>
            <div style={{ fontSize: '48px' }}>⚠️</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>No exercises found</div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Please go back and select a workout.</div>
            <button onClick={exitSession} style={{ marginTop: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '12px 28px', borderRadius: '14px', fontSize: '15px', cursor: 'pointer' }}>Go Back</button>
          </div>
        )}

        {(phase === 'exercise' || phase === 'rest') && currentExercise && (
          <div style={{ maxWidth: '560px', margin: '0 auto', padding: '24px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
              <button onClick={exitSession} style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                width: '40px', height: '40px', borderRadius: '12px', fontSize: '18px', cursor: 'pointer',
              }}>✕</button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {phase === 'rest' ? 'Rest' : `Exercise ${exIdx + 1} of ${exercises.length}`}
                </div>
              </div>
              <button onClick={() => setPaused(p => !p)} style={{
                background: paused ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.1)',
                border: 'none', color: '#fff', width: '40px', height: '40px',
                borderRadius: '12px', fontSize: '18px', cursor: 'pointer',
              }}>
                {paused ? '▶' : '⏸'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '4px', marginBottom: '32px' }}>
              {exercises.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: '4px', borderRadius: '2px',
                  background: i < exIdx ? '#10B981' : i === exIdx ? '#2563EB' : 'rgba(255,255,255,0.15)',
                  transition: 'background 0.3s ease',
                }} />
              ))}
            </div>

            {phase === 'rest' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <div style={{ fontSize: '48px' }}>😤</div>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>Rest</div>
                <CountdownRing value={restTimer} max={15} color="#10B981" />
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                  Next: {exercises[exIdx + 1]?.name || 'Finish'}
                </div>
                <button onClick={() => { clearInterval(timerRef.current); setExIdx(i => i + 1); setPhase('exercise'); setExerciseTimer(30); }} style={{
                  background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)',
                  color: '#10B981', padding: '12px 28px', borderRadius: '14px',
                  fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                }}>Skip Rest →</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <PulsingExercise exercise={currentExercise} isActive={!paused} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 900, marginBottom: '6px' }}>{currentExercise.name}</div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '99px', fontSize: '13px' }}>
                      🎯 {currentExercise.reps} reps
                    </span>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '99px', fontSize: '13px' }}>
                      🔥 ~{currentExercise.cals} cal
                    </span>
                    <span style={{
                      padding: '4px 12px', borderRadius: '99px', fontSize: '13px',
                      background: `${LEVEL_COLORS[selectedLevel?.id]}25`,
                      color: LEVEL_COLORS[selectedLevel?.id],
                    }}>
                      {selectedLevel?.label}
                    </span>
                  </div>
                </div>
                <CountdownRing value={exerciseTimer} max={30} color="#2563EB" />
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  <button onClick={skipExercise} style={{
                    flex: 1, padding: '14px', borderRadius: '16px',
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#94A3B8', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  }}>Skip ›</button>
                  <button onClick={markDone} style={{
                    flex: 2, padding: '14px', borderRadius: '16px',
                    background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                    border: 'none', color: '#fff', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
                  }}>✓ Done</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '14px', marginTop: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px' }}>
              {[
                { label: 'Calories', value: `${Math.round(totalCals)} kcal`, icon: '🔥' },
                { label: 'Completed', value: `${completedCount}/${exercises.length}`, icon: '✅' },
                { label: 'Time', value: `${totalMin}:${String(totalSec).padStart(2, '0')}`, icon: '⏱' },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', marginBottom: '4px' }}>{s.icon}</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{s.value}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '24px', padding: '28px', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ fontSize: '72px', lineHeight: 1 }}>🏆</div>
            <div style={{ fontSize: '32px', fontWeight: 900, textAlign: 'center' }}>Workout Complete!</div>
            <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
              Amazing work — here's your session summary
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', width: '100%', maxWidth: '380px' }}>
              {[
                { icon: '🔥', label: 'Calories Burned', value: `${Math.round(totalCals)} kcal`, color: '#F97316' },
                { icon: '✅', label: 'Exercises Done', value: `${completedCount}`, color: '#10B981' },
                { icon: '💪', label: 'Total Reps', value: `${repsCount}`, color: '#7C3AED' },
                { icon: '⏱', label: 'Duration', value: sessionStart ? `${Math.floor((Date.now() - sessionStart) / 60000)} min` : '—', color: '#2563EB' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.07)', borderRadius: '16px',
                  padding: '20px 16px', textAlign: 'center', border: `1px solid ${s.color}30`,
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '380px' }}>
              <button onClick={exitSession} style={{
                flex: 1, padding: '16px', borderRadius: '16px',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                color: '#94A3B8', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
              }}>Back</button>
              <button onClick={saveSession} disabled={saving} style={{
                flex: 2, padding: '16px', borderRadius: '16px',
                background: saving ? 'rgba(37,99,235,0.4)' : 'linear-gradient(135deg, #2563EB, #7C3AED)',
                border: 'none', color: '#fff', fontSize: '15px', fontWeight: 700,
                cursor: saving ? 'wait' : 'pointer', boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
              }}>{saving ? 'Saving…' : '💾 Save Session'}</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1100px', animation: 'fadeIn 0.35s ease' }}>

      {navStep === 'home' && (
        <>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
              Good day 👋
            </div>
            <h1 style={{ fontSize: '30px', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: '6px' }}>
              Training
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 400 }}>
              Choose a muscle group to start your personalized workout
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #7C3AED 100%)',
            borderRadius: '20px', padding: '20px 24px', marginBottom: '32px',
            boxShadow: '0 12px 40px rgba(37,99,235,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px',
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                Your Progress
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>
                {sessionStats?.total_sessions ?? 0} Sessions Completed
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                🔥 {Math.round(sessionStats?.total_calories ?? 0)} calories burned total
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { icon: '⏱', value: `${sessionStats?.total_minutes ?? 0} min`, label: 'Trained' },
                { icon: '💪', value: sessionStats?.total_exercises ?? 0, label: 'Exercises' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                  borderRadius: '14px', padding: '12px 18px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '2px' }}>{s.icon} {s.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {savedProgress && savedProgress.exercises?.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #0F172A, #1E293B)',
              borderRadius: '16px', padding: '16px 20px', marginBottom: '24px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', gap: '16px',
              boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
            }}>
              <div style={{ fontSize: '32px', lineHeight: 1 }}>▶️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>Continue Workout</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>
                  {savedProgress.selectedBody?.label} · {savedProgress.selectedLevel?.label} · {savedProgress.selectedMode?.label}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                  Exercise {(savedProgress.exIdx || 0) + 1} of {savedProgress.exercises.length} · {Math.round(savedProgress.totalCals || 0)} cal burned
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setSavedProgress(null)} style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.5)', padding: '8px 14px', borderRadius: '10px',
                  fontSize: '12px', cursor: 'pointer', fontWeight: 600,
                }}>Discard</button>
                <button onClick={resumeWorkout} style={{
                  background: 'linear-gradient(135deg, #2563EB, #7C3AED)', border: 'none',
                  color: '#fff', padding: '8px 18px', borderRadius: '10px',
                  fontSize: '13px', cursor: 'pointer', fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
                }}>Resume →</button>
              </div>
            </div>
          )}

          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Select Muscle Group
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '18px',
          }}>
            {BODY_PARTS.map(bp => (
              <button
                key={bp.id}
                onClick={() => { setSelectedBody(bp); setNavStep('levels'); }}
                onMouseEnter={() => setHoveredCard(bp.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: 'relative', overflow: 'hidden',
                  borderRadius: '18px', border: 'none', cursor: 'pointer',
                  height: '180px', padding: 0, textAlign: 'left',
                  transform: hoveredCard === bp.id ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
                  boxShadow: hoveredCard === bp.id
                    ? `0 20px 50px rgba(0,0,0,0.2), 0 0 0 2px ${bp.color}`
                    : '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.25s ease',
                  outline: 'none',
                }}
              >
                <img
                  src={bp.image}
                  alt={bp.label}
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    objectFit: 'cover',
                    filter: hoveredCard === bp.id ? 'brightness(0.55)' : 'brightness(0.45)',
                    transition: 'filter 0.3s ease',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(160deg, transparent 20%, ${bp.color}99 100%)`,
                }} />
                <div style={{
                  position: 'relative', zIndex: 1,
                  padding: '20px 22px',
                  height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px', lineHeight: 1 }}>{bp.icon}</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '4px' }}>
                    {bp.label}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
                    {bp.subtitle}
                  </div>
                </div>
                <div style={{
                  position: 'absolute', top: '14px', right: '14px',
                  background: hoveredCard === bp.id ? '#fff' : 'rgba(0,0,0,0.35)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: '10px', padding: '5px 11px',
                  fontSize: '11px', fontWeight: 700,
                  color: hoveredCard === bp.id ? bp.color : 'rgba(255,255,255,0.9)',
                  transition: 'all 0.2s ease',
                }}>
                  {hoveredCard === bp.id ? 'Start →' : (() => {
                    const modes = EXERCISE_DB[bp.id] || {};
                    const total = Object.values(modes).reduce((mSum, levels) =>
                      mSum + Object.values(levels).reduce((lSum, exs) => lSum + exs.length, 0), 0);
                    return `${total} exercises`;
                  })()}
                </div>
              </button>
            ))}
          </div>

          <div style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                Active Challenges
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Build a streak</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
              {CHALLENGES.map(challenge => {
                const cp = challengeProgress[challenge.id] || { currentDay: 0, completedDays: [] };
                const pct = Math.round((cp.currentDay / challenge.totalDays) * 100);
                const started = cp.currentDay > 0;
                return (
                  <div key={challenge.id} style={{
                    background: 'var(--surface)', borderRadius: '18px',
                    border: `1.5px solid ${started ? challenge.color + '40' : 'var(--border-light)'}`,
                    padding: '20px', boxShadow: started ? `0 4px 20px ${challenge.color}15` : 'var(--shadow-sm)',
                    transition: 'all 0.2s ease',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                        background: `${challenge.color}18`, border: `1.5px solid ${challenge.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                      }}>{challenge.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text)', lineHeight: 1.2, marginBottom: '4px' }}>{challenge.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{challenge.desc}</div>
                      </div>
                    </div>
                    {started && (
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: challenge.color }}>Day {cp.currentDay} of {challenge.totalDays}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{pct}% done</span>
                        </div>
                        <div style={{ height: '6px', background: 'var(--surface-2)', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${challenge.color}, ${challenge.color}bb)`, borderRadius: '99px', transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => startChallenge(challenge)}
                      style={{
                        width: '100%', padding: '12px', borderRadius: '12px',
                        background: started ? `${challenge.color}18` : `linear-gradient(135deg, ${challenge.color}, ${challenge.color}bb)`,
                        border: started ? `1.5px solid ${challenge.color}40` : 'none',
                        color: started ? challenge.color : '#fff',
                        fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                        boxShadow: started ? 'none' : `0 6px 20px ${challenge.color}35`,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {started ? `▶ Day ${cp.currentDay + 1} Workout` : '🚀 Start Challenge'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {navStep === 'levels' && selectedBody && (
        <>
          <Breadcrumb steps={getBreadcrumbs()} onBack={goBack} />
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: `${selectedBody.color}20`, border: `2px solid ${selectedBody.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              }}>
                {selectedBody.icon}
              </div>
              <div>
                <h2 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                  {selectedBody.label} Workout
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{selectedBody.subtitle}</p>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Choose Your Level
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {LEVELS.map(level => {
              const exCount = EXERCISE_DB[selectedBody.id]?.home?.[level.id]?.length || 0;
              return (
                <button
                  key={level.id}
                  onClick={() => { setSelectedLevel(level); setNavStep('modes'); }}
                  onMouseEnter={() => setHoveredCard(level.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    position: 'relative', overflow: 'hidden',
                    borderRadius: '18px', border: `2px solid ${hoveredCard === level.id ? level.color : 'var(--border)'}`,
                    cursor: 'pointer', height: '120px', padding: 0, textAlign: 'left',
                    transform: hoveredCard === level.id ? 'translateX(4px)' : 'translateX(0)',
                    boxShadow: hoveredCard === level.id ? `0 8px 32px ${level.color}30` : '0 2px 12px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s ease', outline: 'none', background: 'var(--surface)',
                  }}
                >
                  <img
                    src={level.image}
                    alt={level.label}
                    style={{
                      position: 'absolute', right: 0, top: 0, height: '100%', width: '220px',
                      objectFit: 'cover', opacity: 0.25,
                    }}
                  />
                  <div style={{
                    position: 'absolute', right: 0, top: 0, height: '100%', width: '220px',
                    background: 'linear-gradient(to right, var(--surface) 20%, transparent)',
                  }} />
                  <div style={{ position: 'relative', zIndex: 1, padding: '22px 24px', display: 'flex', alignItems: 'center', gap: '18px', height: '100%' }}>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
                      background: `${level.color}20`, border: `2px solid ${level.color}50`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ fontSize: '20px' }}>
                        {level.id === 'beginner' ? '🌱' : level.id === 'intermediate' ? '⚡' : '🔥'}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <div style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text)' }}>{level.label}</div>
                        <span style={{
                          padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700,
                          background: `${level.color}20`, color: level.color,
                        }}>{level.id}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{level.tagline}</div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>⏱ {level.duration}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>💪 {exCount} exercises</span>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '22px', color: hoveredCard === level.id ? level.color : 'var(--text-tertiary)',
                      transition: 'all 0.2s ease', fontWeight: 700,
                    }}>›</div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {navStep === 'modes' && selectedBody && selectedLevel && (
        <>
          <Breadcrumb steps={getBreadcrumbs()} onBack={goBack} />
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Where are you training?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {selectedBody.label} · <span style={{ color: selectedLevel.color, fontWeight: 600 }}>{selectedLevel.label}</span>
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
            {MODES.map(mode => {
              const exList = EXERCISE_DB[selectedBody.id]?.[mode.id]?.[selectedLevel.id] || [];
              const totalCalsEst = exList.reduce((sum, e) => sum + (e.cals || 0), 0);
              return (
                <button
                  key={mode.id}
                  onClick={() => { setSelectedMode(mode); setNavStep('workoutList'); }}
                  onMouseEnter={() => setHoveredCard(mode.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    position: 'relative', overflow: 'hidden',
                    borderRadius: '20px', border: `2px solid ${hoveredCard === mode.id ? mode.color : 'var(--border)'}`,
                    cursor: 'pointer', height: '220px', padding: 0, textAlign: 'left',
                    transform: hoveredCard === mode.id ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: hoveredCard === mode.id ? `0 16px 48px ${mode.color}30` : '0 2px 12px rgba(0,0,0,0.06)',
                    transition: 'all 0.22s ease', outline: 'none', background: 'var(--surface)',
                  }}
                >
                  <img
                    src={mode.image}
                    alt={mode.label}
                    style={{
                      position: 'absolute', inset: 0, width: '100%', height: '100%',
                      objectFit: 'cover', opacity: hoveredCard === mode.id ? 0.3 : 0.18,
                      transition: 'opacity 0.3s ease',
                    }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(160deg, transparent, ${mode.color}20)`,
                  }} />
                  <div style={{ position: 'relative', zIndex: 1, padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '36px', marginBottom: '10px' }}>{mode.icon}</div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>{mode.label}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{mode.desc}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '5px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 600,
                        background: `${mode.color}15`, color: mode.color,
                      }}>
                        💪 {exList.length} exercises
                      </span>
                      <span style={{
                        padding: '5px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 600,
                        background: 'var(--surface-2)', color: 'var(--text-secondary)',
                      }}>
                        🔥 ~{totalCalsEst} cal
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {navStep === 'workoutList' && selectedBody && selectedLevel && selectedMode && (
        <>
          <Breadcrumb steps={getBreadcrumbs()} onBack={goBack} />

          <div style={{
            position: 'relative', overflow: 'hidden', borderRadius: '20px',
            marginBottom: '28px', height: '180px',
          }}>
            <img
              src={selectedBody.image}
              alt={selectedBody.label}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(135deg, ${selectedBody.color}cc, ${selectedLevel.color}88)`,
              opacity: 0.7,
            }} />
            <div style={{ position: 'relative', zIndex: 1, padding: '28px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                {[
                  { label: selectedBody.label, color: '#fff' },
                  { label: selectedLevel.label, color: selectedLevel.color },
                  { label: selectedMode.label, color: '#fff' },
                ].map((tag, i) => (
                  <span key={i} style={{
                    padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 700,
                    background: 'rgba(255,255,255,0.2)', color: tag.color, backdropFilter: 'blur(4px)',
                  }}>{tag.label}</span>
                ))}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>
                {selectedBody.label} {selectedLevel.label} · {selectedMode.label}
              </div>
            </div>
          </div>

          {(() => {
            const exList = EXERCISE_DB[selectedBody.id]?.[selectedMode.id]?.[selectedLevel.id] || [];
            const totalCalsEst = exList.reduce((sum, e) => sum + (e.cals || 0), 0);
            const totalTime = exList.reduce((sum, e) => sum + (e.duration || 30) + 15, 0);
            const totalMin = Math.ceil(totalTime / 60);

            return (
              <>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  {[
                    { icon: '💪', label: `${exList.length} exercises` },
                    { icon: '⏱', label: `~${totalMin} min` },
                    { icon: '🔥', label: `~${totalCalsEst} cal` },
                    { icon: '📍', label: selectedMode.subtitle },
                  ].map((s, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: 'var(--surface)', border: '1px solid var(--border-light)',
                      borderRadius: '10px', padding: '8px 14px',
                      fontSize: '13px', fontWeight: 600, color: 'var(--text)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}>
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '14px' }}>
                  Exercises
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {exList.map((ex, i) => (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredCard(`ex-${i}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        background: hoveredCard === `ex-${i}` ? 'var(--surface-2)' : 'var(--surface)',
                        borderRadius: '14px', padding: '14px 18px',
                        border: '1px solid var(--border-light)',
                        transition: 'all 0.15s ease', cursor: 'default',
                      }}
                    >
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                        background: `${selectedBody.color}15`, border: `1.5px solid ${selectedBody.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', fontWeight: 800, color: selectedBody.color,
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '3px' }}>{ex.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {ex.reps} reps · {ex.duration}s · ~{ex.cals} cal
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                        background: 'var(--primary-50)', color: 'var(--primary)',
                      }}>
                        {ex.category}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={startWorkout}
                  disabled={exList.length === 0}
                  style={{
                    width: '100%', padding: '18px', borderRadius: '16px',
                    background: exList.length === 0 ? 'var(--border)' : 'linear-gradient(135deg, #2563EB, #7C3AED)',
                    border: 'none', color: '#fff', fontSize: '17px', fontWeight: 800,
                    cursor: exList.length === 0 ? 'not-allowed' : 'pointer',
                    boxShadow: exList.length === 0 ? 'none' : '0 10px 32px rgba(37,99,235,0.35)',
                    transition: 'all 0.15s ease', letterSpacing: '-0.01em',
                  }}
                  onMouseEnter={e => { if (exList.length > 0) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  ▶ Start Workout
                </button>
              </>
            );
          })()}
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
