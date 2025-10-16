'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function Header() {
  const supabase = createClient();
  const [session, setSession] = useState(null);

  // Load session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session);
    });
  }, []);

  // Dynamic link for logo click (dashboard if logged in, home otherwise)
  const logoHref = session ? '/dashboard' : '/';

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <header className="w-full bg-white border-b border-blue-100 shadow-sm shadow-blue-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left - Logo */}
        <Link href={logoHref} className="flex items-center gap-2">
          <img src="/buddy-icon.png" alt="BuddyService" className="h-8 w-8 rounded-full" />
          <span className="font-bold text-blue-800 text-lg tracking-tight">BuddyService</span>
        </Link>

        {/* Right - Buttons */}
        <nav className="flex items-center gap-3">
          {!session && (
            <>
              <Link
                href="/login"
                className="text-sm border px-4 py-2 rounded hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Get Started
              </Link>
            </>
          )}

          {session && (
            <>
              <Link
                href="/dashboard"
                className="text-sm border px-4 py-2 rounded hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
