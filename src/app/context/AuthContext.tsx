import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

type AuthErrorCode =
  | "auth/invalid-email"
  | "auth/missing-password"
  | "auth/weak-password"
  | "auth/email-already-in-use"
  | "auth/wrong-password"
  | "auth/user-not-found";

type AuthError = Error & { code?: AuthErrorCode };

const AUTH_USER_STORAGE_KEY = "wano_auth_user";
const AUTH_ACCOUNTS_STORAGE_KEY = "wano_auth_accounts";

function createAuthError(code: AuthErrorCode, message: string): AuthError {
  const error = new Error(message) as AuthError;
  error.code = code;
  return error;
}

function isValidEmail(email: string): boolean {
  // Basic client-side sanity check.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateUid(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

type StoredAccounts = Record<string, { password: string; createdAt: number }>;

function readAccounts(): StoredAccounts {
  try {
    const raw = localStorage.getItem(AUTH_ACCOUNTS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as StoredAccounts;
  } catch {
    return {};
  }
}

function writeAccounts(next: StoredAccounts): void {
  localStorage.setItem(AUTH_ACCOUNTS_STORAGE_KEY, JSON.stringify(next));
}

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const u = parsed as Partial<AuthUser>;
    if (typeof u.uid !== "string") return null;
    return {
      uid: u.uid,
      email: typeof u.email === "string" ? u.email : null,
      displayName: typeof u.displayName === "string" ? u.displayName : null,
      photoURL: typeof u.photoURL === "string" ? u.photoURL : null,
    };
  } catch {
    return null;
  }
}

function writeStoredUser(user: AuthUser | null): void {
  if (!user) {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return;
  }
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder auth: restore from localStorage.
    setUser(readStoredUser());
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signUp: async (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
          throw createAuthError("auth/invalid-email", "Please enter a valid email address.");
        }
        if (!password) {
          throw createAuthError("auth/missing-password", "Please enter your password.");
        }
        if (password.length < 6) {
          throw createAuthError("auth/weak-password", "Password is too weak (try 6+ characters)." );
        }

        const accounts = readAccounts();
        if (accounts[normalizedEmail]) {
          throw createAuthError("auth/email-already-in-use", "That email is already registered.");
        }
        accounts[normalizedEmail] = { password, createdAt: Date.now() };
        writeAccounts(accounts);

        const nextUser: AuthUser = {
          uid: generateUid(),
          email: normalizedEmail,
          displayName: normalizedEmail.split("@")[0] || "User",
          photoURL: null,
        };
        writeStoredUser(nextUser);
        setUser(nextUser);
      },
      signIn: async (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
          throw createAuthError("auth/invalid-email", "Please enter a valid email address.");
        }
        if (!password) {
          throw createAuthError("auth/missing-password", "Please enter your password.");
        }

        const accounts = readAccounts();
        const account = accounts[normalizedEmail];
        if (!account) {
          throw createAuthError("auth/user-not-found", "Account not found.");
        }
        if (account.password !== password) {
          throw createAuthError("auth/wrong-password", "Incorrect password.");
        }

        const nextUser: AuthUser = {
          uid: generateUid(),
          email: normalizedEmail,
          displayName: normalizedEmail.split("@")[0] || "User",
          photoURL: null,
        };
        writeStoredUser(nextUser);
        setUser(nextUser);
      },
      logOut: async () => {
        writeStoredUser(null);
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
