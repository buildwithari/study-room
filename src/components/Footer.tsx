import Link from 'next/link';
import { Github, Heart, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto relative z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center">
          {/* Social Media Icons */}
          <div className="flex justify-center items-center space-x-4 mb-4">
            <Link 
              href="https://github.com/buildwithari" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 hover:scale-110 relative group"
              title="GitHub Profile"
            >
              <Github className="w-5 h-5" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                GitHub Profile
              </span>
            </Link>
            <Link 
              href="https://buildwithari.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 hover:scale-110 relative group"
              title="Portfolio"
            >
              <Heart className="w-5 h-5" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                Portfolio
              </span>
            </Link>
            <Link 
              href="https://www.linkedin.com/in/abandopadhyaya/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 hover:scale-110 relative group"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                LinkedIn Profile
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
