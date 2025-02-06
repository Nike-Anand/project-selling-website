import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
// import { useThemeStore } from '../lib/store';

export default function Layout() {
  // const { isDarkMode } = useThemeStore();

  // useEffect(() => {
  //   if (isDarkMode) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  // }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gray-50 transition-colors"> {/* Removed dark mode class */}
      <Navbar />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}
