'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client"); // default role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
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
        // SIGN UP
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role }, // store role inside user_metadata
          },
        });
        if (signUpError) throw signUpError;

        // Create profile row immediately
        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            full_name: email.split("@")[0],
            role,
          });
        }
      } else {
        // LOGIN
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
    <main className="min-h-screen bg-gradient-to-b from-[#F3F8FF] to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-blue-100 rounded-2xl shadow-md shadow-blue-50 p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-blue-800">
          {mode === "login" ? "Sign In" : "Create Account"}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-sm mb-2">I am signing up as:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={role === "client"}
                    onChange={() => setRole("client")}
                  />
                  Client
                </label>
                <label className="flex items-center gap-2">
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
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

        <div className="text-center text-sm text-gray-600">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-blue-600 underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 underline"
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
