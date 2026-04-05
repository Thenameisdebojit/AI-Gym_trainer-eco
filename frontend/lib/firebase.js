'use client';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function isFirebaseConfigured() {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
}

let app = null;
let auth = null;
const googleProvider = new GoogleAuthProvider();

function getFirebaseApp() {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
  return app;
}

export async function signInWithGoogle() {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp || !auth) {
    throw new Error(
      'Google Sign-In is not configured yet. Please add your Firebase credentials to the environment secrets (NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID).'
    );
  }

  const result = await signInWithPopup(auth, googleProvider);

  const credential = GoogleAuthProvider.credentialFromResult(result);
  const googleIdToken = credential?.idToken;
  if (!googleIdToken) {
    throw new Error('Could not retrieve Google OAuth ID token from sign-in result.');
  }

  const firebaseUser = result.user;
  const nameParts = (firebaseUser.displayName || '').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    idToken: googleIdToken,
    email: firebaseUser.email,
    firstName,
    lastName,
    photoUrl: firebaseUser.photoURL || '',
  };
}
