import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
};

const isConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

const app = isConfigured
  ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig))
  : null;

export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;

export interface WorkoutSession {
  userId: string;
  title: string;
  exercisesCompleted: number;
  duration: number;
  calories: number;
  bodyPart: string;
  level: string;
  date: Date;
}

export async function saveSessionToFirebase(session: WorkoutSession): Promise<string | null> {
  if (!db || !isConfigured) return null;
  try {
    const ref = await addDoc(collection(db, 'sessions'), {
      ...session,
      date: Timestamp.fromDate(session.date),
    });
    return ref.id;
  } catch (e) {
    console.warn('Firebase save failed:', e);
    return null;
  }
}

export async function getSessionsFromFirebase(
  userId: string,
  limitCount: number = 20
): Promise<WorkoutSession[]> {
  if (!db || !isConfigured) return [];
  try {
    const q = query(
      collection(db, 'sessions'),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        ...d,
        date: d.date?.toDate ? d.date.toDate() : new Date(d.date),
      } as WorkoutSession;
    });
  } catch (e) {
    console.warn('Firebase fetch failed:', e);
    return [];
  }
}

export async function getStatsFromFirebase(userId: string) {
  if (!db || !isConfigured) return null;
  try {
    const sessions = await getSessionsFromFirebase(userId, 1000);
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    return {
      total_sessions: sessions.length,
      total_calories: sessions.reduce((sum, s) => sum + s.calories, 0),
      total_minutes: sessions.reduce((sum, s) => sum + Math.floor(s.duration / 60), 0),
      total_exercises: sessions.reduce((sum, s) => sum + s.exercisesCompleted, 0),
      this_week: sessions.filter(s => s.date >= weekStart).length,
    };
  } catch (e) {
    console.warn('Firebase stats failed:', e);
    return null;
  }
}

export { isConfigured };
