'use client';

import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-lavender-50 to-pink-50 border-b border-lavender-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center h-16">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-center w-10 h-10 bg-lavender-600 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-warmGray-800">
              Ari&apos;s Study Room
            </h1>
          </Link>
        </div>
      </div>
    </header>
  );
}
