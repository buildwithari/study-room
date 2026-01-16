'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 bg-white border border-warmGray-200 hover:border-red-300 hover:bg-red-50 text-warmGray-600 hover:text-red-600 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-soft"
    >
      <LogOut className="w-5 h-5" />
      <span>Logout</span>
    </button>
  );
}
