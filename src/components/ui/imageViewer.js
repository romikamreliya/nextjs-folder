"use client";

import { useEffect, useRef, useState } from "react";
import { Modal, useOverlayState } from "@heroui/react";
import { AltArrowLeft, AltArrowRight, Close } from "@/components/icon/icons";

export default function ImageViewer({ images = [], startIndex = 0, onClose }) {
    const [current, setCurrent] = useState(startIndex);
    const touchStartX = useRef(null);

    const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
    const next = () => setCurrent((c) => (c + 1) % images.length);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrent(startIndex);
    }, [startIndex]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowLeft") prev();
            else if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images.length]);

    const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
        touchStartX.current = null;
    };

    const modalState = useOverlayState({
        defaultOpen: true,
        onOpenChange: (isOpen) => {
            if (!isOpen) {
                onClose?.();
            }
        },
    });

    if (!images.length) return null;

    const img = images[current];

    return (
        <Modal state={modalState}>
            <Modal.Backdrop className="backdrop-blur-md bg-black/90">
                <Modal.Container className="w-screen h-screen max-w-none m-0 p-0 flex items-center justify-center">
                    <Modal.Dialog className="w-full h-full max-w-none bg-transparent shadow-none border-none flex flex-col items-center justify-center relative p-0 m-0 outline-none select-none">

                        {/* Close Button - Glassmorphism circular style */}
                        <button
                            onClick={() => modalState.close()}
                            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/25 rounded-full p-2.5 shadow-md transition-all duration-200 backdrop-blur-md active:scale-95 cursor-pointer z-50"
                            title="Close"
                        >
                            <Close className="w-6 h-6" />
                        </button>

                        {/* Counter Pill Badge */}
                        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/10 border border-white/10 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md shadow-sm z-50">
                            {current + 1} / {images.length}
                        </div>

                        {/* Prev arrow - Floating Glass circular button */}
                        {images.length > 1 && (
                            <button
                                onClick={prev}
                                className="absolute left-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full w-12 h-12 flex items-center justify-center shadow-lg backdrop-blur-md transition-all duration-200 active:scale-95 cursor-pointer z-50 max-sm:left-3"
                                title="Previous"
                            >
                                <AltArrowLeft className="w-6 h-6" />
                            </button>
                        )}

                        {/* Main Content Area */}
                        <div
                            className="flex items-center justify-center w-full h-full px-20 py-24 max-sm:px-6"
                            onTouchStart={onTouchStart}
                            onTouchEnd={onTouchEnd}
                        >
                            {img.mediaType === "VIDEO" ? (
                                <video
                                    key={img.url}
                                    src={img.url}
                                    controls
                                    className="max-h-full max-w-full rounded-2xl shadow-2xl object-contain border border-white/15 animate-fade-in"
                                />
                            ) : img.mediaType === "DOCUMENT" ? (
                                <div className="flex flex-col items-center gap-4 text-white">
                                    <svg className="w-20 h-20 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                    <p className="text-sm font-medium">{img.fileName}</p>
                                    <a
                                        href={img.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors"
                                    >
                                        Open PDF
                                    </a>
                                </div>
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    key={img.url}
                                    src={img.url}
                                    alt={img.fileName || `Media ${current + 1}`}
                                    className="max-h-full max-w-full rounded-2xl shadow-2xl object-contain select-none border border-white/15 animate-fade-in"
                                    draggable={false}
                                />
                            )}
                        </div>

                        {/* Next arrow - Floating Glass circular button */}
                        {images.length > 1 && (
                            <button
                                onClick={next}
                                className="absolute right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full w-12 h-12 flex items-center justify-center shadow-lg backdrop-blur-md transition-all duration-200 active:scale-95 cursor-pointer z-50 max-sm:right-3"
                                title="Next"
                            >
                                <AltArrowRight className="w-6 h-6" />
                            </button>
                        )}

                        {/* Bottom Miniature Thumbnail Strip */}
                        {images.length > 1 && (
                            <div className="absolute bottom-6 flex items-center gap-2.5 px-4 py-2 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md shadow-lg max-w-[90%] overflow-x-auto no-scrollbar z-50">
                                {images.map((media, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrent(i)}
                                        className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 cursor-pointer ${
                                            i === current
                                              ? "border-white scale-105 shadow-md shadow-white/10"
                                              : "border-transparent opacity-40 hover:opacity-85 hover:scale-102"
                                        }`}
                                    >
                                        {media.mediaType === "VIDEO" ? (
                                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        ) : media.mediaType === "DOCUMENT" ? (
                                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                </svg>
                                            </div>
                                        ) : (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={media.url} alt="" className="w-full h-full object-cover" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
