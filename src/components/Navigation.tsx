'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Code,
  Database,
  Network,
  Brain,
  Users,
  BookOpen,
  FileText
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  path: string;
}

const categories: Category[] = [
  {
    id: 'algorithms',
    name: 'Algorithms & Data Structures',
    icon: <Code className="w-5 h-5" />,
    subcategories: [
      { id: 'arrays', name: 'Arrays & Strings', path: '/algorithms/arrays' },
      { id: 'linked-lists', name: 'Linked Lists', path: '/algorithms/linked-lists' },
      { id: 'trees', name: 'Trees & Graphs', path: '/algorithms/trees' },
      { id: 'dynamic-programming', name: 'Dynamic Programming', path: '/algorithms/dynamic-programming' },
      { id: 'sorting', name: 'Sorting & Searching', path: '/algorithms/sorting' },
    ]
  },
  {
    id: 'system-design',
    name: 'System Design',
    icon: <Network className="w-5 h-5" />,
    subcategories: [
      { id: 'scalability', name: 'Scalability Patterns', path: '/system-design/scalability' },
      { id: 'databases', name: 'Database Design', path: '/system-design/databases' },
      { id: 'caching', name: 'Caching Strategies', path: '/system-design/caching' },
      { id: 'load-balancing', name: 'Load Balancing', path: '/system-design/load-balancing' },
      { id: 'microservices', name: 'Microservices', path: '/system-design/microservices' },
    ]
  },
  {
    id: 'databases',
    name: 'Databases',
    icon: <Database className="w-5 h-5" />,
    subcategories: [
      { id: 'sql', name: 'SQL & Relational', path: '/databases/sql' },
      { id: 'nosql', name: 'NoSQL', path: '/databases/nosql' },
      { id: 'indexing', name: 'Indexing & Optimization', path: '/databases/indexing' },
      { id: 'transactions', name: 'Transactions & ACID', path: '/databases/transactions' },
    ]
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    icon: <Brain className="w-5 h-5" />,
    subcategories: [
      { id: 'operating-systems', name: 'Operating Systems', path: '/computer-science/operating-systems' },
      { id: 'networks', name: 'Computer Networks', path: '/computer-science/networks' },
      { id: 'compilers', name: 'Compilers & Languages', path: '/computer-science/compilers' },
      { id: 'distributed-systems', name: 'Distributed Systems', path: '/computer-science/distributed-systems' },
    ]
  },
  {
    id: 'meta-interview',
    name: 'Meta Interview Prep',
    icon: <Users className="w-5 h-5" />,
    subcategories: [
      { id: 'behavioral', name: 'Behavioral Questions', path: '/meta-interview/behavioral' },
      { id: 'coding', name: 'Coding Questions', path: '/meta-interview/coding' },
      { id: 'system-design', name: 'System Design', path: '/meta-interview/system-design' },
      { id: 'resume', name: 'Resume Tips', path: '/meta-interview/resume' },
    ]
  },
  {
    id: 'quick-notes',
    name: 'Quick Notes',
    icon: <FileText className="w-5 h-5" />,
    subcategories: [
      { id: 'java-tips', name: 'Java Tips & Tricks', path: '/quick-notes/java-tips' },
      { id: 'git-commands', name: 'Git Commands', path: '/quick-notes/git-commands' },
      { id: 'linux-commands', name: 'Linux Commands', path: '/quick-notes/linux-commands' },
      { id: 'regex', name: 'Regular Expressions', path: '/quick-notes/regex' },
    ]
  }
];

export default function Navigation() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['algorithms']);
  const pathname = usePathname();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <nav className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen p-4">
      <div className="space-y-2">
        {/* Home Link */}
        <Link 
          href="/"
          className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
            pathname === '/' 
              ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">Home</span>
        </Link>

        {/* Categories */}
        {categories.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);
          const hasActiveChild = category.subcategories.some(sub => pathname.startsWith(sub.path));
          
          return (
            <div key={category.id} className="space-y-1">
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  hasActiveChild 
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {category.icon}
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {isExpanded && (
                <div className="ml-8 space-y-1">
                  {category.subcategories.map((subcategory) => {
                    const isActive = pathname === subcategory.path;
                    return (
                      <Link
                        key={subcategory.id}
                        href={subcategory.path}
                        className={`block p-2 rounded-lg text-sm transition-all duration-200 ${
                          isActive 
                            ? 'bg-indigo-200 text-indigo-800 font-medium' 
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                      >
                        {subcategory.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm">
          <p className="text-xs text-gray-600">
            Made with 💜 by Arundhati
          </p>
        </div>
      </div>
    </nav>
  );
}
