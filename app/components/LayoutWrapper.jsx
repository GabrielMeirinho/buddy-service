'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // hide header on these routes
  const hideHeaderRoutes = ['/dashboard', '/login', '/profile'];

  return (
    <>
      {!hideHeaderRoutes.includes(pathname) && <Header />}
      {children}
    </>
  );
}
