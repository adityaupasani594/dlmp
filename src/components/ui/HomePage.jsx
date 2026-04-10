const TEAM = [
  {
    name: 'Priya Tolani',
    roll: 'D12C 60',
    initials: 'PT',
    role: 'UI/UX & Visualization',
    color: 'from-pink-500 to-rose-600',
    glow: 'shadow-pink-500/25',
  },
  {
    name: 'Aditya Upasani',
    roll: 'D12C 62',
    initials: 'AU',
    role: 'Simulation Engine',
    color: 'from-electric to-blue-600',
    glow: 'shadow-electric/25',
  },
  {
    name: 'Purva Mhatre',
    roll: 'D12C 66',
    initials: 'PM',
    role: 'ML Theory & Quiz',
    color: 'from-neon-green to-emerald-600',
    glow: 'shadow-neon-green/25',
  },
  {
    name: 'Simran Talreja',
    roll: 'D12C 70',
    initials: 'ST',
    role: 'Level Design & Pedagogy',
    color: 'from-neon-purple to-violet-600',
    glow: 'shadow-neon-purple/25',
  },
];

const FEATURES = [
  { icon: '🏔️', title: 'Level 1', sub: 'The Saddle Point', desc: 'Navigate the flat saddle — where SGD stalls and Momentum shines.' },
  { icon: '🕳️', title: 'Level 2', sub: 'The Deep Trap', desc: 'Escape a deceptive local minimum using Adam\'s adaptive step sizes.' },
  { icon: '🌊', title: 'Level 3', sub: 'The Noisy Valley', desc: 'Tame chaotic mini-batch gradients with carefully tuned β₁ and β₂.' },
];

export function HomePage({ onEnter }) {
  return (
    <div className="relative h-screen w-screen bg-slate-950 overflow-y-auto overflow-x-hidden font-sans scrollbar-thin">

      {/* ── Ambient background blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-electric/8 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-neon-purple/8 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 left-1/3 w-[450px] h-[450px] bg-neon-green/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex flex-col items-center gap-20">

        {/* ── Hero ── */}
        <section className="flex flex-col items-center text-center gap-6 pt-8">
          {/* Badge */}
          <span className="text-[11px] font-mono tracking-widest px-4 py-1.5 rounded-full border border-electric/30 bg-electric/8 text-electric uppercase">
            Deep Learning Mini Project · D12C
          </span>

          {/* Logo mark */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-electric via-blue-500 to-neon-purple flex items-center justify-center shadow-2xl shadow-electric/30 animate-float">
            <svg viewBox="0 0 48 48" fill="none" className="w-14 h-14">
              <circle cx="24" cy="24" r="6" fill="white" opacity="0.95" />
              <path d="M24 6 Q32 14 24 24 Q16 34 24 42" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
              <path d="M6 24 Q14 16 24 24 Q34 32 42 24" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
            </svg>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent" />
          </div>

          {/* Title */}
          <div>
            <h1
              className="text-6xl font-extrabold font-[Outfit] leading-tight bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #7db0ff 0%, #4f8ef7 35%, #8b5cf6 70%, #a78bfa 100%)' }}
            >
              The Optimizer Trap
            </h1>
            <p className="mt-3 text-xl text-slate-400 max-w-2xl leading-relaxed">
              An interactive 3D simulator that teaches how neural network optimizers navigate complex
              loss landscapes — through hands-on experimentation, not just theory.
            </p>
          </div>

          {/* Tech pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {['React + Vite', 'React Three Fiber', 'Zustand', 'KaTeX', 'Tailwind CSS'].map((t) => (
              <span key={t} className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-400">
                {t}
              </span>
            ))}
          </div>

          {/* CTA */}
          <button
            id="btn-launch-simulator"
            onClick={onEnter}
            className="group mt-2 relative px-10 py-4 rounded-2xl font-bold text-lg text-white overflow-hidden transition-all duration-300 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)' }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Launch Simulator
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -inset-1 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #4f8ef7, #8b5cf6)' }} />
          </button>
        </section>

        {/* ── What You'll Learn ── */}
        <section className="w-full space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-[Outfit] text-white">Three Levels. One Goal.</h2>
            <p className="text-slate-500 text-sm mt-1">Complete all levels, pass the quiz, earn your certificate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800/60 hover:border-slate-700/80 transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-electric/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <span className="text-3xl">{f.icon}</span>
                  <p className="mt-3 text-xs font-mono text-slate-500 uppercase tracking-widest">{f.title}</p>
                  <h3 className="text-base font-bold text-white mt-0.5">{f.sub}</h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="w-full space-y-6">
          <h2 className="text-2xl font-bold font-[Outfit] text-white text-center">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: '01', label: 'Choose a Level', icon: '🎯' },
              { step: '02', label: 'Pick an Optimizer', icon: '⚙️' },
              { step: '03', label: 'Watch & Tune', icon: '📊' },
              { step: '04', label: 'Pass the Quiz', icon: '🏆' },
            ].map(({ step, label, icon }) => (
              <div key={step} className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/40">
                <span className="text-2xl">{icon}</span>
                <span className="text-[10px] font-mono text-slate-600">{step}</span>
                <span className="text-sm font-semibold text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Team ── */}
        <section className="w-full space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-[Outfit] text-white">Meet the Team</h2>
            <p className="text-slate-500 text-sm mt-1">
              Built with ❤️ for the Deep Learning Mini Project · B.Tech Computer Engineering
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TEAM.map((member) => (
              <div
                key={member.roll}
                className={`relative flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-slate-900/70 border border-slate-800/60 hover:border-slate-700/80 transition-all duration-300 group shadow-xl ${member.glow} hover:shadow-2xl`}
              >
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center shadow-lg text-white font-bold text-xl font-[Outfit] transition-transform group-hover:scale-110 duration-300`}>
                  {member.initials}
                </div>

                {/* Info */}
                <div>
                  <p className="font-bold text-white text-sm leading-tight">{member.name}</p>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">{member.roll}</p>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">{member.role}</p>
                </div>

                {/* Subtle hover glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="w-full text-center pb-8 space-y-2">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mx-auto" />
          <p className="text-xs text-slate-600 font-mono">
            D12C · Deep Learning Mini Project · 2025–26
          </p>
          <p className="text-xs text-slate-700 font-mono">
            React Three Fiber · Zustand · KaTeX · Tailwind CSS
          </p>
        </footer>

      </div>
    </div>
  );
}
