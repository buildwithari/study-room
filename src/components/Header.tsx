'use client';

import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-center h-20 pt-4">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity group">
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-lavender-400 via-pink-400 to-orange-400 rounded-3xl shadow-cozy group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <BookOpen className="w-9 h-9 text-white drop-shadow-lg" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-md group-hover:scale-125 transition-transform duration-300">
                <span className="text-xs font-bold text-white">✨</span>
              </div>
              <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full flex items-center justify-center shadow-md group-hover:scale-125 transition-transform duration-300">
                <span className="text-xs font-bold text-white">💫</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-warmGray-800 via-lavender-600 to-pink-500 bg-clip-text text-transparent group-hover:from-lavender-600 group-hover:via-pink-500 group-hover:to-orange-400 transition-all duration-500 group-hover:scale-105">
                Ari&apos;s Study Room
              </h1>
              <p className="text-sm text-warmGray-500 font-semibold tracking-wide group-hover:text-lavender-600 transition-colors group-hover:scale-105">
                CS Notes & Interview Prep
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
