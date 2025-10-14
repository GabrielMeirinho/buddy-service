export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h1 className="text-4xl font-bold mb-4">
        🚀 Meu Primeiro App com Next.js e Vercel!
      </h1>
      <p className="text-lg opacity-80 mb-6">
        Aplicativo criado para testar deploy gratuito no Vercel.
      </p>
      <a
        href="https://vercel.com"
        target="_blank"
        className="px-6 py-3 border rounded-lg hover:bg-gray-200 transition"
      >
        Ver Vercel → 
      </a>
    </main>
  );
}