"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const scenes = [
  { folder: "keyboard", frameCount: 120 },
  { folder: "code", frameCount: 186 },
  { folder: "hands-typing", frameCount: 120 },
] as const;

const totalFrames = scenes.reduce((sum, scene) => sum + scene.frameCount, 0);

type CinematicStoryEngineProps = {
  containerId: string;
};

function frameFileName(index: number) {
  return `ezgif-frame-${String(index + 1).padStart(3, "0")}`;
}

export function CinematicStoryEngine({ containerId }: CinematicStoryEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const rafIdRef = useRef<number | null>(null);
  const playheadRef = useRef({ frame: 0 });
  const currentFrameRef = useRef(0);

  const drawFrame = useCallback((frame: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const image = imagesRef.current[frame];
    if (!image || !image.complete) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    const imageWidth = image.naturalWidth || image.width;
    const imageHeight = image.naturalHeight || image.height;
    if (!imageWidth || !imageHeight) {
      return;
    }

    const scale = Math.max(canvas.width / imageWidth, canvas.height / imageHeight);
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    const drawX = (canvas.width - drawWidth) * 0.5;
    const drawY = (canvas.height - drawHeight) * 0.5;

    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  }, []);

  const renderFrame = useCallback(
    (frame: number) => {
      currentFrameRef.current = Math.max(0, Math.min(totalFrames - 1, frame));

      if (rafIdRef.current !== null) {
        return;
      }

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        drawFrame(currentFrameRef.current);
      });
    },
    [drawFrame]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      renderFrame(currentFrameRef.current);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [renderFrame]);

  useEffect(() => {
    let isCancelled = false;
    const preloadedImages: HTMLImageElement[] = [];
    let globalFrameIndex = 0;

    scenes.forEach((scene) => {
      for (let i = 0; i < scene.frameCount; i += 1) {
        const image = new Image();
        const fileBase = frameFileName(i);
        const jpgSource = `/${scene.folder}/${fileBase}.jpg`;

        image.decoding = "async";

        if (globalFrameIndex === 0) {
          image.onload = () => {
            if (isCancelled) {
              return;
            }

            renderFrame(0);
          };
        }

        image.src = jpgSource;
        preloadedImages.push(image);
        globalFrameIndex += 1;
      }
    });

    imagesRef.current = preloadedImages;

    return () => {
      isCancelled = true;
      imagesRef.current = [];
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [renderFrame]);

  useGSAP(
    () => {
      const triggerContainer = document.getElementById(containerId);
      if (!triggerContainer) {
        return;
      }

      gsap.to(playheadRef.current, {
        frame: totalFrames - 1,
        ease: "none",
        snap: "frame",
        scrollTrigger: {
          trigger: triggerContainer,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
        onUpdate: () => {
          renderFrame(Math.round(playheadRef.current.frame));
        },
      });
    },
    { dependencies: [containerId, renderFrame] }
  );

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-0 h-screen w-screen object-cover"
    />
  );
}
