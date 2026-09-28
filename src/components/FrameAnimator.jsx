import { useRef, useEffect, useState, useCallback } from 'react';
import './FrameAnimator.css';

const FrameAnimator = ({ autoPlay = true, scrollDriven = false }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const imagesRef = useRef([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  
  const totalFrames = 50;

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const images = [];

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      // Generate frame paths: /image/ezgif-frame-001.jpg
      img.src = `/image/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;
      
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) {
          setIsLoaded(true);
        }
      };
      images.push(img);
    }
    
    imagesRef.current = images;
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const image = imagesRef.current[frameIndex];
    
    if (image && image.complete) {
      // Setup canvas dimensions
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate aspect ratio fit
      const hRatio = canvas.width / image.width;
      const vRatio = canvas.height / image.height;
      const ratio = Math.min(hRatio, vRatio);
      
      const centerShift_x = (canvas.width - image.width * ratio) / 2;
      const centerShift_y = (canvas.height - image.height * ratio) / 2;
      
      ctx.drawImage(
        image, 
        0, 0, image.width, image.height,
        centerShift_x, centerShift_y, image.width * ratio, image.height * ratio
      );
    }
  }, []);

  // Handle drawing when frame changes or loaded
  useEffect(() => {
    if (isLoaded) {
      drawFrame(currentFrame);
    }
  }, [currentFrame, isLoaded, drawFrame]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (isLoaded) {
        drawFrame(currentFrame);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded, currentFrame, drawFrame]);

  // Auto-play animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // If reduced motion is preferred, just show a nice static frame
      setCurrentFrame(24); // Frame 25 (0-indexed)
      return;
    }

    if (isLoaded && autoPlay && !scrollDriven) {
      let lastTime = 0;
      const frameInterval = 80; // ~12.5 fps
      
      const animate = (timestamp) => {
        if (!lastTime) lastTime = timestamp;
        const progress = timestamp - lastTime;
        
        if (progress >= frameInterval) {
          setCurrentFrame((prev) => (prev + 1) % totalFrames);
          lastTime = timestamp;
        }
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isLoaded, autoPlay, scrollDriven]);

  // Scroll-driven animation (Optional extra)
  useEffect(() => {
    if (isLoaded && scrollDriven) {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const maxScroll = document.body.scrollHeight - windowHeight;
        const scrollFraction = scrollPosition / maxScroll;
        const frameIndex = Math.min(
          totalFrames - 1,
          Math.max(0, Math.floor(scrollFraction * totalFrames))
        );
        setCurrentFrame(frameIndex);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isLoaded, scrollDriven]);

  return (
    <div className="frame-animator">
      <div className="frame-animator__glow"></div>
      
      {!isLoaded ? (
        <div className="frame-animator__loader">
          <div className="frame-animator__progress"></div>
          <div className="frame-animator__progress-text">{loadProgress}%</div>
        </div>
      ) : (
        <canvas 
          ref={canvasRef} 
          className="frame-animator__canvas"
        />
      )}
    </div>
  );
};

export default FrameAnimator;
