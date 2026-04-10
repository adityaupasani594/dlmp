import { useSimStore } from '../../store/useSimStore';

const OPTIMIZERS = ['SGD', 'Momentum', 'RMSprop', 'Adam'];

const optimizerColors = {
  SGD: 'text-slate-300',
  Momentum: 'text-neon-amber',
  RMSprop: 'text-neon-purple',
  Adam: 'text-electric',
};

function Slider({ id, label, value, min, max, step, onChange, unit = '' }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-[11px] text-slate-400 font-mono">{label}</label>
        <span className="text-[11px] font-mono text-electric bg-electric/10 px-1.5 py-0.5 rounded">
          {typeof value === 'number' ? value.toFixed(3) : value}{unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-slate-700 accent-electric cursor-pointer"
      />
    </div>
  );
}

export function OptimizerControls() {
  const { optimizer, hyperparams, speed, isRunning, levelComplete, diverged,
    setOptimizer, setHyperparam, setSpeed, startSim, pauseSim, resetSim } = useSimStore();

  return (
    <div className="space-y-4">
      <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Controls</h2>

      {/* Optimizer selector */}
      <div className="space-y-2">
        <p className="text-[11px] text-slate-500">Optimizer</p>
        <div className="grid grid-cols-2 gap-1.5">
          {OPTIMIZERS.map((opt) => (
            <button
              key={opt}
              id={`opt-${opt.toLowerCase()}`}
              onClick={() => setOptimizer(opt)}
              className={`
                py-1.5 px-3 rounded-lg text-[11px] font-semibold border transition-all duration-150
                ${optimizer === opt
                  ? 'bg-electric/20 border-electric/60 text-electric shadow-sm shadow-electric/20'
                  : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }
              `}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Hyperparameters */}
      <div className="space-y-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
        <Slider id="lr" label="Learning Rate (η)" value={hyperparams.lr} min={0.001} max={0.3} step={0.001}
          onChange={(v) => setHyperparam('lr', v)} />

        {optimizer === 'Momentum' && (
          <Slider id="gamma" label="Momentum (γ)" value={hyperparams.gamma} min={0.1} max={0.99} step={0.01}
            onChange={(v) => setHyperparam('gamma', v)} />
        )}

        {optimizer === 'RMSprop' && (
          <Slider id="beta-rms" label="β (decay)" value={hyperparams.beta} min={0.5} max={0.999} step={0.001}
            onChange={(v) => setHyperparam('beta', v)} />
        )}

        {optimizer === 'Adam' && (
          <>
            <Slider id="beta1" label="β₁ (momentum)" value={hyperparams.beta1} min={0.5} max={0.999} step={0.001}
              onChange={(v) => setHyperparam('beta1', v)} />
            <Slider id="beta2" label="β₂ (RMS decay)" value={hyperparams.beta2} min={0.9} max={0.9999} step={0.0001}
              onChange={(v) => setHyperparam('beta2', v)} />
          </>
        )}
      </div>

      {/* Speed slider */}
      <Slider id="speed" label="Simulation Speed" value={speed} min={1} max={10} step={1}
        onChange={setSpeed} unit="×" />

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          id="btn-start-pause"
          onClick={isRunning ? pauseSim : startSim}
          disabled={levelComplete || diverged}
          className={`
            flex-1 py-2 rounded-xl font-semibold text-sm transition-all duration-150 border
            ${isRunning
              ? 'bg-neon-amber/20 border-neon-amber/50 text-neon-amber hover:bg-neon-amber/30'
              : 'bg-electric/20 border-electric/50 text-electric hover:bg-electric/30'
            }
            disabled:opacity-40 disabled:cursor-not-allowed
          `}
        >
          {isRunning ? '⏸ Pause' : '▶ Run'}
        </button>

        <button
          id="btn-reset"
          onClick={resetSim}
          className="py-2 px-3 rounded-xl border border-slate-600/50 text-slate-400 hover:text-white hover:border-slate-500 text-sm transition-all duration-150 bg-slate-800/30"
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
}
