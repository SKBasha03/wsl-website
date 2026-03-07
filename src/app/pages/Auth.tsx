import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";

function getFriendlyAuthError(error: unknown): string {
  if (typeof error === "object" && error && "code" in error) {
    const code = String((error as { code?: unknown }).code ?? "");
    const message = String((error as { message?: unknown }).message ?? "");
    switch (code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/missing-password":
        return "Please enter your password.";
      case "auth/weak-password":
        return "Password is too weak (try 6+ characters).";
      case "auth/email-already-in-use":
        return "That email is already registered. Try logging in.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a moment and try again.";
      case "auth/popup-blocked":
        return "Pop-up was blocked by your browser. Allow pop-ups and try again.";
      case "auth/popup-closed-by-user":
        return "Sign-in pop-up was closed before completing. Please try again.";
      case "auth/cancelled-popup-request":
        return "Another sign-in attempt is in progress. Please try again.";
      case "auth/account-exists-with-different-credential":
        return "An account already exists with this email using a different sign-in method. Try logging in with email/password first.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Incorrect email or password.";
      default:
        if (!code) return "Authentication failed. Please try again.";
        if (import.meta.env.DEV) {
          return `Authentication failed (${code}). ${message || ""}`.trim();
        }
        return `Authentication failed (${code}). Please try again.`;
    }
  }
  if (error instanceof Error) return error.message;
  return "Authentication failed. Please try again.";
}

export function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading, signUp } = useAuth();

  const redirectTo = useMemo(() => {
    const redirect = searchParams.get("redirect");
    return redirect && redirect.startsWith("/") ? redirect : "/";
  }, [searchParams]);

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, redirectTo]);

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-lg mx-auto">
          <Card className="relative overflow-hidden border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-md shadow-2xl shadow-black/40 before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-white/10 before:-z-10">
            <CardHeader>
              <CardTitle className="text-white text-3xl font-black">Account</CardTitle>
              <p className="text-gray-300 mt-2">Loading your account...</p>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-lg mx-auto">
          <Card className="relative overflow-hidden border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-md shadow-2xl shadow-black/40 before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-white/10 before:-z-10">
            <CardHeader>
              <CardTitle className="text-white text-3xl font-black">Account</CardTitle>
              <p className="text-gray-300 mt-2">Redirecting you now...</p>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signUp(registerEmail.trim(), registerPassword);
      toast.success("Account created! You’re now logged in.");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("[auth] register failed", err);
      toast.error(getFriendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-lg mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-2xl mb-3 leading-tight">
            Account
          </h1>
          <p className="text-lg text-gray-300">Create an account if you want to save your details for later</p>
        </div>

        <Card className="relative overflow-hidden border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-md shadow-2xl shadow-black/40 before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-white/10 before:-z-10">
          <CardHeader className="pb-6">
            <CardTitle className="text-white text-2xl font-black">Create Account</CardTitle>
            <p className="text-gray-300 mt-2">Registration is optional. You can still build your squad without logging in.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-5 mt-2">
              <div className="space-y-2">
                <Label className="text-white font-semibold" htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-11 font-medium focus:border-white/40 focus:ring-2 focus:ring-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white font-semibold" htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-11 font-medium focus:border-white/40 focus:ring-2 focus:ring-white/10"
                />
                <p className="text-xs text-gray-400 font-medium">Minimum 6 characters required.</p>
              </div>
              <Button
                type="submit"
                disabled={busy}
                className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-none font-bold h-11"
              >
                {busy ? "Creating account…" : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
