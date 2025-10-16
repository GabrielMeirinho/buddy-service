'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function Header() {
  const supabase = createClient();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session);
    });
  }, []);

  const logoHref = session ? '/dashboard' : '/';

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <header className="w-full bg-white border-b border-blue-100 shadow-sm shadow-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href={logoHref} className="flex items-center gap-2">
          <img src="/buddy-icon.png" alt="BuddyService" className="h-8 w-8 sm:h-7 sm:w-7 rounded-full" />
          <span className="font-bold text-blue-900 sm:text-blue-700 text-base sm:text-sm tracking-tight">
            BuddyService
          </span>
        </Link>

        {/* Navigation Buttons */}
        <nav className="flex items-center gap-2 sm:gap-2.5">
          {!session && (
            <>
              <Link
                href="/login"
                className="text-blue-900 sm:text-blue-700 text-base sm:text-sm font-medium border border-blue-200 hover:bg-blue-50 px-4 py-2.5 sm:px-3 sm:py-2 rounded-md"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-sm font-medium px-4 py-2.5 sm:px-3 sm:py-2 rounded-md shadow-sm"
              >
                Get Started
              </Link>
            </>
          )}

          {session && (
            <>
              <Link
                href="/dashboard"
                className="text-blue-900 sm:text-blue-700 text-base sm:text-sm font-medium border border-blue-200 hover:bg-blue-50 px-4 py-2.5 sm:px-3 sm:py-2 rounded-md"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-sm font-medium px-4 py-2.5 sm:px-3 sm:py-2 rounded-md shadow-sm"
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
