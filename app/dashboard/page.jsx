'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import Link from 'next/link';

export default function Dashboard() {
  const supabase = createClient();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [providers, setProviders] = useState([]);
  const [requestedFor, setRequestedFor] = useState('');
  const [note, setNote] = useState('');
  const [providerId, setProviderId] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session || null));
  }, []);

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile(prof || null);

      // lista pedidos onde sou cliente ou provider
      const { data: reqs } = await supabase
        .from('requests')
        .select('*')
        .or(`client_id.eq.${session.user.id},provider_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false });
      setRequests(reqs || []);

      // lista providers públicos (para cliente escolher)
      const { data: provs } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('role','provider');
      setProviders(provs || []);
    };
    load();
  }, [session]);

  async function logout() {
    await supabase.auth.signOut();
    location.href = '/login';
  }

  async function createRequest(e) {
    e.preventDefault();
    if (!providerId || !requestedFor) return alert('Selecione provider e data/hora');
    const { error } = await supabase.from('requests').insert({
      client_id: session.user.id,
      provider_id: providerId,
      requested_for: new Date(requestedFor).toISOString(),
      note
    });
    if (error) return alert(error.message);
    alert('Pedido enviado!');
    location.reload();
  }

  async function updateStatus(id, status) {
    const { error } = await supabase.from('requests').update({ status }).eq('id', id);
    if (error) return alert(error.message);
    location.reload();
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Você não está logado.</p>
          <Link className="underline" href="/login">Ir para login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Buddy Service — Dashboard</h1>
        <button onClick={logout} className="border rounded px-3 py-1 hover:bg-gray-100">Sair</button>
      </div>

      {profile?.role === 'client' && (
        <div className="border rounded-xl p-4 space-y-3">
          <h2 className="font-semibold">Novo pedido</h2>
          <form onSubmit={createRequest} className="grid gap-3 md:grid-cols-3">
            <select className="border p-2 rounded" value={providerId} onChange={e=>setProviderId(e.target.value)}>
              <option value="">Selecione um prestador</option>
              {providers.map(p => (
                <option key={p.id} value={p.id}>{p.full_name || p.id.slice(0,8)}</option>
              ))}
            </select>
            <input className="border p-2 rounded" type="datetime-local" value={requestedFor} onChange={e=>setRequestedFor(e.target.value)} />
            <input className="border p-2 rounded md:col-span-3" placeholder="Observação (opcional)" value={note} onChange={e=>setNote(e.target.value)} />
            <button className="border rounded p-2 hover:bg-gray-100 md:col-span-3">Enviar pedido</button>
          </form>
        </div>
      )}

      <div className="border rounded-xl p-4">
        <h2 className="font-semibold mb-3">Meus pedidos</h2>
        <div className="space-y-2">
          {requests.map(r => (
            <div key={r.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="text-sm opacity-70">#{r.id}</div>
                <div>Status: <b>{r.status}</b></div>
                <div>Quando: {new Date(r.requested_for).toLocaleString()}</div>
                {r.note && <div>Nota: {r.note}</div>}
              </div>
              {profile?.role === 'provider' && (
                <div className="flex gap-2">
                  <button onClick={()=>updateStatus(r.id,'accepted')} className="border px-2 py-1 rounded hover:bg-gray-100">Aceitar</button>
                  <button onClick={()=>updateStatus(r.id,'rejected')} className="border px-2 py-1 rounded hover:bg-gray-100">Recusar</button>
                  <button onClick={()=>updateStatus(r.id,'done')} className="border px-2 py-1 rounded hover:bg-gray-100">Concluir</button>
                </div>
              )}
            </div>
          ))}
          {requests.length===0 && <p className="opacity-70">Nenhum pedido ainda.</p>}
        </div>
      </div>
    </main>
  );
}
