import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

function assertFirebaseConfig(): void {
  const required = [
    ["VITE_FIREBASE_API_KEY", firebaseConfig.apiKey],
    ["VITE_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
    ["VITE_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
    ["VITE_FIREBASE_STORAGE_BUCKET", firebaseConfig.storageBucket],
    ["VITE_FIREBASE_MESSAGING_SENDER_ID", firebaseConfig.messagingSenderId],
    ["VITE_FIREBASE_APP_ID", firebaseConfig.appId],
  ] as const;

  const missingKeys = required
    .filter(([, value]) => typeof value !== "string" || value.trim().length === 0)
    .map(([key]) => key);

  if (missingKeys.length === 0) return;

  const missing = missingKeys.join(", ");
  if (import.meta.env.DEV) {
    throw new Error(
      `[firebase] Missing required Vite env vars: ${missing}.\n` +
        `Create a .env (or .env.local) file in the project root (do not commit it) and restart the dev server.\n` +
        `See .env.example for the required keys.`,
    );
  }

  throw new Error(
    `[firebase] Missing required Firebase environment variables for this build: ${missing}. ` +
      `Vite injects these at build time, so rebuild/redeploy with VITE_FIREBASE_* set.`,
  );
}

assertFirebaseConfig();

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
