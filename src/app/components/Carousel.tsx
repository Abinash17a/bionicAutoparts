
import { useEffect,useState,useRef } from "react";


export const Carousel = ({ imageUrls }: { imageUrls: string[] }) => {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLImageElement | null>(null);

  const prev = () => setIndex((i) => (i - 1 + imageUrls.length) % imageUrls.length);
  const next = () => setIndex((i) => (i + 1) % imageUrls.length);
  const goTo = (i: number) => setIndex(Math.max(0, Math.min(i, imageUrls.length - 1)));

  // Ensure selected thumbnail is visible
  useEffect(() => {
    const container = thumbRef.current;
    if (!container) return;
    const selected = container.querySelector<HTMLDivElement>(`div[data-thumb-index='${index}']`);
    if (selected) {
      const selLeft = selected.offsetLeft;
      const selRight = selLeft + selected.offsetWidth;
      const viewLeft = container.scrollLeft;
      const viewRight = viewLeft + container.clientWidth;
      if (selLeft < viewLeft) container.scrollTo({ left: selLeft - 8, behavior: "smooth" });
      else if (selRight > viewRight) container.scrollTo({ left: selRight - container.clientWidth + 8, behavior: "smooth" });
    }
  }, [index]);

useEffect(() => {
  const el = mainRef.current;
  if (!el) return;
  let startX = 0, endX = 0;

  const onStart = (e: TouchEvent) => {
    startX = e.touches[0].clientX;
  };
  const onMove = (e: TouchEvent) => {
    endX = e.touches[0].clientX;
  };
  const onEnd = () => {
    const delta = endX - startX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        prev();
      } else {
        next();
      }
    }
    startX = 0;
    endX = 0;
  };

  el.addEventListener("touchstart", onStart);
  el.addEventListener("touchmove", onMove);
  el.addEventListener("touchend", onEnd);

  return () => {
    el.removeEventListener("touchstart", onStart);
    el.removeEventListener("touchmove", onMove);
    el.removeEventListener("touchend", onEnd);
  };
}, [imageUrls.length]);


  // Keyboard navigation
useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, imageUrls.length]);

  return (
    <div className="mt-3">
      {/* Main image */}
      <div className="relative w-full">
        <div className="w-full h-48 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
          <img
            ref={mainRef}
            src={imageUrls[index]}
            alt={`Part ${index + 1}`}
            className="w-full h-48 object-cover cursor-zoom-in"
            onClick={() => setIsOpen(true)}
          />
        </div>

        {/* Prominent Prev/Next Arrows (overlay) */}
        {imageUrls.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 shadow-lg"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 shadow-lg"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="mt-2 flex items-center gap-2">
        <div
          ref={thumbRef}
          className="flex gap-2 overflow-x-auto py-1 px-1 scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          {imageUrls.map((src, i) => (
            <div
              key={i}
              data-thumb-index={i}
              onClick={() => goTo(i)}
              className={`flex-shrink-0 rounded-md overflow-hidden cursor-pointer border ${i === index ? "ring-2 ring-blue-500" : "border-transparent"}`}
              style={{ width: 96, height: 56 }}
            >
              <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* View full button */}
        {/* <div className="ml-auto">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-sm text-gray-600 underline"
          >
            View full
          </button>
        </div> */}
      </div>

      {/* Lightbox / full-screen modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-4xl w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <img src={imageUrls[index]} alt={`Full ${index + 1}`} className="w-full h-auto max-h-[80vh] object-contain" />
            <div className="mt-2 flex items-center justify-between">
              {/* <div className="flex gap-2">
                <button onClick={() => setIndex((i) => Math.max(0, i - 1))} className="px-3 py-1 bg-white rounded">Prev</button>
                <button onClick={() => setIndex((i) => Math.min(imageUrls.length - 1, i + 1))} className="px-3 py-1 bg-white rounded">Next</button>
              </div> */}
              <button onClick={() => setIsOpen(false)} className="px-3 py-1 bg-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
