export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F3F8FF] to-white">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <img src="/buddy-icon.png" alt="BuddyService" className="h-10 w-10 rounded-full" />
          <span className="font-bold text-lg text-blue-800 tracking-tight">BuddyService</span>
        </div>
        <nav className="flex items-center gap-3">
          <a href="/login" className="text-sm border px-4 py-2 rounded hover:bg-gray-50">Sign in</a>
          <a href="/login" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Get Started</a>
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-14 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100 mb-4">
            <span>🤝</span> Connect Clients & Providers
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-blue-900">
            Book trusted services, <span className="text-blue-600">anytime</span>, anywhere.
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Buddy Service helps clients find verified providers, request jobs, and schedule with ease.
            Providers manage requests, confirm appointments, and grow their customer base.
          </p>

          <div className="mt-6 flex gap-3">
            <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium">
              Get Started — it’s free
            </a>
            <a href="/dashboard" className="border px-5 py-3 rounded-lg hover:bg-gray-50 font-medium">
              View Dashboard
            </a>
          </div>

          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span> Secure accounts & verified profiles</li>
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span> Fast bookings & simple scheduling</li>
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span> Free to join — upgrade when you grow</li>
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span> Works on Web, iPhone & Android (PWA)</li>
          </ul>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-tr from-blue-100 to-transparent rounded-3xl blur-xl" />
          <div className="relative bg-white border border-blue-100 rounded-3xl shadow-md shadow-blue-50 p-6">
            <div className="flex items-center gap-3 mb-5">
              <img src="/buddy-icon.png" alt="BuddyService" className="h-10 w-10 rounded-full" />
              <div>
                <div className="font-bold text-blue-900">BuddyService</div>
                <div className="text-xs text-gray-600">Connecting clients & providers</div>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="border rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Client</div>
                <div className="font-semibold">“Need a plumber tomorrow at 9am.”</div>
              </div>
              <div className="border rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Provider</div>
                <div className="font-semibold">“Confirmed. See you at 9am.”</div>
              </div>
            </div>

            <a href="/login" className="mt-6 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">
              Create your account
            </a>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-10 text-sm text-gray-500">
        © {new Date().getFullYear()} BuddyService. All rights reserved.
      </footer>
    </main>
  );
}
