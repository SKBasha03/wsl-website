import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
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
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();

  const redirectTo = useMemo(() => {
    const redirect = searchParams.get("redirect");
    return redirect && redirect.startsWith("/") ? redirect : "/";
  }, [searchParams]);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
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

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(loginEmail.trim(), loginPassword);
      toast.success("Logged in successfully!");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("[auth] login failed", err);
      toast.error(getFriendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleLogin = async () => {
    setBusy(true);
    try {
      await signInWithGoogle();
      toast.success("Logged in with Google!");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("[auth] google login failed", err);
      toast.error(getFriendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  };

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
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl mb-3 leading-tight">
            Account
          </h1>
          <p className="text-lg text-gray-300">Sign in to manage your squad and build your dream team</p>
        </div>

        <Card className="relative overflow-hidden border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-md shadow-2xl shadow-black/40 before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-white/10 before:-z-10">
          <CardHeader className="pb-6">
            <CardTitle className="text-white text-2xl font-black">Welcome Back</CardTitle>
            <p className="text-gray-300 mt-2">Choose your preferred sign-in method</p>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              disabled={busy}
              onClick={handleGoogleLogin}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/20 border-0 font-bold h-12 text-base"
            >
              {busy ? "Opening Google…" : "Continue with Google"}
            </Button>

            <div className="my-8 border-t border-white/20 relative">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 px-4 text-sm text-gray-400 font-medium">
                or
              </span>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 w-full bg-gradient-to-r from-white/5 to-white/10 border-2 border-white/20 p-1.5 rounded-xl shadow-lg">
                <TabsTrigger 
                  value="login"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 text-gray-300 font-bold rounded-lg"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 text-gray-300 font-bold rounded-lg"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-8">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-white font-semibold" htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-11 font-medium focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white font-semibold" htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-11 font-medium focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={busy}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/20 border-0 font-bold h-11"
                  >
                    {busy ? "Signing in…" : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-8">
                <form onSubmit={handleRegister} className="space-y-5">
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
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-11 font-medium focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
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
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-11 font-medium focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                    />
                    <p className="text-xs text-gray-400 font-medium">Minimum 6 characters required.</p>
                  </div>
                  <Button
                    type="submit"
                    disabled={busy}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/20 border-0 font-bold h-11"
                  >
                    {busy ? "Creating account…" : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
