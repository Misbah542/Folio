import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';

const CharacterModel = lazy(() => import('./Character'));

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-between px-8 lg:px-24 overflow-hidden" id="landingDiv">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />

      {/* Text Content */}
      <div className="relative z-10 max-w-2xl">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-accent font-display tracking-widest uppercase mb-4"
        >
          Misbah ul Haque
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl lg:text-8xl font-display font-bold leading-tight mb-8"
        >
          Engineering <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
            Experiences.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-400 text-lg lg:text-xl mb-10 max-w-lg leading-relaxed"
        >
          Android developer turned full-stack creative engineer. I build high-performance apps with an obsessive focus on motion and UX.
        </motion.p>

        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 rounded-full bg-white text-background font-medium hover:bg-gray-200 transition-colors"
        >
          View My Work
        </motion.button>
      </div>

      {/* 3D Character Canvas */}
      <div className="absolute right-0 top-0 w-1/2 h-full z-0 pointer-events-none lg:pointer-events-auto">
        <Suspense fallback={null}>
          <CharacterModel />
        </Suspense>
      </div>
    </section>
  );
}