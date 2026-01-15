'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface LightboxProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export default function Lightbox({ src, alt, caption, className = '' }: LightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  return (
    <>
      {/* Thumbnail */}
      <div className={`inline-block cursor-pointer group ${className}`} onClick={() => setIsOpen(true)}>
        <div className="relative overflow-hidden rounded-xl border border-lavender-200 w-full h-auto">
          <Image
            src={src}
            alt={alt}
            width={800}
            height={600}
            className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
        {caption && (
          <p className="text-sm text-warmGray-600 mt-2 text-center">{caption}</p>
        )}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                handleReset();
              }}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Controls */}
            <div className="absolute top-4 left-4 z-10 flex space-x-2">
              <button
                onClick={handleZoomIn}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleRotate}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                title="Rotate"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>

            {/* Image */}
            <div className="relative max-w-full max-h-full overflow-auto">
              <Image
                src={src}
                alt={alt}
                width={1920}
                height={1080}
                className="max-w-none transition-transform duration-300"
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                }}
                unoptimized
              />
            </div>

            {/* Caption */}
            {caption && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                <p className="text-white text-center bg-black/50 px-4 py-2 rounded-lg">
                  {caption}
                </p>
              </div>
            )}

            {/* Scale Indicator */}
            <div className="absolute bottom-4 right-4 z-10">
              <p className="text-white text-sm bg-black/50 px-3 py-1 rounded-lg">
                {Math.round(scale * 100)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}