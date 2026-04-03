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

const LEVEL_COLORS = { Beginner: '#10B981', Intermediate: '#F59E0B', Advanced: '#EF4444' };

const WORKOUT_CATALOG = [
  {
    id: 1, title: 'Full Body Blast', category: 'gym', duration: 40, level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&h=500&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&h=500&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&h=500&fit=crop&auto=format',
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
    ],
  },
  {
    id: 4, title: 'Calisthenics Power', category: 'calisthenics', duration: 45, level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&h=500&fit=crop&auto=format',
    desc: 'Bodyweight mastery session focusing on pushing, pulling, and core strength for elite bodyweight control.',
    exercises: [
      { name: 'Muscle-Up Progressions', reps: 5, duration: 30, type: 'upper body', cals: 14 },
      { name: 'Pistol Squats', reps: 8, duration: 30, type: 'legs', cals: 13 },
      { name: 'Planche Lean', reps: 1, duration: 20, type: 'core', cals: 10 },
      { name: 'L-Sit Hold', reps: 1, duration: 20, type: 'core', cals: 9 },
      { name: 'One-Arm Push-Up', reps: 6, duration: 30, type: 'chest', cals: 13 },
      { name: 'Dragon Flag', reps: 6, duration: 30, type: 'core', cals: 12 },
      { name: 'Handstand Hold', reps: 1, duration: 20, type: 'shoulders', cals: 10 },
    ],
  },
  {
    id: 5, title: '7-Minute Abs', category: 'cardio', duration: 7, level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=900&h=500&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=900&h=500&fit=crop&auto=format',
    desc: 'Progressive overload program designed for maximum hypertrophy and strength gains.',
    exercises: [
      { name: 'Barbell Back Squat', reps: 5, duration: 30, type: 'legs', cals: 14 },
      { name: 'Incline Bench Press', reps: 8, duration: 30, type: 'chest', cals: 12 },
      { name: 'Romanian Deadlift', reps: 8, duration: 30, type: 'legs', cals: 12 },
      { name: 'Weighted Pull-Ups', reps: 6, duration: 30, type: 'back', cals: 13 },
      { name: 'Barbell Row', reps: 8, duration: 30, type: 'back', cals: 12 },
      { name: 'Overhead Press', reps: 8, duration: 30, type: 'shoulders', cals: 10 },
      { name: 'Skull Crushers', reps: 10, duration: 30, type: 'triceps', cals: 9 },
      { name: 'Barbell Curl', reps: 10, duration: 30, type: 'biceps', cals: 9 },
    ],
  },
  {
    id: 7, title: 'Gentle Morning Stretch', category: 'yoga', duration: 15, level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&h=500&fit=crop&auto=format',
    desc: 'Easy flexibility and mobility work suitable for all ages. Perfect to start any morning.',
    exercises: [
      { name: 'Neck Rolls', reps: 5, duration: 30, type: 'mobility', cals: 2 },
      { name: 'Shoulder Rolls', reps: 10, duration: 30, type: 'mobility', cals: 2 },
      { name: 'Standing Side Stretch', reps: 5, duration: 30, type: 'flexibility', cals: 3 },
      { name: 'Forward Fold', reps: 1, duration: 30, type: 'flexibility', cals: 3 },
      { name: 'Hip Circles', reps: 10, duration: 30, type: 'mobility', cals: 3 },
      { name: 'Calf Raises & Stretch', reps: 10, duration: 30, type: 'flexibility', cals: 4 },
    ],
  },
  {
    id: 8, title: 'Push Day Classic', category: 'gym', duration: 50, level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=500&fit=crop&auto=format',
    desc: 'Complete chest, shoulders, and triceps session with optimal rep ranges for growth.',
    exercises: [
      { name: 'Flat Bench Press', reps: 10, duration: 30, type: 'chest', cals: 12 },
      { name: 'Incline Dumbbell Press', reps: 12, duration: 30, type: 'chest', cals: 11 },
      { name: 'Cable Crossover', reps: 15, duration: 30, type: 'chest', cals: 9 },
      { name: 'Overhead Press', reps: 10, duration: 30, type: 'shoulders', cals: 10 },
      { name: 'Lateral Raises', reps: 15, duration: 30, type: 'shoulders', cals: 7 },
      { name: 'Tricep Pushdown', reps: 15, duration: 30, type: 'triceps', cals: 7 },
    ],
  },
  {
    id: 9, title: 'Bodyweight Only', category: 'bodyweight', duration: 30, level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&h=500&fit=crop&auto=format',
    desc: 'No equipment needed. A complete total-body session you can do anywhere.',
    exercises: [
      { name: 'Warm-Up Jog in Place', reps: 1, duration: 30, type: 'cardio', cals: 5 },
      { name: 'Push-Ups', reps: 15, duration: 30, type: 'chest', cals: 9 },
      { name: 'Squats', reps: 20, duration: 30, type: 'legs', cals: 8 },
      { name: 'Plank Hold', reps: 1, duration: 30, type: 'core', cals: 6 },
      { name: 'Lunges', reps: 12, duration: 30, type: 'legs', cals: 9 },
      { name: 'Glute Bridges', reps: 20, duration: 30, type: 'glutes', cals: 7 },
      { name: 'Bicycle Crunches', reps: 20, duration: 30, type: 'core', cals: 8 },
    ],
  },
  {
    id: 10, title: 'Sprint Intervals', category: 'cardio', duration: 20, level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&h=500&fit=crop&auto=format',
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
    image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=900&h=500&fit=crop&auto=format',
    desc: 'Back and bicep focused mass builder using vertical and horizontal pulling patterns.',
    exercises: [
      { name: 'Weighted Pull-Ups', reps: 8, duration: 30, type: 'back', cals: 13 },
      { name: 'Barbell Bent-Over Row', reps: 10, duration: 30, type: 'back', cals: 12 },
      { name: 'Lat Pulldown', reps: 12, duration: 30, type: 'back', cals: 9 },
      { name: 'Seated Cable Row', reps: 12, duration: 30, type: 'back', cals: 9 },
      { name: 'Face Pulls', reps: 15, duration: 30, type: 'shoulders', cals: 7 },
      { name: 'Barbell Curl', reps: 10, duration: 30, type: 'biceps', cals: 9 },
      { name: 'Hammer Curl', reps: 12, duration: 30, type: 'biceps', cals: 7 },
    ],
  },
  {
    id: 12, title: 'First Push-Up', category: 'bodyweight', duration: 20, level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1486218119243-13301543a822?w=900&h=500&fit=crop&auto=format',
    desc: 'Learn the correct push-up form from zero, progressing through the movement pattern safely.',
    exercises: [
      { name: 'Wall Push-Ups', reps: 15, duration: 30, type: 'chest', cals: 5 },
      { name: 'Incline Push-Ups', reps: 12, duration: 30, type: 'chest', cals: 6 },
      { name: 'Knee Push-Ups', reps: 10, duration: 30, type: 'chest', cals: 7 },
      { name: 'Standard Push-Ups', reps: 8, duration: 30, type: 'chest', cals: 9 },
      { name: 'Plank Hold', reps: 1, duration: 30, type: 'core', cals: 5 },
    ],
  },
  {
    id: 15, title: '100 Burpee Challenge', category: 'cardio', duration: 30, level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=900&h=500&fit=crop&auto=format',
    desc: 'The ultimate mental and physical toughness test. 100 burpees — beat your time every session.',
    exercises: [
      { name: 'Burpee Block 1 (×25)', reps: 25, duration: 30, type: 'full body', cals: 35 },
      { name: 'Rest & Breathe', reps: 1, duration: 30, type: 'recovery', cals: 3 },
      { name: 'Burpee Block 2 (×25)', reps: 25, duration: 30, type: 'full body', cals: 35 },
      { name: 'Rest & Breathe', reps: 1, duration: 30, type: 'recovery', cals: 3 },
      { name: 'Burpee Block 3 (×25)', reps: 25, duration: 30, type: 'full body', cals: 35 },
      { name: 'Burpee Block 4 (×25)', reps: 25, duration: 30, type: 'full body', cals: 35 },
    ],
  },
  {
    id: 16, title: 'Muscle-Up Mastery', category: 'calisthenics', duration: 40, level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a3?w=900&h=500&fit=crop&auto=format',
    desc: 'Structured progression to achieve your first muscle-up, combining pull and push strength.',
    exercises: [
      { name: 'Scapular Pull-Ups', reps: 10, duration: 30, type: 'back', cals: 8 },
      { name: 'Explosive Pull-Ups', reps: 6, duration: 30, type: 'back', cals: 12 },
      { name: 'Chest-to-Bar Pull-Ups', reps: 5, duration: 30, type: 'back', cals: 13 },
      { name: 'Ring Muscle-Up', reps: 3, duration: 30, type: 'full body', cals: 14 },
      { name: 'Bar Muscle-Up Attempt', reps: 3, duration: 30, type: 'full body', cals: 14 },
    ],
  },
  {
    id: 17, title: 'Shoulder Rehab', category: 'rehab', duration: 20, level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=500&fit=crop&auto=format',
    desc: 'Evidence-based shoulder rehab protocol to restore strength, mobility, and pain-free movement.',
    exercises: [
      { name: 'Pendulum Swings', reps: 20, duration: 30, type: 'mobility', cals: 3 },
      { name: 'External Rotation (band)', reps: 15, duration: 30, type: 'rotator cuff', cals: 4 },
      { name: 'Wall Slides', reps: 15, duration: 30, type: 'mobility', cals: 4 },
      { name: 'Prone Y-T-W', reps: 10, duration: 30, type: 'back', cals: 5 },
      { name: 'Band Pull-Apart', reps: 15, duration: 30, type: 'back', cals: 4 },
    ],
  },
  {
    id: 18, title: 'Muay Thai Basics', category: 'martial arts', duration: 30, level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=900&h=500&fit=crop&auto=format',
    desc: 'Fundamental Muay Thai strikes, footwork, and conditioning. Build power from the ground up.',
    exercises: [
      { name: 'Shadow Boxing Warm-Up', reps: 1, duration: 30, type: 'cardio', cals: 8 },
      { name: 'Jab-Cross Combos', reps: 20, duration: 30, type: 'punching', cals: 9 },
      { name: 'Teep Push Kicks', reps: 10, duration: 30, type: 'kicking', cals: 10 },
      { name: 'Roundhouse Kicks', reps: 10, duration: 30, type: 'kicking', cals: 10 },
      { name: 'Knee Strikes', reps: 15, duration: 30, type: 'knees', cals: 9 },
      { name: 'Footwork Drills', reps: 1, duration: 30, type: 'movement', cals: 7 },
    ],
  },
  {
    id: 20, title: 'Core Stability', category: 'bodyweight', duration: 20, level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=900&h=500&fit=crop&auto=format',
    desc: 'Foundation core work combining anti-rotation, stability, and endurance for injury prevention.',
    exercises: [
      { name: 'Dead Bug', reps: 10, duration: 30, type: 'core', cals: 5 },
      { name: 'Bird Dog', reps: 10, duration: 30, type: 'core', cals: 5 },
      { name: 'Plank Hold', reps: 1, duration: 30, type: 'core', cals: 6 },
      { name: 'Side Plank (L)', reps: 1, duration: 30, type: 'obliques', cals: 5 },
      { name: 'Side Plank (R)', reps: 1, duration: 30, type: 'obliques', cals: 5 },
      { name: 'Hollow Body Hold', reps: 1, duration: 30, type: 'core', cals: 6 },
    ],
  },
  {
    id: 24, title: 'Dumbbell Full Body', category: 'gym', duration: 35, level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=900&h=500&fit=crop&auto=format',
    desc: 'Versatile dumbbell program hitting every major muscle group — gym or home.',
    exercises: [
      { name: 'DB Goblet Squat', reps: 15, duration: 30, type: 'legs', cals: 9 },
      { name: 'DB Chest Press', reps: 12, duration: 30, type: 'chest', cals: 10 },
      { name: 'DB Romanian Deadlift', reps: 12, duration: 30, type: 'legs', cals: 10 },
      { name: 'DB Bent-Over Row', reps: 12, duration: 30, type: 'back', cals: 9 },
      { name: 'DB Shoulder Press', reps: 12, duration: 30, type: 'shoulders', cals: 9 },
      { name: 'DB Bicep Curl', reps: 12, duration: 30, type: 'biceps', cals: 7 },
      { name: 'DB Renegade Row', reps: 8, duration: 30, type: 'core', cals: 11 },
    ],
  },
];

