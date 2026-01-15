'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  filename?: string;
}

export default function CodeBlock({ 
  children, 
  language = 'java', 
  title,
  showLineNumbers = true,
  filename 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const customStyle = {
    ...tomorrow,
    'pre[class*="language-"]': {
      ...tomorrow['pre[class*="language-"]'],
      background: '#f8f9ff',
      borderRadius: '12px',
      border: '1px solid #e9d5ff',
      margin: 0,
      padding: '1rem',
      fontSize: '14px',
      lineHeight: '1.6',
    },
    'code[class*="language-"]': {
      ...tomorrow['code[class*="language-"]'],
      background: 'transparent',
      padding: 0,
      fontSize: '14px',
      lineHeight: '1.6',
    },
  };

  return (
    <div className="my-6">
      {/* Header */}
      {(title || filename) && (
        <div className="flex items-center justify-between bg-gradient-to-r from-lavender-100 to-pink-100 px-4 py-2 rounded-t-xl border border-lavender-200">
          <div className="flex items-center space-x-2">
            {filename && (
              <span className="text-xs font-mono text-warmGray-600 bg-white/60 px-2 py-1 rounded">
                {filename}
              </span>
            )}
            {title && (
              <span className="text-sm font-medium text-warmGray-700">
                {title}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-1 text-warmGray-500 hover:text-lavender-600 transition-colors"
              title="Copy code"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Code */}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={customStyle}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            borderRadius: title || filename ? '0 0 12px 12px' : '12px',
            border: title || filename ? 'none' : '1px solid #e9d5ff',
            borderTop: title || filename ? 'none' : undefined,
          }}
          lineNumberStyle={{
            color: '#a8a29e',
            fontSize: '12px',
            paddingRight: '1rem',
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
