'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';

const BODY_PARTS = [
  { id: 'full_body', label: 'Full Body', icon: '🏋️', color: '#2563EB' },
  { id: 'chest', label: 'Chest', icon: '💪', color: '#DC2626' },
  { id: 'abs', label: 'Abs', icon: '🔥', color: '#F97316' },
  { id: 'arms', label: 'Arms', icon: '💪', color: '#7C3AED' },
  { id: 'legs', label: 'Legs', icon: '🦵', color: '#065F46' },
  { id: 'back', label: 'Back', icon: '🎯', color: '#0891B2' },
];

const MODES = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'gym', label: 'Gym', icon: '🏋️' },
];

const LEVELS = [
  { id: 'beginner', label: 'Beginner', color: '#10B981' },
  { id: 'intermediate', label: 'Intermediate', color: '#F59E0B' },
  { id: 'advanced', label: 'Advanced', color: '#EF4444' },
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
      width: '140px', height: '140px',
      borderRadius: '50%',
      background: pulse && isActive
        ? 'linear-gradient(135deg, #1D4ED8, #7C3AED)'
        : 'linear-gradient(135deg, #2563EB, #7C3AED)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: pulse && isActive ? '0 0 0 20px rgba(37,99,235,0.15), 0 0 0 40px rgba(37,99,235,0.07)' : '0 8px 32px rgba(37,99,235,0.35)',
      transition: 'all 0.4s ease',
    }}>
      <ExerciseAnimIcon category={exercise?.category} />
    </div>
  );
}

function CountdownRing({ value, max, color = '#2563EB' }) {
  const pct = value / max;
  const r = 54;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="130" height="130" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
        <circle cx="65" cy="65" r={r} fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontSize: '32px', fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>sec</div>
      </div>
    </div>
  );
}

