# Fix Auth: OTP, Login & Google Sign-In

## What & Why
Three auth issues need fixing across the web frontend and mobile app:

1. **OTP emails not delivered** — The backend `send_otp_email` function is wired up correctly for Gmail SMTP, but the `SMTP_USER` and `SMTP_PASS` environment secrets are not set. Emails fall through to a console-only fallback, so users never receive the OTP in their inbox.

2. **Login not working after sign-up** — Two separate problems:
   - **Web frontend**: Auth logic calls the backend correctly, but the backend stores all users in in-memory Python dicts (`users_db`, `otp_store`, `sessions_store`). Every time the server reloads (uvicorn `--reload`), all registered users are wiped and login fails.
   - **Mobile app**: The `login()` and `register()` functions in `AuthContext.tsx` are mock stubs that never contact the backend — they silently create a fake local user regardless of credentials.

3. **Google Sign-In not implemented** — The web frontend has a "Continue with Google" button that is hard-coded to show `"Google sign-in coming soon!"`. The mobile app has no Google button at all. Firebase is already in the mobile `package.json` but has no config or integration.

## Done looks like
- A user who registers on the **web app** receives an OTP in their Gmail inbox, verifies it, and can log in again later with the same email/password even after a server restart.
- A user who registers on the **mobile app** is saved to the real backend and can log in with the same credentials.
- The "Continue with Google" button on the **web app** triggers a real Google OAuth popup and logs the user in.
- A Google sign-in button exists on the **mobile app** and triggers Firebase Google auth.
- All auth data persists across server restarts.

## Out of scope
- Password reset / forgot-password flow
- Social login providers other than Google
- Changing the overall UI layout or design

## Tasks

1. **Set Gmail SMTP secrets** — Add `SMTP_USER` (the sender Gmail address) and `SMTP_PASS` (a Gmail App Password) as environment secrets so the existing `send_otp_email` function can deliver real emails. Prompt the user for these values if they haven't been provided.

2. **Persist backend auth to SQLite** — Replace the in-memory `users_db`, `otp_store`, and `sessions_store` Python dicts in `Backend/routes/auth.py` with SQLite-backed storage (using the already-configured SQLAlchemy + SQLite database at `fitness.db`). Add a `User` model with the required fields, migrate on startup, and keep all existing endpoint logic intact.

3. **Wire mobile AuthContext to real backend API** — Replace the mock `login()` and `register()` stubs in `mobile/context/AuthContext.tsx` with real `fetch` calls to the backend `/auth/register`, `/auth/verify-otp`, and `/auth/login` endpoints. Add a backend base URL constant (reading from `EXPO_PUBLIC_API_URL` env var). Add an OTP verification step to the mobile sign-up flow in `mobile/app/auth/index.tsx`.

4. **Implement Firebase Google Sign-In on web and mobile** — Set up a Firebase project config (collect `NEXT_PUBLIC_FIREBASE_*` env vars from the user), initialize Firebase in the frontend, implement Google OAuth sign-in on the web Auth screen, and implement Google sign-in using `expo-auth-session` or Firebase on the mobile auth screen. On successful Google auth, upsert the user in the backend and return a session token.

## Relevant files
- `Backend/routes/auth.py`
- `Backend/config/database.py`
- `Backend/models/user.py`
- `mobile/context/AuthContext.tsx`
- `mobile/app/auth/index.tsx`
- `frontend/screens/Auth.js`
- `mobile/package.json`
