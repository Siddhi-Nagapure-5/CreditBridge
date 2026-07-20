import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface CinematicConfig {
  frameCount: number;
  baseUrl: string;
  format: string;
  padding: number;
}

const DEFAULT_CONFIG: CinematicConfig = {
  frameCount: 120, // Default 120 frames
  baseUrl: '/frames/frame-',
  format: 'webp',
  padding: 3
};

export const CinematicEngine: React.FC = () => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { scrollYProgress } = useScroll();
  
  // Premium Motion Physics - Heavy and Cinematic
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const frameIndex = useTransform(
    smoothProgress,
    [0, 1],
    [0, DEFAULT_CONFIG.frameCount - 1]
  );

  // Progressive Loading Strategy
  useEffect(() => {
    const loadFrames = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let loadedCount = 0;

      const loadSingleFrame = (index: number): Promise<HTMLImageElement> => {
        return new Promise((resolve) => {
          const img = new Image();
          const num = index.toString().padStart(DEFAULT_CONFIG.padding, '0');
          img.src = `${DEFAULT_CONFIG.baseUrl}${num}.${DEFAULT_CONFIG.format}`;
          
          // FOR DEMO: If resource fails, we generate a colored placeholder
          img.onload = () => resolve(img);
          img.onerror = () => {
            // Internal Demo fallback: generate a gradient canvas as "frame"
            const canvas = document.createElement('canvas');
            canvas.width = 1920; canvas.height = 1080;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              const grad = ctx.createRadialGradient(960, 540, 0, 960, 540, 1000);
              grad.addColorStop(0, '#0A0F1E');
              grad.addColorStop(1, '#020617');
              ctx.fillStyle = grad;
              ctx.fillRect(0, 0, 1920, 1080);
              ctx.fillStyle = '#3B82F6';
              ctx.font = 'bold 80px Sora';
              ctx.textAlign = 'center';
              ctx.fillText(`FINTECH FRAME ${index}`, 960, 540);
            }
            const fallbackImg = new Image();
            fallbackImg.src = canvas.toDataURL();
            fallbackImg.onload = () => resolve(fallbackImg);
          };
        });
      };

      // Stage 1: Fast initial load (First frame)
      const firstFrame = await loadSingleFrame(0);
      loadedImages[0] = firstFrame;
      setImages([...loadedImages]);

      // Stage 2: Fast interaction load (Every 10th frame)
      const keyframeIndices = Array.from({ length: 12 }, (_, i) => i * 10);
      for (const idx of keyframeIndices) {
        if (idx === 0) continue;
        const img = await loadSingleFrame(idx);
        loadedImages[idx] = img;
        setLoadProgress(Math.round((loadedCount++ / 12) * 20));
      }
      setImages([...loadedImages]);

      // Stage 3: High-fidelity load (All remaining)
      const allFrames = [];
      for (let i = 0; i < DEFAULT_CONFIG.frameCount; i++) {
        if (loadedImages[i]) continue;
        allFrames.push(
          loadSingleFrame(i).then(img => {
            loadedImages[i] = img;
            loadedCount++;
            setLoadProgress(20 + Math.round((loadedCount / DEFAULT_CONFIG.frameCount) * 80));
          })
        );
      }
      
      await Promise.all(allFrames);
      setImages([...loadedImages]);
      setIsLoaded(true);
    };

    loadFrames();
  }, []);

  // Rendering Logic
  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      const idx = Math.floor(frameIndex.get());
      const img = images[idx] || images[0];

      if (img) {
        // Handle responsive cover
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgAspect;
          offsetX = 0;
          offsetY = -(drawHeight - canvas.height) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgAspect;
          offsetX = -(drawWidth - canvas.width) / 2;
          offsetY = 0;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
      requestAnimationFrame(render);
    };

    const requestId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(requestId);
  }, [images, frameIndex]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth * window.devicePixelRatio;
        canvasRef.current.height = window.innerHeight * window.devicePixelRatio;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative h-[800vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* The Frame Canvas */}
        <canvas 
          ref={canvasRef}
          className="w-full h-full object-cover"
          style={{ width: '100%', height: '100%' }}
        />
        
        {/* Cinematic Overlays */}
        <div className="film-grain" />
        <div className="radial-vignette opacity-60" />

        {/* Cinematic Loader */}
        {!isLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute inset-0 z-[100] bg-navy-950 flex flex-col items-center justify-center"
          >
            <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden mb-4">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-electric"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">
              Initializing Engine {loadProgress}%
            </span>
            
            {/* Shutter Animation - Camera shutter opening */}
            <motion.div 
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ delay: 2, duration: 1.5, ease: [0.85, 0, 0.15, 1] }}
              className="absolute inset-0 bg-navy-900 z-10 origin-top"
            />
            <motion.div 
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ delay: 2, duration: 1.5, ease: [0.85, 0, 0.15, 1] }}
              className="absolute inset-0 bg-navy-900 z-10 origin-bottom"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};
