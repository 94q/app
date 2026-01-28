import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#080808]">
      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Animated gradient orbs */}
      <div 
        className="gradient-orb w-[600px] h-[600px] bg-[#E62B1E]/20 animate-pulse-glow"
        style={{ top: '-200px', left: '-200px' }}
      />
      <div 
        className="gradient-orb w-[400px] h-[400px] bg-[#E62B1E]/10 animate-pulse-glow"
        style={{ 
          bottom: '-100px', 
          right: '-100px',
          animationDelay: '1.5s'
        }}
      />
      <div 
        className="gradient-orb w-[300px] h-[300px] bg-white/5 animate-pulse-glow"
        style={{ 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          animationDelay: '0.75s'
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6">
        {/* TEDx Logo and Title */}
        <div 
          className={`text-center transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* TEDx Logo */}
          <div className="mb-8 flex items-center justify-center gap-1">
            <span className="text-5xl font-black tracking-tighter text-white sm:text-6xl md:text-7xl">
              TED
            </span>
            <span className="text-5xl font-black tracking-tighter text-[#E62B1E] sm:text-6xl md:text-7xl">
              x
            </span>
          </div>

          {/* ICHB Colentina */}
          <h1 className="mb-12 text-4xl font-bold tracking-wide text-white sm:text-5xl md:text-6xl lg:text-7xl">
            ICHB Colentina
          </h1>

          {/* Divider line */}
          <div className="mx-auto mb-12 h-[1px] w-24 bg-gradient-to-r from-transparent via-[#E62B1E] to-transparent" />

          {/* Coming Soon */}
          <div 
            className={`transition-all duration-1000 delay-500 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="animate-float text-lg font-light tracking-[0.3em] text-white/60 sm:text-xl md:text-2xl">
              COMING SOON
            </p>
          </div>

          {/* Subtle dots indicator */}
          <div 
            className={`mt-16 flex justify-center gap-2 transition-all duration-1000 delay-700 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#E62B1E]/40 animate-pulse" style={{ animationDelay: '0s' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-[#E62B1E]/40 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-[#E62B1E]/40 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent" />
    </div>
  );
}

export default App;
