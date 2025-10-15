'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // para sign up
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        // cria o profile (id = user.id)
        const user = data.user;
        if (user) {
          await supabase.from('profiles').insert({
            id: user.id,
            full_name: email.split('@')[0],
            role
          });
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
      router.push('/dashboard');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Buddy Service — {mode === 'signup' ? 'Criar conta' : 'Entrar'}</h1>

        {mode === 'signup' && (
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input type="radio" name="role" value="client" checked={role==='client'} onChange={()=>setRole('client')} />
              Cliente
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="role" value="provider" checked={role==='provider'} onChange={()=>setRole('provider')} />
              Prestador
            </label>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full border p-2 rounded" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border p-2 rounded" type="password" placeholder="senha" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading} className="w-full border p-2 rounded hover:bg-gray-100">
            {loading ? 'Processando...' : (mode === 'signup' ? 'Criar conta' : 'Entrar')}
          </button>
        </form>

        <button className="text-sm opacity-80 underline" onClick={()=>setMode(mode==='signup'?'signin':'signup')}>
          {mode==='signup' ? 'Já tenho conta → Entrar' : 'Não tenho conta → Criar'}
        </button>
      </div>
    </main>
  );
}
