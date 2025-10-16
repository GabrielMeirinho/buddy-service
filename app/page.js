export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F3F8FF] to-white">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-14 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-medium border border-blue-100 mb-4">
            <span>🤝</span> Connect Clients & Providers
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-blue-900 sm:text-blue-800">
            Book trusted services,
            <span className="block text-blue-600">nearby and at a fair price.</span>
          </h1>

          <p className="mt-4 text-gray-900 sm:text-gray-600 text-lg">
            BuddyService helps clients find verified providers, request jobs, and schedule with ease.
            Providers manage requests, confirm appointments, and grow their customer base.
          </p>

          <div className="mt-6 flex gap-3">
            <a
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 sm:py-2 rounded-lg font-medium text-base sm:text-sm shadow"
            >
              Get Started — it’s free
            </a>
            <a
              href="/dashboard"
              className="border border-blue-200 hover:bg-blue-50 text-blue-900 sm:text-blue-700 px-5 py-3 sm:py-2 rounded-lg font-medium text-base sm:text-sm"
            >
              View Dashboard
            </a>
          </div>

          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-900 sm:text-gray-600">
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span> Secure accounts & verified profiles</li>
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span> Fast bookings & simple scheduling</li>
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span> Free to join — upgrade when you grow</li>
            <li className="flex items-center gap-2"><span className="text-blue-600">✓</span> Works on Web, iPhone & Android (PWA)</li>
          </ul>
        </div>

        {/* Hero preview card */}
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-tr from-blue-100 to-transparent rounded-3xl blur-xl" />
          <div className="relative bg-white border border-blue-100 rounded-3xl shadow-md shadow-blue-50 p-6">
            <div className="flex items-center gap-3 mb-5">
              <img src="/buddy-icon.png" alt="BuddyService" className="h-12 w-12 rounded-full" />
              <div>
                <div className="font-bold text-blue-900 sm:text-blue-800">BuddyService</div>
                <div className="text-xs text-gray-900 sm:text-gray-600">Connecting clients & providers</div>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="border border-blue-100 rounded-xl p-4">
                <div className="text-sm text-gray-900 sm:text-gray-600 mb-1 font-medium">Client</div>
                <div className="font-semibold text-blue-900 sm:text-blue-800">“Need a plumber tomorrow at 9am.”</div>
              </div>
              <div className="border border-blue-100 rounded-xl p-4">
                <div className="text-sm text-gray-900 sm:text-gray-600 mb-1 font-medium">Provider</div>
                <div className="font-semibold text-blue-900 sm:text-blue-800">“Confirmed. See you at 9am.”</div>
              </div>
            </div>

            <a
              href="/login"
              className="mt-6 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-2 rounded-lg font-medium"
            >
              Create your account
            </a>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-10 text-sm text-gray-900 sm:text-gray-600">
        © {new Date().getFullYear()} BuddyService. All rights reserved.
      </footer>
    </main>
  );
}
