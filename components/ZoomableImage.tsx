"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ZoomableImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  containerClassName?: string;
  imageClassName?: string;
};

export default function ZoomableImage({
  src,
  alt,
  sizes = "100vw",
  containerClassName = "",
  imageClassName = "object-cover",
}: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`group relative block h-full w-full cursor-zoom-in ${containerClassName}`}
        aria-label={`Zoom image: ${alt}`}
      >
        <Image src={src} alt={alt} fill className={imageClassName} sizes={sizes} />
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white opacity-95 sm:text-xs">
          Tap to zoom
        </span>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/88 px-3 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Expanded image view: ${alt}`}
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            className="relative h-[min(88vh,980px)] w-[min(96vw,1600px)] cursor-zoom-out"
            onClick={() => setIsOpen(false)}
            aria-label="Close zoomed image"
          >
            <Image src={src} alt={alt} fill className="object-contain" sizes="100vw" priority />
          </button>

          <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-medium tracking-wide text-white/95">
            Tap image to close
          </p>
        </div>
      ) : null}
    </>
  );
}
