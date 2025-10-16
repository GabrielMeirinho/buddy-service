'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { countries } from '@/data/countries';

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    full_name: '',
    country: '',
    phone_prefix: '',
    phone_number: '',
    postal_code: '',
    city: '',
    address_line: '',
    avatar_url: '', // storage path: <uid>/profile.ext
  });

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(''); // new selection preview
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(''); // signed URL from storage

  // derive UI labels from selected country
  const countryMeta = useMemo(() => {
    const found = countries.find((c) => c.code === form.country);
    return found || { postalLabel: 'Postal Code', prefix: '', flag: '🏳️', name: '' };
  }, [form.country]);

  // helpers
  function onChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function onCountryChange(code) {
    const selected = countries.find((c) => c.code === code);
    setForm((prev) => ({
      ...prev,
      country: code,
      phone_prefix: selected?.prefix || '',
    }));
  }

  function triggerFilePicker() {
    fileInputRef.current?.click();
  }

  function onFileChange(e) {
    setError('');
    const f = e.target.files?.[0];
    if (!f) return;

    // Validate type
    const allowed = ['image/jpeg', 'image/png'];
    if (!allowed.includes(f.type)) {
      setError('Please upload a JPG or PNG image.');
      return;
    }
    // Validate size (<= 5MB)
    const maxBytes = 5 * 1024 * 1024;
    if (f.size > maxBytes) {
      setError('Image must be 5MB or smaller.');
      return;
    }

    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  }

  async function signAvatar(path) {
    if (!path) return '';
    const { data, error } = await supabase.storage
      .from('avatars')
      .createSignedUrl(path, 3600); // 1 hour
    if (error) {
      console.warn('Signed URL error:', error.message);
      return '';
    }
    return data?.signedUrl ?? '';
  }

  async function uploadAvatarIfNeeded(userId) {
    if (!file) return form.avatar_url || ''; // keep existing path
    const ext = file.type === 'image/png' ? 'png' : 'jpg';
    const path = `${userId}/profile.${ext}`;

    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: '3600',
      });

    if (upErr) throw upErr;
    return path;
  }

  // load session + profile + current avatar signed URL
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const sess = data?.session;
      if (!sess) {
        router.push('/login');
        return;
      }
      setSession(sess);

      const { data: prof, error: profErr } = await supabase
        .from('profiles')
        .select(
          'full_name, country, phone_prefix, phone_number, postal_code, city, address_line, avatar_url'
        )
        .eq('id', sess.user.id)
        .single();

      if (profErr && profErr.code !== 'PGRST116') {
        setError(profErr.message);
      }

      if (prof) {
        setForm({
          full_name: prof.full_name || '',
          country: prof.country || '',
          phone_prefix: prof.phone_prefix || '',
          phone_number: prof.phone_number || '',
          postal_code: prof.postal_code || '',
          city: prof.city || '',
          address_line: prof.address_line || '',
          avatar_url: prof.avatar_url || '',
        });

        // if avatar exists, load signed URL
        if (prof.avatar_url) {
          const signed = await signAvatar(prof.avatar_url);
          setCurrentAvatarUrl(signed);
        } else {
          setCurrentAvatarUrl('');
        }
      } else {
        // still allow editing empty form
        setCurrentAvatarUrl('');
      }

      setLoading(false);
    };

    load();
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (!form.full_name) throw new Error('Please enter your full name.');
      if (!form.country) throw new Error('Please select your country.');
      if (!form.phone_number) throw new Error('Please enter your phone number.');

      const uid = session.user.id;

      // upload avatar (if any) and get storage path
      const avatarPath = await uploadAvatarIfNeeded(uid);

      // update profile data
      const { error: upErr } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name,
          country: form.country,
          phone_prefix: form.phone_prefix,
          phone_number: form.phone_number,
          postal_code: form.postal_code,
          city: form.city,
          address_line: form.address_line,
          avatar_url: avatarPath,
        })
        .eq('id', uid);

      if (upErr) throw upErr;

      setSuccess('Profile updated!');
      setTimeout(() => router.push('/dashboard?profile=updated'), 350);
    } catch (err) {
      setError(err.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-6">Loading profile…</div>;
  }

  // choose which image to show:
  // 1) live preview if user selected a new file
  // 2) current avatar from storage (signed)
  // 3) fallback initials from ui-avatars
  const avatarToShow =
    previewUrl ||
    currentAvatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      form.full_name || 'User'
    )}&background=random`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F3F8FF] to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Edit Profile</h1>
          <Link href="/dashboard" className="underline">← Back to Dashboard</Link>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl shadow-md shadow-blue-50 p-6">
          {/* Alerts */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded">
              {success}
            </div>
          )}

          {/* Avatar + Camera overlay (WhatsApp style) */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative inline-block">
              <img
                src={avatarToShow}
                alt="avatar"
                className="w-24 h-24 rounded-full border border-blue-200 object-cover shadow-sm"
              />
              <button
                type="button"
                onClick={triggerFilePicker}
                className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full border border-blue-200 bg-white shadow flex items-center justify-center hover:bg-blue-50"
                title="Upload image"
              >
                {/* camera icon (svg) */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" d="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                  <path strokeWidth="2" d="M4 8h3l2-3h6l2 3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={onFileChange}
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-600">
                PNG or JPG, up to 5MB. Use a clear photo for security and trust.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm mb-1">Full name</label>
              <input
                className="w-full border rounded p-2"
                placeholder="John Doe"
                value={form.full_name}
                onChange={(e) => onChange('full_name', e.target.value)}
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm mb-1">Country</label>
              <select
                className="w-full border rounded p-2"
                value={form.country}
                onChange={(e) => onCountryChange(e.target.value)}
              >
                <option value="">Select your country…</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.prefix})
                  </option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm mb-1">Phone</label>
              <div className="flex gap-2">
                <input
                  className="w-28 border rounded p-2 text-center"
                  placeholder="+00"
                  value={form.phone_prefix}
                  onChange={(e) => onChange('phone_prefix', e.target.value)}
                  readOnly={!!form.country}
                />
                <input
                  className="flex-1 border rounded p-2"
                  placeholder="e.g. 7700 900123"
                  value={form.phone_number}
                  onChange={(e) => onChange('phone_number', e.target.value)}
                />
              </div>
              <p className="text-xs opacity-70 mt-1">
                Prefix auto-fills based on country. You can still edit it if needed.
              </p>
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm mb-1">{countryMeta.postalLabel}</label>
              <input
                className="w-full border rounded p-2"
                placeholder={countryMeta.postalLabel}
                value={form.postal_code}
                onChange={(e) => onChange('postal_code', e.target.value)}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm mb-1">City</label>
              <input
                className="w-full border rounded p-2"
                placeholder="City"
                value={form.city}
                onChange={(e) => onChange('city', e.target.value)}
              />
            </div>

            {/* Address Line */}
            <div>
              <label className="block text-sm mb-1">Address line</label>
              <input
                className="w-full border rounded p-2"
                placeholder="Street, number, complement"
                value={form.address_line}
                onChange={(e) => onChange('address_line', e.target.value)}
              />
            </div>

            <button
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              {saving ? 'Saving…' : 'Save profile'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
