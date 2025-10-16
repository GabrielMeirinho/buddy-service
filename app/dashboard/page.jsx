'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';

export default function Dashboard() {
  const supabase = createClient();

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);

  // utils
  function formatPhone(prefix, number) {
    const p = (prefix || '').toString().trim();
    const n = (number || '').toString().trim();
    if (!p && !n) return '';
    return `${p ? p : ''}${p && n ? ' ' : ''}${n}`;
  }

  async function signAvatar(path) {
    if (!path) return null;
    const { data, error } = await supabase.storage
      .from('avatars')
      .createSignedUrl(path, 3600); // 1h
    if (error) {
      console.warn('Signed URL error:', error.message);
      return null;
    }
    return data?.signedUrl ?? null;
  }

  useEffect(() => {
    const load = async () => {
      // 1) session
      const { data: s } = await supabase.auth.getSession();
      const sess = s?.session;
      if (!sess) {
        window.location.href = '/login';
        return;
      }
      setSession(sess);

      // 2) try to fetch profile row
      const { data: prof, error: profErr } = await supabase
        .from('profiles')
        .select(
          'full_name, role, phone_prefix, phone_number, country, city, avatar_url'
        )
        .eq('id', sess.user.id)
        .single();

      let finalProfile = prof;

      // 3) if not found, create automatically (detect role from user_metadata)
      if (profErr && profErr.code === 'PGRST116') {
        const detectedRole =
          (sess.user.user_metadata && sess.user.user_metadata.role) || 'client';

        const defaultName =
          sess.user.user_metadata?.full_name ||
          (sess.user.email ? sess.user.email.split('@')[0] : 'User');

        const { error: insertErr } = await supabase.from('profiles').insert({
          id: sess.user.id,
          full_name: defaultName,
          role: detectedRole,
        });

        if (insertErr) {
          console.error('Auto-create profile error:', insertErr.message);
        } else {
          const { data: newProf } = await supabase
            .from('profiles')
            .select(
              'full_name, role, phone_prefix, phone_number, country, city, avatar_url'
            )
            .eq('id', sess.user.id)
            .single();
          finalProfile = newProf || null;
        }
      }

      setProfile(finalProfile);

      // 4) avatar
      if (finalProfile?.avatar_url) {
        const signed = await signAvatar(finalProfile.avatar_url);
        if (signed) setAvatarUrl(signed);
      } else {
        const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          finalProfile?.full_name || 'User'
        )}&background=random`;
        setAvatarUrl(fallback);
      }

      setLoading(false);
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  if (loading) return <div className="p-6">Loading dashboard…</div>;
  if (!profile)
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#F3F8FF] to-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-red-100 text-red-700 rounded-xl p-4">
            Could not load your profile. Please try again or contact support.
          </div>
        </div>
      </main>
    );

  const badgeStyle =
    profile?.role === 'provider'
      ? 'bg-green-100 text-green-700'
      : 'bg-blue-100 text-blue-700';

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F3F8FF] to-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white shadow-md shadow-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-5">
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-16 h-16 rounded-full border border-blue-200 object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold truncate">{profile.full_name}</h2>
              <span className={`text-xs px-2 py-1 rounded-full ${badgeStyle}`}>
                {profile.role === 'provider' ? 'PROVIDER' : 'CLIENT'}
              </span>
            </div>
            <p className="text-sm opacity-80 truncate">
              {formatPhone(profile.phone_prefix, profile.phone_number)}
              {profile.city || profile.country ? ' • ' : ''}
              {[profile.city, profile.country].filter(Boolean).join(', ')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="text-sm border px-4 py-2 rounded hover:bg-gray-50"
            >
              Edit profile
            </Link>
            <button
              onClick={logout}
              className="text-sm border px-4 py-2 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content Placeholder */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-2">Welcome to your dashboard 👋</h3>
          <p className="text-sm opacity-80">
            Here we will display your orders, services, requests and more.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href="/profile"
              className="inline-block border rounded px-3 py-2 hover:bg-gray-50 text-sm"
            >
              Complete your profile →
            </Link>
            <Link
              href="/"
              className="inline-block border rounded px-3 py-2 hover:bg-gray-50 text-sm"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
