'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  mainImage: string
  additionalImages: string[]
  productName: string
}

const ImageGallery = ({ mainImage, additionalImages, productName }: ImageGalleryProps) => {
  const allImages = [mainImage, ...additionalImages]
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-blush">
        <Image
          src={allImages[selectedIndex]}
          alt={`${productName} - view ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-opacity duration-200"
          priority
        />
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {allImages.map((src, index) => (
            <button
              key={src}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-md bg-blush transition-opacity ${
                index === selectedIndex ? 'opacity-100 ring-2 ring-pink' : 'opacity-70 hover:opacity-100'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={src}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