const BODY_FOCUS = [
  { label: 'Chest', icon: '💪', color: '#DC2626', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=280&fit=crop&auto=format', workoutId: 8 },
  { label: 'Abs', icon: '🔥', color: '#F97316', image: 'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=400&h=280&fit=crop&auto=format', workoutId: 5 },
  { label: 'Arms', icon: '💪', color: '#7C3AED', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=280&fit=crop&auto=format', workoutId: 9 },
  { label: 'Back', icon: '🎯', color: '#0891B2', image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=400&h=280&fit=crop&auto=format', workoutId: 11 },
  { label: 'Legs', icon: '🦵', color: '#065F46', image: 'https://images.unsplash.com/photo-1434608519344-49d77a124f18?w=400&h=280&fit=crop&auto=format', workoutId: 1 },
  { label: 'Cardio', icon: '❤️', color: '#EF4444', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=280&fit=crop&auto=format', workoutId: 2 },
];

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
      boxShadow: pulse && isActive ? `0 0 0 20px ${color}22, 0 0 0 40px ${color}0f` : `0 8px 32px ${color}55`,
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
      r = r.filter(w => w.title.toLowerCase().includes(q) || w.desc.toLowerCase().includes(q) || w.category.toLowerCase().includes(q) || w.level.toLowerCase().includes(q));
    }
    return r;
  }, [search, category]);

  const openDetail = useCallback((workout) => { setSelectedWorkout(workout); setView('detail'); }, []);
  const openById = useCallback((id) => { const w = WORKOUT_CATALOG.find(x => x.id === id); if (w) openDetail(w); }, [openDetail]);

  const startWorkout = () => {
    setExIdx(0); setPhase('countdown'); setCountdown(5); setExerciseTimer(30); setRestTimer(15);
    setPaused(false); setTotalCals(0); setTotalReps(0); setCompletedCount(0); setSessionStart(Date.now());
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
    else setPhase('done');
  }, [exIdx, exercises]);

  const skipExercise = useCallback(() => {
    clearInterval(timerRef.current);
    if (exIdx < exercises.length - 1) { setExIdx(i => i + 1); setPhase('rest'); setRestTimer(15); }
    else setPhase('done');
  }, [exIdx, exercises]);

  useEffect(() => {
    if (view !== 'session') { clearInterval(timerRef.current); return; }
    if (paused) return;
    clearInterval(timerRef.current);
    if (phase === 'countdown') {
      timerRef.current = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(timerRef.current); setPhase('exercise'); setExerciseTimer(30); return 0; } return c - 1; }), 1000);
    } else if (phase === 'exercise') {
      timerRef.current = setInterval(() => setExerciseTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          const ex = exercises[exIdx];
          if (ex) { setTotalCals(c => c + (ex.cals || 8)); setTotalReps(r => r + (ex.reps || 10)); setCompletedCount(c => c + 1); }
          if (exIdx < exercises.length - 1) { setPhase('rest'); setRestTimer(15); } else setPhase('done');
          return 0;
        }
        return t - 1;
      }), 1000);
    } else if (phase === 'rest') {
      timerRef.current = setInterval(() => setRestTimer(t => { if (t <= 1) { clearInterval(timerRef.current); setExIdx(i => i + 1); setPhase('exercise'); setExerciseTimer(30); return 0; } return t - 1; }), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [view, phase, paused, exIdx]);

  const saveSession = async () => {
    setSaving(true);
    try {
      await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: selectedWorkout?.title || 'Workout', exercises_completed: completedCount, duration: sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : 0, calories: Math.round(totalCals), body_part: selectedWorkout?.category || 'full_body', level: selectedWorkout?.level?.toLowerCase() || 'beginner' }) });
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
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#0F172A,#1E293B)', color: '#fff' }}>
        {phase === 'countdown' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 24 }}>
            <div style={{ fontSize: 52 }}>🏁</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{selectedWorkout.title}</div>
            <CountdownRing value={countdown} max={5} color="#F97316" />
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{exercises.length} exercises · {selectedWorkout.level}</div>
            <button onClick={() => { clearInterval(timerRef.current); setPhase('exercise'); setExerciseTimer(30); }} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#94A3B8', padding: '10px 24px', borderRadius: 12, fontSize: 14, cursor: 'pointer' }}>Skip Countdown</button>
            <button onClick={goBack} style={{ background: 'transparent', border: 'none', color: '#475569', fontSize: 13, cursor: 'pointer' }}>← Back</button>
          </div>
        )}
        {(phase === 'exercise' || phase === 'rest') && currentExercise && (
          <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <button onClick={goBack} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: 40, height: 40, borderRadius: 12, fontSize: 18, cursor: 'pointer' }}>✕</button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>{phase === 'rest' ? 'Rest' : `${exIdx + 1} / ${exercises.length}`}</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{selectedWorkout.title}</div>
              </div>
              <button onClick={() => setPaused(p => !p)} style={{ background: paused ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: 40, height: 40, borderRadius: 12, fontSize: 18, cursor: 'pointer' }}>{paused ? '▶' : '⏸'}</button>
            </div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
              {exercises.map((_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < exIdx ? '#10B981' : i === exIdx ? '#2563EB' : 'rgba(255,255,255,0.12)', transition: 'background 0.3s' }} />)}
            </div>
            {phase === 'rest' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, marginBottom: 32 }}>
                <div style={{ fontSize: 48 }}>😤</div>
                <div style={{ fontSize: 26, fontWeight: 800 }}>Rest</div>
                <CountdownRing value={restTimer} max={15} color="#10B981" />
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Next: <strong style={{ color: '#fff' }}>{exercises[exIdx + 1]?.name || 'Finish'}</strong></div>
                <button onClick={() => { clearInterval(timerRef.current); setExIdx(i => i + 1); setPhase('exercise'); setExerciseTimer(30); }} style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', padding: '12px 28px', borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Skip Rest →</button>
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
                  <button onClick={skipExercise} style={{ flex: 1, padding: 14, borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#64748B', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Skip ›</button>
                  <button onClick={markDone} style={{ flex: 2, padding: 14, borderRadius: 16, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}>✓ Done</button>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 14, marginTop: 28, background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
              {[{ label: 'Calories', value: `${Math.round(totalCals)}`, icon: '🔥' }, { label: 'Done', value: `${completedCount}/${exercises.length}`, icon: '✅' }, { label: 'Time', value: `${totalMin}:${String(totalSec).padStart(2, '0')}`, icon: '⏱' }].map((s, i) => (
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 24, padding: 28 }}>
            <div style={{ fontSize: 72 }}>🏆</div>
            <div style={{ fontSize: 32, fontWeight: 900 }}>Workout Complete!</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>{selectedWorkout.title}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%', maxWidth: 380 }}>
              {[{ icon: '🔥', label: 'Calories', value: `${Math.round(totalCals)} kcal`, color: '#F97316' }, { icon: '✅', label: 'Exercises', value: `${completedCount}`, color: '#10B981' }, { icon: '💪', label: 'Total Reps', value: `${totalReps}`, color: '#7C3AED' }, { icon: '⏱', label: 'Duration', value: sessionStart ? `${Math.floor((Date.now() - sessionStart) / 60000)} min` : '—', color: '#2563EB' }].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px 16px', textAlign: 'center', border: `1px solid ${s.color}30` }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 380 }}>
              <button onClick={() => { setSelectedWorkout(null); setView('browse'); }} style={{ flex: 1, padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#64748B', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Browse</button>
              <button onClick={saveSession} disabled={saving} style={{ flex: 2, padding: 16, borderRadius: 16, background: saving ? 'rgba(37,99,235,0.4)' : 'linear-gradient(135deg,#2563EB,#7C3AED)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Saving…' : '💾 Save Session'}</button>
            </div>
          </div>
        )}
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </div>
    );
  }

  if (view === 'detail' && selectedWorkout) {
    const catColor = CAT_COLORS[selectedWorkout.category] || '#2563EB';
    const levelColor = LEVEL_COLORS[selectedWorkout.level] || '#10B981';
    const cat = CATEGORIES.find(c => c.id === selectedWorkout.category);
    const totalCalsPreview = selectedWorkout.exercises.reduce((s, e) => s + (e.cals || 0), 0);
    return (
      <div style={{ animation: 'fadeIn 0.3s ease', background: 'var(--bg)', minHeight: '100vh' }}>
        <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
          <img src={selectedWorkout.image} alt={selectedWorkout.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg,transparent 20%,${catColor}99)` }} />
          <button onClick={goBack} style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: 'none', color: '#fff', width: 42, height: 42, borderRadius: 12, fontSize: 18, cursor: 'pointer' }}>←</button>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 28px 28px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, color: '#fff' }}>{cat?.icon} {selectedWorkout.category}</span>
              <span style={{ padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: `${levelColor}cc`, color: '#fff' }}>{selectedWorkout.level}</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>{selectedWorkout.title}</div>
          </div>
        </div>
        <div style={{ padding: '24px 28px', maxWidth: 800 }}>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>{selectedWorkout.desc}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
            {[{ icon: '⏱', label: 'Duration', value: `${selectedWorkout.duration} min` }, { icon: '💪', label: 'Exercises', value: selectedWorkout.exercises.length }, { icon: '🔥', label: 'Est. Cal', value: `~${totalCalsPreview}` }, { icon: '📊', label: 'Level', value: selectedWorkout.level }].map((s, i) => (
              <div key={i} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '16px 12px', textAlign: 'center', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Exercise List</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
            {selectedWorkout.exercises.map((ex, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '14px 16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${catColor}15`, border: `1.5px solid ${catColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: catColor, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{ex.reps} reps · {ex.duration}s · ~{ex.cals} cal</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', background: 'var(--surface-2)', padding: '3px 10px', borderRadius: 8 }}>{ex.type}</span>
              </div>
            ))}
          </div>
          <button onClick={startWorkout} style={{ width: '100%', padding: 18, borderRadius: 'var(--radius-md)', background: `linear-gradient(135deg,${catColor},#7C3AED)`, border: 'none', color: '#fff', fontSize: 18, fontWeight: 800, cursor: 'pointer', boxShadow: `0 12px 36px ${catColor}40`, transition: 'all 0.15s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >▶ Start Workout</button>
        </div>
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </div>
    );
  }

  const isFiltering = search.trim() || category !== 'all';
  const hero = WORKOUT_CATALOG.find(w => w.id === 2);
  const picks = [WORKOUT_CATALOG.find(w => w.id === 1), WORKOUT_CATALOG.find(w => w.id === 4), WORKOUT_CATALOG.find(w => w.id === 11), WORKOUT_CATALOG.find(w => w.id === 8)].filter(Boolean);
  const beginners = WORKOUT_CATALOG.filter(w => w.level === 'Beginner');
  const fastWorkouts = WORKOUT_CATALOG.filter(w => w.duration <= 20);
  const challenges = WORKOUT_CATALOG.filter(w => w.level === 'Advanced');
  const stretchRecovery = WORKOUT_CATALOG.filter(w => w.category === 'yoga' || w.category === 'rehab');
  const equipment = WORKOUT_CATALOG.find(w => w.id === 6);

  return (
    <div style={{ paddingBottom: 40, animation: 'fadeIn 0.35s ease', background: 'var(--bg)' }}>

      <div style={{ padding: '28px 28px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search workouts, categories, levels…"
              style={{ width: '100%', padding: '12px 40px 12px 44px', border: '1.5px solid var(--border)', borderRadius: 14, fontSize: 14, color: 'var(--text)', background: 'var(--surface)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s ease' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'var(--surface-2)', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: 13 }}>✕</button>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)} style={{ padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, border: category === c.id ? `2px solid ${c.color}` : '1.5px solid var(--border)', background: category === c.id ? `${c.color}15` : 'var(--surface)', color: category === c.id ? c.color : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s ease', outline: 'none', flexShrink: 0 }}>
              {c.icon} {c.label}
            </button>
          ))}
          {isFiltering && <button onClick={() => { setSearch(''); setCategory('all'); }} style={{ padding: '7px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}>✕ Clear</button>}
        </div>
      </div>

      {isFiltering ? (
        <div style={{ padding: '0 28px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16 }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}{search ? ` for "${search}"` : ''}</div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>No workouts found</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Try a different search or category</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {filtered.map(w => <SmallCard key={w.id} workout={w} onOpen={openDetail} hovered={hoveredCard} setHovered={setHoveredCard} />)}
            </div>
          )}
        </div>
      ) : (
        <>
          {hero && (
            <div style={{ padding: '0 28px', marginBottom: 32 }}>
              <button onClick={() => openDetail(hero)} onMouseEnter={() => setHoveredCard('hero')} onMouseLeave={() => setHoveredCard(null)}
                style={{ position: 'relative', width: '100%', height: 220, borderRadius: 22, overflow: 'hidden', border: 'none', cursor: 'pointer', padding: 0, display: 'block', transform: hoveredCard === 'hero' ? 'scale(1.01)' : 'scale(1)', transition: 'transform 0.2s ease', boxShadow: hoveredCard === 'hero' ? '0 20px 56px rgba(0,0,0,0.2)' : '0 8px 28px rgba(0,0,0,0.12)' }}>
                <img src={hero.image} alt={hero.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <span style={{ background: '#DC262699', color: '#fff', padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>🏃 CARDIO</span>
                    <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>Editor's Pick</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 8, textAlign: 'left' }}>{hero.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 16, textAlign: 'left', maxWidth: 400 }}>Burn fat fast · {hero.duration} min · {hero.exercises.length} exercises</div>
                  <div style={{ background: '#fff', color: '#0F172A', padding: '10px 24px', borderRadius: 99, fontSize: 14, fontWeight: 800 }}>Start Now ▶</div>
                </div>
              </button>
            </div>
          )}

          <Section label="Picks for You ⭐" sub={`${picks.length} workouts`} pad>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {picks.map(w => <PickRow key={w.id} workout={w} onOpen={openDetail} hovered={hoveredCard} setHovered={setHoveredCard} />)}
            </div>
          </Section>

          <Section label="For Beginners 🌱" sub="Start here" pad={false}>
            <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingLeft: 28, paddingRight: 28, paddingBottom: 6 }} className="hide-scroll">
              {beginners.map(w => <HScrollCard key={w.id} workout={w} onOpen={openDetail} hovered={hoveredCard} setHovered={setHoveredCard} />)}
            </div>
          </Section>

          <Section label="Fast Workouts ⚡" sub="Under 20 min" pad>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {fastWorkouts.map(w => <FastRow key={w.id} workout={w} onOpen={openDetail} hovered={hoveredCard} setHovered={setHoveredCard} />)}
            </div>
          </Section>

          <Section label="Challenges 🔥" sub="For the brave" pad={false}>
            <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingLeft: 28, paddingRight: 28, paddingBottom: 6 }} className="hide-scroll">
              {challenges.map(w => <ChallengeCard key={w.id} workout={w} onOpen={openDetail} hovered={hoveredCard} setHovered={setHoveredCard} />)}
            </div>
          </Section>

          {equipment && (
            <div style={{ padding: '0 28px', marginBottom: 32 }}>
              <SectionHeader label="With Equipment 🏋️" sub="Gym workouts" />
              <button onClick={() => openDetail(equipment)} onMouseEnter={() => setHoveredCard('equip')} onMouseLeave={() => setHoveredCard(null)}
                style={{ position: 'relative', width: '100%', height: 150, borderRadius: 20, overflow: 'hidden', border: 'none', cursor: 'pointer', padding: 0, display: 'block', transform: hoveredCard === 'equip' ? 'scale(1.01)' : 'scale(1)', transition: 'all 0.2s ease', boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}>
                <img src={equipment.image} alt={equipment.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1D4ED8cc,#7C3AED99)' }} />
                <div style={{ position: 'absolute', inset: 0, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Gym · {equipment.duration} min</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{equipment.title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{equipment.level} · {equipment.exercises.length} exercises</div>
                  </div>
                  <div style={{ background: '#fff', color: '#1D4ED8', padding: '12px 22px', borderRadius: 99, fontSize: 14, fontWeight: 800, flexShrink: 0 }}>Let's Go →</div>
                </div>
              </button>
            </div>
          )}

          <Section label="Stretch & Recovery 🧘" sub="Relax & restore" pad={false}>
            <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingLeft: 28, paddingRight: 28, paddingBottom: 6 }} className="hide-scroll">
              {stretchRecovery.map(w => <HScrollCard key={w.id} workout={w} onOpen={openDetail} hovered={hoveredCard} setHovered={setHoveredCard} />)}
            </div>
          </Section>

          <Section label="Body Focus 🎯" sub="Target a muscle group" pad>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {BODY_FOCUS.map((bf, i) => (
                <button key={i} onClick={() => openById(bf.workoutId)} onMouseEnter={() => setHoveredCard(`bf-${i}`)} onMouseLeave={() => setHoveredCard(null)}
                  style={{ position: 'relative', height: 110, borderRadius: 16, overflow: 'hidden', border: 'none', cursor: 'pointer', padding: 0, transform: hoveredCard === `bf-${i}` ? 'scale(1.03)' : 'scale(1)', transition: 'all 0.2s ease', boxShadow: hoveredCard === `bf-${i}` ? `0 12px 32px ${bf.color}30` : '0 2px 10px rgba(0,0,0,0.08)' }}>
                  <img src={bf.image} alt={bf.label} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45)' }} />
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, transparent, ${bf.color}cc)` }} />
                  <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12 }}>
                    <div style={{ fontSize: 11, marginBottom: 2 }}>{bf.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{bf.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </Section>
        </>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

function SectionHeader({ label, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

function Section({ label, sub, pad, children }) {
  return (
    <div style={{ marginBottom: 32, ...(pad ? { padding: '0 28px' } : {}) }}>
      <div style={{ padding: pad ? 0 : '0 28px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function PickRow({ workout, onOpen, hovered, setHovered }) {
  const catColor = CAT_COLORS[workout.category] || '#2563EB';
  const isHovered = hovered === `pick-${workout.id}`;
  return (
    <button onClick={() => onOpen(workout)} onMouseEnter={() => setHovered(`pick-${workout.id}`)} onMouseLeave={() => setHovered(null)}
      style={{ display: 'flex', alignItems: 'center', gap: 14, background: isHovered ? 'var(--surface-2)' : 'var(--surface)', borderRadius: 16, padding: '12px 14px', border: `1.5px solid ${isHovered ? catColor : 'var(--border-light)'}`, cursor: 'pointer', textAlign: 'left', outline: 'none', transition: 'all 0.18s ease', boxShadow: isHovered ? `0 6px 20px ${catColor}20` : 'var(--shadow-sm)' }}>
      <div style={{ width: 70, height: 70, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
        <img src={workout.image} alt={workout.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{workout.title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{workout.desc.slice(0, 60)}…</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: `${catColor}15`, color: catColor }}>{workout.category}</span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>⏱ {workout.duration} min</span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: `${LEVEL_COLORS[workout.level]}15`, color: LEVEL_COLORS[workout.level] }}>{workout.level}</span>
        </div>
      </div>
      <span style={{ fontSize: 20, color: isHovered ? catColor : 'var(--text-tertiary)', fontWeight: 700, transition: 'all 0.15s ease' }}>›</span>
    </button>
  );
}

function HScrollCard({ workout, onOpen, hovered, setHovered }) {
  const catColor = CAT_COLORS[workout.category] || '#2563EB';
  const isHovered = hovered === `hsc-${workout.id}`;
  return (
    <button onClick={() => onOpen(workout)} onMouseEnter={() => setHovered(`hsc-${workout.id}`)} onMouseLeave={() => setHovered(null)}
      style={{ position: 'relative', width: 180, height: 200, flexShrink: 0, borderRadius: 18, overflow: 'hidden', border: 'none', cursor: 'pointer', padding: 0, transform: isHovered ? 'translateY(-4px)' : 'translateY(0)', transition: 'all 0.2s ease', boxShadow: isHovered ? `0 14px 36px ${catColor}30` : '0 2px 10px rgba(0,0,0,0.09)' }}>
      <img src={workout.image} alt={workout.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isHovered ? 'brightness(0.5)' : 'brightness(0.4)' }} />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${catColor}dd 0%, transparent 60%)` }} />
      <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#fff' }}>{workout.duration}m</div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 14px' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: 4 }}>{workout.title}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{workout.exercises.length} exercises</div>
      </div>
    </button>
  );
}

function FastRow({ workout, onOpen, hovered, setHovered }) {
  const catColor = CAT_COLORS[workout.category] || '#2563EB';
  const isHovered = hovered === `fast-${workout.id}`;
  return (
    <button onClick={() => onOpen(workout)} onMouseEnter={() => setHovered(`fast-${workout.id}`)} onMouseLeave={() => setHovered(null)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, background: isHovered ? 'var(--surface-2)' : 'var(--surface)', borderRadius: 14, padding: '10px 14px', border: '1px solid var(--border-light)', cursor: 'pointer', textAlign: 'left', outline: 'none', transition: 'all 0.15s ease', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
        <img src={workout.image} alt={workout.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{workout.title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{workout.duration} min · {workout.level}</div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: `${catColor}15`, color: catColor, flexShrink: 0 }}>⚡ {workout.duration}m</span>
    </button>
  );
}

function ChallengeCard({ workout, onOpen, hovered, setHovered }) {
  const catColor = CAT_COLORS[workout.category] || '#EF4444';
  const isHovered = hovered === `ch-${workout.id}`;
  return (
    <button onClick={() => onOpen(workout)} onMouseEnter={() => setHovered(`ch-${workout.id}`)} onMouseLeave={() => setHovered(null)}
      style={{ position: 'relative', width: 220, height: 170, flexShrink: 0, borderRadius: 18, overflow: 'hidden', border: 'none', cursor: 'pointer', padding: 0, transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)', transition: 'all 0.2s ease', boxShadow: isHovered ? '0 16px 40px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.1)' }}>
      <img src={workout.image} alt={workout.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${catColor}aa, #0F172Acc)` }} />
      <div style={{ position: 'absolute', inset: 0, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ background: '#EF4444', color: '#fff', padding: '3px 9px', borderRadius: 99, fontSize: 10, fontWeight: 800 }}>🔥 ADVANCED</span>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '3px 9px', borderRadius: 99, fontSize: 10, fontWeight: 700 }}>{workout.duration}m</span>
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>{workout.title}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{workout.exercises.length} exercises</div>
        </div>
      </div>
    </button>
  );
}

function SmallCard({ workout, onOpen, hovered, setHovered }) {
  const catColor = CAT_COLORS[workout.category] || '#2563EB';
  const isHovered = hovered === workout.id;
  return (
    <button onClick={() => onOpen(workout)} onMouseEnter={() => setHovered(workout.id)} onMouseLeave={() => setHovered(null)}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 18, border: `2px solid ${isHovered ? catColor : 'var(--border)'}`, cursor: 'pointer', padding: 0, textAlign: 'left', background: 'var(--surface)', transform: isHovered ? 'translateY(-4px)' : 'translateY(0)', boxShadow: isHovered ? `0 16px 40px rgba(0,0,0,0.12)` : '0 2px 10px rgba(0,0,0,0.06)', transition: 'all 0.2s ease', outline: 'none' }}>
      <div style={{ height: 140, overflow: 'hidden', position: 'relative' }}>
        <img src={workout.image} alt={workout.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isHovered ? 'brightness(0.55)' : 'brightness(0.5)', transition: 'filter 0.3s' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg,transparent,${catColor}99)` }} />
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#fff' }}>{workout.duration}m</div>
        {isHovered && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 99, padding: '8px 20px', fontSize: 13, fontWeight: 800, color: catColor }}>▶ Start</div></div>}
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>{workout.title}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 99, background: `${catColor}15`, color: catColor }}>{workout.category}</span>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 99, background: `${LEVEL_COLORS[workout.level]}15`, color: LEVEL_COLORS[workout.level] }}>{workout.level}</span>
        </div>
      </div>
    </button>
  );
}
