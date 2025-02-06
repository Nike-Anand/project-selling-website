<<<<<<< HEAD
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 transition-colors">
=======
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
>>>>>>> 3af26f0d75406a4bf246460b95a5193a23c9dba6
      <Navbar />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}
