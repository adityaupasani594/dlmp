import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const THEORY_DATA = {
  SGD: {
    color: 'from-slate-600 to-slate-700',
    accent: '#94a3b8',
    equations: [
      { latex: '\\theta = \\theta - \\eta \\nabla_{\\theta} J(\\theta)', label: 'Parameter update' },
    ],
    summary: 'SGD moves directly in the steepest descent direction. Simple and fast, but susceptible to saddle points and oscillations in narrow valleys.',
    pros: 'Fast per-step. Easy to understand.',
    cons: 'Stalls at saddle points. Sensitive to learning rate.',
    symbol: '⚡',
  },
  Momentum: {
    color: 'from-amber-900/60 to-amber-800/40',
    accent: '#f59e0b',
    equations: [
      { latex: 'v_t = \\gamma v_{t-1} + \\eta \\nabla_{\\theta} J(\\theta)', label: 'Velocity update' },
      { latex: '\\theta = \\theta - v_t', label: 'Parameter update' },
    ],
    summary: 'Momentum accumulates a velocity vector in the gradient direction, like a ball rolling downhill — building speed in consistent directions and dampening oscillations.',
    pros: 'Rolls through saddle points. Faster convergence in ravines.',
    cons: 'Can overshoot minima. Two hyperparameters to tune.',
    symbol: '🏃',
  },
  RMSprop: {
    color: 'from-purple-900/60 to-purple-800/40',
    accent: '#8b5cf6',
    equations: [
      { latex: 'E[g^2]_t = \\beta E[g^2]_{t-1} + (1-\\beta)g_t^2', label: 'Running squared gradient' },
      { latex: '\\theta = \\theta - \\frac{\\eta}{\\sqrt{E[g^2]_t + \\epsilon}}\\, g_t', label: 'Adaptive update' },
    ],
    summary: 'RMSprop adapts the learning rate for each parameter using the running average of recent squared gradients — parameters with large gradients get smaller steps.',
    pros: 'Works well with noisy gradients. Adaptive per-parameter steps.',
    cons: 'Accumulates squared gradients forever (no bias correction).',
    symbol: '⚙️',
  },
  Adam: {
    color: 'from-blue-900/60 to-blue-800/40',
    accent: '#4f8ef7',
    equations: [
      { latex: 'm_t = \\beta_1 m_{t-1} + (1-\\beta_1)g_t', label: '1st moment (mean)' },
      { latex: 'v_t = \\beta_2 v_{t-1} + (1-\\beta_2)g_t^2', label: '2nd moment (variance)' },
      { latex: '\\hat{m}_t = \\frac{m_t}{1-\\beta_1^t},\\;\\hat{v}_t = \\frac{v_t}{1-\\beta_2^t}', label: 'Bias correction' },
      { latex: '\\theta = \\theta - \\frac{\\eta}{\\sqrt{\\hat{v}_t}+\\epsilon}\\hat{m}_t', label: 'Final update' },
    ],
    summary: 'Adam combines Momentum (first moment) and RMSprop (second moment) with bias correction. It adapts the learning rate per-parameter and corrects for the bias of zero-initialized moments.',
    pros: 'Best of both worlds. Usually works out of the box.',
    cons: 'More memory (two moment vectors). Can converge to suboptimal in some cases.',
    symbol: '🧠',
  },
};

export function TheoryCard({ optimizer }) {
  const data = THEORY_DATA[optimizer];
  if (!data) return null;

  return (
    <div className={`rounded-xl p-3 bg-gradient-to-br ${data.color} border border-white/5 space-y-3`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-xl">{data.symbol}</span>
        <div>
          <p className="text-sm font-bold text-white">{optimizer}</p>
          <p className="text-[10px] text-slate-400">Mathematical Update Rule</p>
        </div>
      </div>

      {/* Equations */}
      <div className="space-y-2 bg-black/30 rounded-lg p-2.5">
        {data.equations.map((eq, i) => (
          <div key={i}>
            <p className="text-[9px] text-slate-500 mb-0.5 font-mono">{eq.label}</p>
            <div className="text-white overflow-x-auto katex-display-wrapper">
              <BlockMath math={eq.latex} />
            </div>
          </div>
        ))}
      </div>

      {/* Plain-English explanation */}
      <p className="text-[11px] text-slate-300 leading-relaxed">{data.summary}</p>

      {/* Pros/Cons */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-neon-green/5 border border-neon-green/20 rounded-lg p-2">
          <p className="text-[9px] text-neon-green font-semibold mb-0.5">✓ Strengths</p>
          <p className="text-[10px] text-slate-400 leading-snug">{data.pros}</p>
        </div>
        <div className="bg-neon-red/5 border border-neon-red/20 rounded-lg p-2">
          <p className="text-[9px] text-neon-red font-semibold mb-0.5">✗ Weaknesses</p>
          <p className="text-[10px] text-slate-400 leading-snug">{data.cons}</p>
        </div>
      </div>
    </div>
  );
}
