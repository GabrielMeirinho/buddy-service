'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client"); // default role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        router.push("/dashboard");
      }
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) throw new Error("Please fill in all fields.");

      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role },
          },
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            full_name: email.split("@")[0],
            role,
          });
        }
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) throw loginError;
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F3F8FF] to-white flex flex-col items-center justify-center p-6">
      {/* Logo + Brand */}
      <div className="flex flex-col items-center mb-4 text-center">
        <img src="/buddy-icon.png" alt="BuddyService" className="h-14 w-14 rounded-full mb-2" />
        <span className="font-bold text-gray-900 text-2xl sm:text-xl tracking-tight">BuddyService</span>
        <p className="text-gray-700 sm:text-gray-600 text-sm mt-1">
          Connect with nearby service providers you can trust.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white border border-blue-100 rounded-2xl shadow-md shadow-blue-50 p-6 space-y-4">
        <h1 className="text-xl font-bold text-center text-blue-900 sm:text-blue-800">
          {mode === "login" ? "Sign In" : "Create Account"}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-900 sm:text-blue-800 mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded p-2 sm:p-2 text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-900 sm:text-blue-800 mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded p-2 sm:p-2 text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-blue-900 sm:text-blue-800 mb-2">I am signing up as:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-gray-900 sm:text-gray-700">
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={role === "client"}
                    onChange={() => setRole("client")}
                  />
                  Client
                </label>
                <label className="flex items-center gap-2 text-gray-900 sm:text-gray-700">
                  <input
                    type="radio"
                    name="role"
                    value="provider"
                    checked={role === "provider"}
                    onChange={() => setRole("provider")}
                  />
                  Provider
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-sm font-medium py-3 sm:py-2 rounded"
          >
            {loading
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
              ? "Sign In"
              : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-700 sm:text-gray-600">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-blue-700 underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-700 underline"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
