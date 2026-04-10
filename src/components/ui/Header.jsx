export function Header({ onHome }) {
  return (
    <header className="flex items-center gap-3 px-5 py-3 border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-md shrink-0">
      {/* Logo mark — clickable back to home */}
      <button
        onClick={onHome}
        className="group relative w-8 h-8 rounded-lg bg-gradient-to-br from-electric to-neon-purple flex items-center justify-center shadow-lg shadow-electric/30 hover:shadow-electric/50 transition-shadow"
        title="Back to Home"
      >
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
          <circle cx="10" cy="10" r="3" fill="white" opacity="0.9" />
          <path d="M10 3 Q14 7 10 10 Q6 13 10 17" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7" />
        </svg>
        <div className="absolute inset-0 rounded-lg animate-pulse-slow bg-electric/20" />
      </button>

      <div>
        <h1 className="text-base font-bold font-[Outfit] text-white leading-tight tracking-tight">
          The Optimizer Trap
        </h1>
        <p className="text-[10px] text-slate-400 leading-tight">Neural Network Loss Landscape Simulator</p>
      </div>

      {/* Back to home link */}
      {onHome && (
        <button
          onClick={onHome}
          className="ml-2 flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </button>
      )}

      <div className="ml-auto flex items-center gap-2">
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-electric/10 text-electric border border-electric/20">
          R3F · Zustand · KaTeX
        </span>
      </div>
    </header>
  );
}
