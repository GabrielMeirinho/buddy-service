import './globals.css';
import Header from './components/Header';

export const metadata = {
  title: 'BuddyService',
  description: 'Connect clients and service providers with ease.',
  icons: {
    icon: '/favicon.png', // make sure /public/favicon.png exists
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />{/* GLOBAL HEADER */}
        {children}
      </body>
    </html>
  );
}