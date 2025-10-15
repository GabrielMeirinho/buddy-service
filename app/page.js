export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h1 className="text-4xl font-bold mb-4">🚀 Buddy Service</h1>
      <p className="text-lg opacity-80 mb-6">Conecte clientes e prestadores. Faça pedidos. Agende serviços.</p>
      <a href="/login" className="px-6 py-3 border rounded-lg hover:bg-gray-200 transition">
        Entrar / Criar conta →
      </a>
    </main>
  );
}