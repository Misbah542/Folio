import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AboutTextReveal() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const text = "I am a developer who believes that software shouldn't just work—it should feel alive. I bridge the gap between heavy engineering and pixel-perfect design.";
  const words = text.split(" ");

  return (
    <section ref={containerRef} className="min-h-[150vh] flex items-center justify-center px-8 lg:px-40" id="about">
      <div className="max-w-5xl sticky top-1/3">
        <p className="text-4xl lg:text-6xl font-display font-bold leading-tight flex flex-wrap gap-x-3 gap-y-2">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + (1 / words.length);
            const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
            const y = useTransform(scrollYProgress, [start, end], [10, 0]);
            
            return (
              <motion.span key={i} style={{ opacity, y }} className="text-white">
                {word}
              </motion.span>
            );
          })}
        </p>
      </div>
    </section>
  );
}