import Image from 'next/image';

interface HomeCarouselProps {
  images: { src: string; alt: string; title: string; description: string }[];
  currentImageIndex: number;
  handlePrev: () => void;
  handleNext: () => void;
}

export const HomeCarousel = ({ images, currentImageIndex, handlePrev, handleNext }: HomeCarouselProps) => (
  <div className="relative w-full h-[400px] md:h-[600px] z-0">
    <Image
      src={images[currentImageIndex].src}
      alt={images[currentImageIndex].alt}
      fill
      style={{ objectFit: 'cover' }}
      className="rounded-none"
      priority
    />
    <div className="absolute inset-0 bg-black bg-opacity-50" />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10 w-full max-w-3xl px-4 md:px-6">
      <h2 className="text-4xl md:text-6xl font-extrabold mb-3 md:mb-6 drop-shadow-lg">
        {images[currentImageIndex].title}
      </h2>
      <p className="text-lg md:text-3xl font-medium drop-shadow-md">
        {images[currentImageIndex].description}
      </p>
    </div>
    <button
      onClick={handlePrev}
      className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-30 text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-opacity-40 hover:scale-110 focus:outline-none hidden md:block"
      aria-label="Previous Image"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button
      onClick={handleNext}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-30 text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-opacity-40 hover:scale-110 focus:outline-none hidden md:block"
      aria-label="Next Image"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
);