
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Code2,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import authService from "../services/auth";
import { useAuthStore } from "../store/authStore";

export default function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      await authService.login({
        username: username.trim(),
        password,
      });

      const user = await authService.getCurrentUser();
      setUser(user);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Registration failed. The username or email may already be in use.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b16] px-4 py-12 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111629] p-8 shadow-2xl">
        <Link to="/" className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-violet-600 p-2">
            <Code2 size={24} />
          </div>
          <span className="text-xl font-bold">DevMind AI</span>
        </Link>

        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-slate-400">
          Start building smarter with your AI development workspace.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm text-slate-300">
              Username
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#080b16] px-3">
              <User size={18} className="text-slate-500" />
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                minLength={3}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Choose a username"
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
              Email address
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#080b16] px-3">
              <Mail size={18} className="text-slate-500" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
              Password
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#080b16] px-3">
              <Lock size={18} className="text-slate-500" />
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm text-slate-300">
              Confirm password
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#080b16] px-3">
              <Lock size={18} className="text-slate-500" />
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter your password again"
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
              }
