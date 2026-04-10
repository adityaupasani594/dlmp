import { useSimStore } from '../../store/useSimStore';
import { LevelSelector } from './LevelSelector';
import { OptimizerControls } from './OptimizerControls';
import { TheoryCard } from './TheoryCard';
import { MetricsDashboard } from './MetricsDashboard';

export function TheoryPanel() {
  const optimizer = useSimStore((s) => s.optimizer);

  return (
    <aside className="flex flex-col h-full bg-slate-900/70 border-l border-slate-800/60 backdrop-blur-md overflow-hidden">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-5">
        {/* Level selector */}
        <LevelSelector />

        <div className="border-t border-slate-800/50" />

        {/* Optimizer controls */}
        <OptimizerControls />

        <div className="border-t border-slate-800/50" />

        {/* Theory card */}
        <div className="space-y-2">
          <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Theory</h2>
          <TheoryCard optimizer={optimizer} />
        </div>

        <div className="border-t border-slate-800/50" />

        {/* Metrics */}
        <MetricsDashboard />

        {/* Legend */}
        <div className="p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/20 space-y-1.5">
          <p className="text-[9px] text-slate-500 uppercase tracking-widest">Legend</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-electric shadow-sm shadow-electric/60" />
            <span className="text-[10px] text-slate-400">Ball (current weights)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-neon-amber rounded-full" />
            <span className="text-[10px] text-slate-400">Optimization trail</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-neon-green" />
            <span className="text-[10px] text-slate-400">Global minimum marker</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 rounded bg-gradient-to-r from-blue-600 via-green-500 to-red-500" />
            <span className="text-[10px] text-slate-400">Surface height (blue=low, red=high)</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
