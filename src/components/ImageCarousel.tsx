import React, {
  useState,
  useEffect,
  useRef,
  TouchEvent,
  useCallback,
} from "react";

interface CarouselProps {
  images: string[];
  autoplay?: boolean;
  interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  autoplay = true,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideInterval = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const nextImage = useCallback(
    () => setCurrentIndex((prev) => (prev + 1) % images.length),
    [images.length]
  );

  const prevImage = useCallback(
    () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length),
    [images.length]
  );

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (
      touchStartX.current !== null &&
      Math.abs(touchStartX.current - touchEndX) > 50
    ) {
      if (touchStartX.current > touchEndX) nextImage();
      else prevImage();
    }
  };

  const handleKeyDown = useCallback(
    (e: { key: string }) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    },
    [nextImage, prevImage]
  );

  // Autoplay logic
  useEffect(() => {
    if (autoplay && !isPaused) {
      slideInterval.current = window.setInterval(nextImage, interval);
    }
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [autoplay, isPaused, interval, nextImage]);

  // Keypress listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Images */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index}`}
            className="w-full object-cover"
          />
        ))}
      </div>

      {/* Dots Indicators */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1 h-1 rounded-full p-1 ${
              index === currentIndex ? "bg-gray-800" : "bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevImage}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1"
      >
        {`<`}
      </button>
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1"
      >
        {`>`}
      </button>
    </div>
  );
};

export default Carousel;
