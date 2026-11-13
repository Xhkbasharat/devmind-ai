
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, Eye, EyeOff, Lock, Mail } from "lucide-react";
import authService from "../services/auth";
import { useAuthStore } from "../store/authStore";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { getErrorMessage } from "../services/error";

export default function LoginPage() {
  useDocumentTitle("Login");

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your username or email and password.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.login({
        username: email.trim(),
        password,
      });

      const user = await authService.getCurrentUser();
      setUser(user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to sign in."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b16] px-5 py-12 text-white">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-9 flex items-center justify-center gap-3">
          <div className="rounded-xl bg-violet-600 p-3">
            <BrainCircuit size={28} />
          </div>
          <span className="text-2xl font-bold">DevMind AI</span>
        </Link>

        <section className="rounded-2xl border border-slate-800 bg-[#101626] p-7 shadow-2xl sm:p-9">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="mt-3 text-sm text-slate-400">
              Sign in to continue to your developer workspace.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Username or email
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#080b16] px-4 focus-within:border-violet-500">
                <Mail size={18} className="text-slate-500" />
                <input
                  id="login-email"
                  type="text"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your username or email"
                  className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#080b16] px-4 focus-within:border-violet-500">
                <Lock size={18} className="text-slate-500" />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-600"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-violet-400 hover:text-violet-300"
            >
              Create account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
