import { useSimStore } from '../../store/useSimStore';
import { LEVELS } from '../../levels/levelConfig';

export function LevelSelector() {
  const currentLevel = useSimStore((s) => s.currentLevel);
  const unlockedLevels = useSimStore((s) => s.unlockedLevels);
  const selectLevel = useSimStore((s) => s.selectLevel);

  return (
    <div className="space-y-2">
      <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Levels</h2>
      <div className="grid grid-cols-3 gap-2">
        {LEVELS.map((level) => {
          const unlocked = unlockedLevels.has(level.id);
          const active = currentLevel === level.id;

          return (
            <button
              key={level.id}
              id={`level-btn-${level.id}`}
              onClick={() => selectLevel(level.id)}
              disabled={!unlocked}
              className={`
                relative flex flex-col items-center gap-1 px-2 py-3 rounded-xl border text-center
                transition-all duration-200 group
                ${active
                  ? 'bg-electric/15 border-electric/60 shadow-md shadow-electric/20'
                  : unlocked
                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/80'
                  : 'bg-slate-900/30 border-slate-800/30 opacity-50 cursor-not-allowed'
                }
              `}
            >
              <span className="text-xl leading-none">{level.emoji}</span>
              <span className={`text-[10px] font-semibold leading-tight ${active ? 'text-electric' : unlocked ? 'text-slate-300' : 'text-slate-600'}`}>
                {level.name}
              </span>
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-950/40">
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-slate-600">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              )}
              {active && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-electric" />
              )}
            </button>
          );
        })}
      </div>

      {/* Current level description */}
      <div className="mt-1 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
        <p className="text-[11px] text-slate-300 leading-relaxed">{LEVELS[currentLevel].description}</p>
        <div className="mt-2 space-y-1">
          {LEVELS[currentLevel].hints.map((hint, i) => (
            <p key={i} className="text-[10px] text-slate-500 leading-snug">{hint}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
