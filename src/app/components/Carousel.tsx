import { useEffect, useState, useRef } from "react";

export const Carousel = ({ imageUrls }: { imageUrls: string[] }) => {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null); // container for pointer events
  const imgRef = useRef<HTMLImageElement | null>(null);

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

  // Pointer (mouse/touch) swipe support on main image container
useEffect(() => {
  const el = mainRef.current;
  if (!el) return;

  let pointerDown = false;
  let startX = 0;
  let lastX = 0;

  const onPointerDown = (e: PointerEvent) => {
    pointerDown = true;
    el.setPointerCapture?.(e.pointerId);
    startX = e.clientX;
    lastX = startX;
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!pointerDown) return;
    lastX = e.clientX;
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!pointerDown) return;
    pointerDown = false;
    el.releasePointerCapture?.(e.pointerId);
    const delta = lastX - startX;
    const threshold = 50;
    if (Math.abs(delta) > threshold) {
      if (delta > 0) prev();
      else next();
    }
  };

  el.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  el.addEventListener("pointercancel", onPointerUp);

  return () => {
    el.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    el.removeEventListener("pointercancel", onPointerUp);
  };
}, [prev, next]);

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
        <div
          ref={mainRef}
          className="w-full h-48 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center select-none touch-pan-y"
        >
          <img
            ref={imgRef}
            src={imageUrls[index]}
            alt={`Part ${index + 1}`}
            className="w-full h-48 object-cover cursor-zoom-in"
            onClick={() => setIsOpen(true)}
            draggable={false} // prevent default drag image on desktop
          />
        </div>

        {/* Prominent Prev/Next Arrows (overlay) */}
        {imageUrls.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 shadow-lg z-10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 shadow-lg z-10"
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
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") goTo(i); }}
              className={`flex-shrink-0 rounded-md overflow-hidden cursor-pointer border ${i === index ? "ring-2 ring-blue-500" : "border-transparent"}`}
              style={{ width: 96, height: 56 }}
            >
              <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" draggable={false} />
            </div>
          ))}
        </div>
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
              <div className="flex gap-2">
                <button onClick={() => setIndex((i) => Math.max(0, i - 1))} className="px-3 py-1 bg-white rounded">Prev</button>
                <button onClick={() => setIndex((i) => Math.min(imageUrls.length - 1, i + 1))} className="px-3 py-1 bg-white rounded">Next</button>
              </div>
              <button onClick={() => setIsOpen(false)} className="px-3 py-1 bg-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
