"use client"

import React from 'react';

interface ImageDisplayProps {
  imageBase64?: string;
  imageUrl?: string;
  imageName?: string;
  className?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageBase64,
  imageUrl,
  imageName,
  className = ""
}) => {
  if (!imageBase64 && !imageUrl) {
    return (
      <div className={`flex items-center justify-center h-32 bg-gray-100 rounded-lg ${className}`}>
        <span className="text-gray-500 text-sm">No image uploaded</span>
      </div>
    );
  }

  const imageSource = imageBase64 || imageUrl;

  return (
    <div className={`relative ${className}`}>
      <img
        src={imageSource}
        alt={imageName || "Uploaded image"}
        className="w-full h-auto max-h-64 object-contain rounded-lg border border-gray-200"
        onError={(e) => {
          // Fallback for broken images
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.nextElementSibling?.classList.remove('hidden');
        }}
      />
      <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
      {imageName && (
        <p className="text-xs text-gray-500 mt-1 truncate">{imageName}</p>
      )}
    </div>
  );
};

export default ImageDisplay;