export default function Training() {
  const [view, setView] = useState('browse');
  const [selectedBody, setSelectedBody] = useState('full_body');
  const [selectedMode, setSelectedMode] = useState('home');
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [stats, setStats] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);

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

  const timerRef = useRef(null);

  useEffect(() => {
    fetch('/api/workout/stats').then(r => r.json()).then(setStats).catch(() => {});
    fetch('/api/sessions?type=stats').then(r => r.json()).then(setSessionStats).catch(() => {});
  }, []);

  const getExercises = useCallback(() => {
    const db = EXERCISE_DB[selectedBody]?.[selectedMode]?.[selectedLevel] || [];
    return db;
  }, [selectedBody, selectedMode, selectedLevel]);

  const startWorkout = () => {
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
    setView('session');
  };

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
              setRepsCount(r => r + (ex.reps || 10));
              setCompletedCount(c => c + 1);
            }
            if (exIdx < exercises.length - 1) {
              setPhase('rest');
              setRestTimer(15);
            } else {
              setPhase('done');
            }
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
  }, [view, phase, paused, exIdx, exercises]);

  const skipExercise = () => {
    clearInterval(timerRef.current);
    const ex = exercises[exIdx];
    if (ex) setTotalCals(c => c + Math.round((ex.cals || 8) * 0.5));
    if (exIdx < exercises.length - 1) {
      setExIdx(i => i + 1);
      setPhase('rest');
      setRestTimer(15);
    } else {
      setPhase('done');
    }
  };

  const markDone = () => {
    clearInterval(timerRef.current);
    const ex = exercises[exIdx];
    if (ex) {
      setTotalCals(c => c + (ex.cals || 8));
      setRepsCount(r => r + (ex.reps || 10));
      setCompletedCount(c => c + 1);
    }
    if (exIdx < exercises.length - 1) {
      setExIdx(i => i + 1);
      setPhase('rest');
      setRestTimer(15);
    } else {
      setPhase('done');
    }
  };

  const saveSession = async () => {
    setSaving(true);
    const duration = sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : 0;
    const bodyLabel = BODY_PARTS.find(b => b.id === selectedBody)?.label || selectedBody;
    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${bodyLabel} ${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} Workout`,
          exercises_completed: completedCount,
          duration,
          calories: Math.round(totalCals),
          body_part: selectedBody,
          level: selectedLevel,
        }),
      });
    } catch {}
    setSaving(false);
    setView('browse');
    fetch('/api/sessions?type=stats').then(r => r.json()).then(setSessionStats).catch(() => {});
    fetch('/api/workout/stats').then(r => r.json()).then(setStats).catch(() => {});
  };

  const exitSession = () => {
    clearInterval(timerRef.current);
    setPaused(false);
    setView('browse');
  };

  const currentExercise = exercises[exIdx];
  const bodyPart = BODY_PARTS.find(b => b.id === selectedBody);
  const level = LEVELS.find(l => l.id === selectedLevel);

  if (view === 'session') {
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
              {exercises.length} exercises · {selectedMode} · {selectedLevel}
            </div>
            <button onClick={exitSession} style={{
              marginTop: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', padding: '10px 24px', borderRadius: '12px', fontSize: '14px', cursor: 'pointer',
            }}>Cancel</button>
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
                border: 'none', color: '#fff',
                width: '40px', height: '40px', borderRadius: '12px', fontSize: '18px', cursor: 'pointer',
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
                      background: `${LEVEL_COLORS[selectedLevel]}25`,
                      color: LEVEL_COLORS[selectedLevel],
                    }}>
                      {selectedLevel}
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
                  padding: '20px 16px', textAlign: 'center',
                  border: `1px solid ${s.color}30`,
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
                border: 'none', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
                boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
              }}>{saving ? 'Saving…' : '💾 Save Session'}</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const listExercises = getExercises();

  return (
    <div style={{ padding: '24px 28px', maxWidth: '960px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
          Good morning 👋
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>Training</h1>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #7C3AED 100%)',
        borderRadius: 'var(--radius-xl)', padding: '24px', marginBottom: '28px',
        boxShadow: '0 12px 40px rgba(37,99,235,0.25)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Your Progress
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>
              {sessionStats?.total_sessions ?? 0} Sessions Completed
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
              🔥 {Math.round(sessionStats?.total_calories ?? 0)} calories burned total
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius)', padding: '12px 16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>
              {sessionStats?.total_exercises ?? stats?.total_reps ?? 0}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>exercises</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)', padding: '10px 18px', borderRadius: '12px',
            color: '#fff', fontSize: '13px', fontWeight: 600,
          }}>
            ⏱ {sessionStats?.total_minutes ?? 0} min trained
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)', padding: '10px 18px', borderRadius: '12px',
            color: '#fff', fontSize: '13px', fontWeight: 600,
          }}>
            ✅ {stats?.total_workouts ?? 0} logged sets
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {[
          { icon: '✅', label: 'Sessions', value: sessionStats?.total_sessions ?? 0 },
          { icon: '🔥', label: 'Calories', value: Math.round(sessionStats?.total_calories ?? stats?.calories_burned ?? 0) },
          { icon: '⏱', label: 'Minutes', value: sessionStats?.total_minutes ?? 0 },
          { icon: '💪', label: 'Exercises', value: sessionStats?.total_exercises ?? 0 },
        ].map((s, i) => (
          <div key={i} style={{
            flex: '1 1 100px', background: 'var(--surface)', borderRadius: 'var(--radius)',
            padding: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)', textAlign: 'center',
          }}>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', marginBottom: '2px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        padding: '24px', marginBottom: '28px', border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ fontSize: '22px' }}>🎯</span>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>Start a Workout</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Choose your target and hit it</div>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Body Part
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {BODY_PARTS.map(b => (
              <button key={b.id} onClick={() => setSelectedBody(b.id)} style={{
                padding: '8px 16px', borderRadius: '99px', fontSize: '13px', fontWeight: 600,
                border: selectedBody === b.id ? `2px solid ${b.color}` : '1.5px solid var(--border)',
                background: selectedBody === b.id ? `${b.color}15` : 'transparent',
                color: selectedBody === b.id ? b.color : 'var(--text-secondary)',
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}>
                {b.icon} {b.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Mode
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {MODES.map(m => (
                <button key={m.id} onClick={() => setSelectedMode(m.id)} style={{
                  flex: 1, padding: '10px', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
                  border: selectedMode === m.id ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  background: selectedMode === m.id ? 'var(--primary-50)' : 'var(--surface-2)',
                  color: selectedMode === m.id ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'center',
                }}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Level
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {LEVELS.map(l => (
                <button key={l.id} onClick={() => setSelectedLevel(l.id)} style={{
                  flex: 1, padding: '10px 4px', borderRadius: '12px', fontSize: '11px', fontWeight: 700,
                  border: selectedLevel === l.id ? `2px solid ${l.color}` : '1.5px solid var(--border)',
                  background: selectedLevel === l.id ? `${l.color}15` : 'var(--surface-2)',
                  color: selectedLevel === l.id ? l.color : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'center',
                }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--surface-2)', borderRadius: 'var(--radius-md)',
          padding: '16px', marginBottom: '16px', border: '1px solid var(--border-light)',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
            {bodyPart?.icon} {bodyPart?.label} · {selectedMode === 'home' ? '🏠 Home' : '🏋️ Gym'} · <span style={{ color: level?.color }}>{level?.label}</span> · {listExercises.length} exercises
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {listExercises.slice(0, 3).map((ex, i) => (
              <div key={i} style={{
                background: 'var(--surface)', padding: '6px 12px', borderRadius: '8px',
                fontSize: '12px', color: 'var(--text)', fontWeight: 500, border: '1px solid var(--border-light)',
              }}>
                {ex.name}
              </div>
            ))}
            {listExercises.length > 3 && (
              <div style={{
                background: 'var(--primary-50)', padding: '6px 12px', borderRadius: '8px',
                fontSize: '12px', color: 'var(--primary)', fontWeight: 600,
              }}>
                +{listExercises.length - 3} more
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setView('list')} style={{
            flex: 1, padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 600,
            background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer',
          }}>
            📋 View Exercises
          </button>
          <button onClick={startWorkout} disabled={listExercises.length === 0} style={{
            flex: 2, padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '15px', fontWeight: 700,
            background: listExercises.length === 0 ? 'var(--border)' : 'linear-gradient(135deg, #2563EB, #7C3AED)',
            border: 'none', color: '#fff', cursor: listExercises.length === 0 ? 'not-allowed' : 'pointer',
            boxShadow: listExercises.length === 0 ? 'none' : '0 8px 24px rgba(37,99,235,0.3)',
            transition: 'all 0.15s ease',
          }}>
            ▶ Start Workout
          </button>
        </div>
      </div>

      {view === 'list' && (
        <div style={{
          background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
          padding: '24px', marginBottom: '28px', border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)', animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>
                {bodyPart?.icon} {bodyPart?.label} Workout
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {selectedMode === 'home' ? '🏠 Home' : '🏋️ Gym'} · <span style={{ color: level?.color, fontWeight: 600 }}>{level?.label}</span>
              </div>
            </div>
            <button onClick={() => setView('browse')} style={{
              background: 'var(--surface-2)', border: 'none', color: 'var(--text-secondary)',
              padding: '8px 14px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer',
            }}>✕ Close</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {listExercises.map((ex, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '14px 16px',
                border: '1px solid var(--border-light)', transition: 'all 0.15s ease',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'var(--primary-50)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '18px', flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{ex.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {ex.reps} reps · 30 sec · ~{ex.cals} cal
                  </div>
                </div>
                <div style={{
                  padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                  background: 'var(--primary-50)', color: 'var(--primary)',
                }}>
                  {ex.category}
                </div>
              </div>
            ))}
          </div>

          <button onClick={startWorkout} style={{
            width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '16px', fontWeight: 700,
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            border: 'none', color: '#fff', cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
          }}>
            ▶ Start Workout Now
          </button>
        </div>
      )}
    </div>
  );
}
