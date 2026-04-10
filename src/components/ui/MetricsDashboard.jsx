import { useSimStore } from '../../store/useSimStore';
import { getGrade } from '../../data/quizQuestions';

function MetricCard({ label, value, unit = '', color = 'text-electric', sub }) {
  return (
    <div className="flex-1 bg-slate-900/60 border border-slate-700/30 rounded-xl p-2.5 text-center">
      <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-lg font-mono font-bold ${color} leading-none`}>
        {value !== null && value !== undefined ? value : '—'}
        {unit && <span className="text-xs ml-0.5 opacity-60">{unit}</span>}
      </p>
      {sub && <p className="text-[9px] text-slate-600 mt-0.5">{sub}</p>}
    </div>
  );
}

export function MetricsDashboard() {
  const epoch = useSimStore((s) => s.epoch);
  const currentLoss = useSimStore((s) => s.currentLoss);
  const velocity = useSimStore((s) => s.velocity);
  const optimizer = useSimStore((s) => s.optimizer);
  const levelComplete = useSimStore((s) => s.levelComplete);
  const diverged = useSimStore((s) => s.diverged);
  const quizUnlocked = useSimStore((s) => s.quizUnlocked);
  const quizComplete = useSimStore((s) => s.quizComplete);
  const quizScore   = useSimStore((s) => s.quizScore);
  const openQuiz    = useSimStore((s) => s.openQuiz);
  const openCertificate = useSimStore((s) => s.openCertificate);
  const certificateName = useSimStore((s) => s.certificateName);

  const lossDisplay = currentLoss !== null ? currentLoss.toFixed(4) : '—';
  const lossColor = currentLoss === null ? 'text-slate-500'
    : currentLoss < -1.0 ? 'text-neon-green'
    : currentLoss < 0 ? 'text-neon-amber'
    : 'text-neon-red';

  const speed = velocity
    ? Math.sqrt(velocity.vx ** 2 + velocity.vz ** 2).toExponential(2)
    : '0';

  return (
    <div className="space-y-2">
      <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Live Metrics</h2>

      {/* Status banner */}
      {levelComplete && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neon-green/10 border border-neon-green/30 animate-celebration">
          <span className="text-lg">🎉</span>
          <div>
            <p className="text-xs font-bold text-neon-green">Global Minimum Reached!</p>
            <p className="text-[10px] text-slate-400">Next level has been unlocked.</p>
          </div>
        </div>
      )}
      {diverged && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neon-red/10 border border-neon-red/30">
          <span className="text-lg">💥</span>
          <div>
            <p className="text-xs font-bold text-neon-red">Diverged!</p>
            <p className="text-[10px] text-slate-400">LR too high — try resetting with a smaller value.</p>
          </div>
        </div>
      )}

      {/* Metric cards */}
      <div className="flex gap-2">
        <MetricCard label="Epoch" value={epoch} color="text-neon-purple" />
        <MetricCard label="Loss" value={lossDisplay} color={lossColor} />
      </div>

      <div className="flex gap-2">
        <MetricCard
          label="‖Δθ‖"
          value={speed}
          color="text-neon-amber"
          sub="Step magnitude"
        />
        <MetricCard
          label="Optimizer"
          value={optimizer}
          color="text-electric"
          sub="Active algorithm"
        />
      </div>

      {/* Velocity components */}
      {velocity && (optimizer === 'Momentum' || optimizer === 'Adam') && (
        <div className="p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/20">
          <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">Velocity Components</p>
          <div className="grid grid-cols-2 gap-2">
            {[['vx', velocity.vx], ['vz', velocity.vz]].map(([key, val]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[9px] font-mono text-slate-500">{key}</span>
                  <span className="text-[9px] font-mono text-slate-300">{val?.toExponential(2) ?? '0'}</span>
                </div>
                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neon-amber rounded-full transition-all duration-200"
                    style={{ width: `${Math.min(100, Math.abs((val ?? 0) * 200))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz unlock CTA */}
      {quizUnlocked && !quizComplete && (
        <div className="p-3 rounded-xl bg-gradient-to-br from-neon-amber/10 to-yellow-900/10 border border-neon-amber/30 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎓</span>
            <div>
              <p className="text-xs font-bold text-neon-amber">All Levels Cleared!</p>
              <p className="text-[10px] text-slate-400">You've unlocked the final knowledge quiz.</p>
            </div>
          </div>
          <button
            id="btn-take-quiz"
            onClick={openQuiz}
            className="w-full py-2.5 rounded-xl font-bold text-sm bg-neon-amber/20 border border-neon-amber/50 text-neon-amber hover:bg-neon-amber/30 transition-all animate-glow"
          >
            🧠 Take Final Quiz →
          </button>
        </div>
      )}

      {/* Quiz complete badge */}
      {quizComplete && (() => {
        const grade = getGrade(quizScore);
        return (
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏆</span>
                <div>
                  <p className="text-xs font-bold" style={{ color: grade.color }}>Quiz: {grade.letter} — {quizScore}/10</p>
                  <p className="text-[10px] text-slate-500">{grade.label}</p>
                </div>
              </div>
            </div>
            {quizScore >= 3 && (
              <button
                id="btn-view-certificate"
                onClick={() => openCertificate(certificateName)}
                className="w-full py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-neon-amber to-yellow-400 text-slate-900 hover:opacity-90 transition-opacity"
              >
                🏅 View Certificate
              </button>
            )}
          </div>
        );
      })()}
    </div>
  );
}
