'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import Link from 'next/link';

export default function Dashboard() {
  const supabase = createClient();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadSignedAvatar(path) {
    if (!path) return null;
    const { data } = await supabase.storage
      .from('avatars')
      .createSignedUrl(path, 3600);
    return data?.signedUrl || null;
  }

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const sess = data?.session;
      if (!sess) {
        window.location.href = '/login';
        return;
      }
      setSession(sess);

      const { data: prof } = await supabase
        .from('profiles')
        .select('full_name, role, phone_prefix, phone_number, country, city, avatar_url')
        .eq('id', sess.user.id)
        .single();

      setProfile(prof);

      if (prof?.avatar_url) {
        const signed = await loadSignedAvatar(prof.avatar_url);
        setAvatarUrl(signed);
      } else {
        const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          prof?.full_name || 'User'
        )}&background=random`;
        setAvatarUrl(fallback);
      }

      setLoading(false);
    };

    load();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  if (loading) return <div className="p-6 text-blue-900">Loading dashboard…</div>;
  if (!profile) return null;

  const badgeStyle =
    profile.role === 'provider'
      ? 'bg-green-100 text-green-800'
      : 'bg-blue-100 text-blue-800';

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F3F8FF] to-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Responsive Profile Card */}
        <div className="bg-white shadow-md shadow-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-5">
          
          {/* Avatar */}
          <div className="flex justify-center sm:block">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-20 h-20 sm:w-16 sm:h-16 rounded-full border border-blue-200 object-cover shadow-sm"
            />
          </div>

          {/* Name, Role, Phone Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <h2 className="text-xl font-bold text-blue-900 sm:text-blue-700 break-words">
                {profile.full_name}
              </h2>
              <span className={`mt-2 sm:mt-0 mx-auto sm:mx-0 text-xs px-2 py-1 rounded-full ${badgeStyle}`}>
                {profile.role === 'provider' ? 'PROVIDER' : 'CLIENT'}
              </span>
            </div>
            <p className="text-sm text-gray-900 sm:text-gray-600 mt-2 break-words">
              {profile.phone_prefix} {profile.phone_number}<br className="sm:hidden" /> {profile.city}, {profile.country}
            </p>
          </div>

          {/* Buttons */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0">
            <Link
              href="/profile"
              className="w-full sm:w-auto text-blue-900 sm:text-blue-700 border border-blue-200 hover:bg-blue-50 px-4 py-3 sm:py-2 rounded-md text-sm font-medium text-center"
            >
              Edit profile
            </Link>
            <button
              onClick={logout}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:py-2 rounded-md text-sm font-medium text-center shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content Placeholder */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 sm:text-blue-700 mb-2">
            Welcome to your dashboard 👋
          </h3>
          <p className="text-sm text-gray-900 sm:text-gray-600">
            Here we will display your orders, services, requests and more.
          </p>
          <Link
            href="/profile"
            className="text-blue-900 sm:text-blue-700 underline mt-4 inline-block font-medium"
          >
            Complete your profile →
          </Link>
        </div>

      </div>
    </main>
  );
}
