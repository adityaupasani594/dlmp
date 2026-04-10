// ═══════════════════════════════════════════════════════════════════════════
//  simulationMath.js — Loss landscape functions, gradients, and optimizers
// ═══════════════════════════════════════════════════════════════════════════

const CLAMP = (v, min = -3.85, max = 3.85) => Math.max(min, Math.min(max, v));

// ─── Surface Functions ────────────────────────────────────────────────────────
/**
 * LEVEL 1: Saddle Point
 * f(x,z) = 0.1(x²-z²) + 0.005(x⁴+z⁴)
 * Saddle at (0,0). True minima at (0, ±√10) ≈ (0, ±3.16)
 */
export function saddlePoint(x, z) {
  return 0.1 * (x * x - z * z) + 0.005 * (x ** 4 + z ** 4);
}

/**
 * LEVEL 2: Deep Trap (Local Minimum)
 * Local trap near (0,0), global minimum near (3,3)
 */
export function deepTrap(x, z) {
  return (
    0.05 * (x * x + z * z) -
    0.9 * Math.exp(-3.5 * (x * x + z * z)) -
    2.2 * Math.exp(-0.6 * ((x - 3) ** 2 + (z - 3) ** 2))
  );
}

/**
 * LEVEL 3: Noisy Valley
 * Highly irregular landscape with ripples, global min near (2,1)
 */
export function noisyValley(x, z) {
  return (
    0.07 * (x * x + z * z) +
    0.38 * Math.sin(2.5 * x) * Math.cos(2.5 * z) +
    0.28 * Math.sin(4 * x + z) +
    0.18 * Math.cos(3 * z - x) -
    1.9 * Math.exp(-0.55 * ((x - 2) ** 2 + (z - 1) ** 2))
  );
}

// ─── Vertex Color Mapping ─────────────────────────────────────────────────────
/**
 * Maps a normalized height t∈[0,1] to an RGB triple [r,g,b] in [0,1].
 * Color ramp: Deep blue → Cyan → Lime → Amber → Scarlet
 */
export function heightToColor(t) {
  const c = Math.max(0, Math.min(1, t));
  if (c < 0.25) {
    const s = c / 0.25;
    return [0.0, s * 0.4, 0.9 + s * 0.1];
  } else if (c < 0.5) {
    const s = (c - 0.25) / 0.25;
    return [0.0, 0.4 + s * 0.6, 1.0 - s * 0.8];
  } else if (c < 0.75) {
    const s = (c - 0.5) / 0.25;
    return [s * 0.95, 1.0 - s * 0.3, 0.0];
  } else {
    const s = (c - 0.75) / 0.25;
    return [0.95, 0.7 - s * 0.7, 0.0];
  }
}

// ─── Numerical Gradient (Central Differencing) ────────────────────────────────
export function gradient(fn, x, z, h = 0.0005) {
  return {
    gx: (fn(x + h, z) - fn(x - h, z)) / (2 * h),
    gz: (fn(x, z + h) - fn(x, z - h)) / (2 * h),
  };
}

// ─── Optimizer Step Functions ─────────────────────────────────────────────────

/** SGD: θ = θ − η∇J(θ) */
export function stepSGD(pos, grad, { lr }) {
  const dx = lr * grad.gx;
  const dz = lr * grad.gz;
  return {
    x: CLAMP(pos.x - dx),
    z: CLAMP(pos.z - dz),
    state: {},
    velocity: { vx: -dx, vz: -dz },
  };
}

/** Momentum: v_t = γv_{t-1} + η∇J(θ),  θ = θ − v_t */
export function stepMomentum(pos, grad, { lr, gamma }, state) {
  const vx = gamma * (state.vx || 0) + lr * grad.gx;
  const vz = gamma * (state.vz || 0) + lr * grad.gz;
  return {
    x: CLAMP(pos.x - vx),
    z: CLAMP(pos.z - vz),
    state: { vx, vz },
    velocity: { vx: -vx, vz: -vz },
  };
}

/** RMSprop: E[g²]_t = βE[g²]_{t-1} + (1−β)g²_t,  θ = θ − (η/√(E[g²]+ε))·g */
export function stepRMSprop(pos, grad, { lr, beta = 0.9, eps = 1e-8 }, state) {
  const ex = beta * (state.ex || 0) + (1 - beta) * grad.gx ** 2;
  const ez = beta * (state.ez || 0) + (1 - beta) * grad.gz ** 2;
  const dx = (lr / Math.sqrt(ex + eps)) * grad.gx;
  const dz = (lr / Math.sqrt(ez + eps)) * grad.gz;
  return {
    x: CLAMP(pos.x - dx),
    z: CLAMP(pos.z - dz),
    state: { ex, ez },
    velocity: { vx: -dx, vz: -dz },
  };
}

/** Adam: bias-corrected first & second moment estimates */
export function stepAdam(pos, grad, { lr, beta1 = 0.9, beta2 = 0.999, eps = 1e-8 }, state) {
  const t = (state.t || 0) + 1;
  const mx = beta1 * (state.mx || 0) + (1 - beta1) * grad.gx;
  const mz = beta1 * (state.mz || 0) + (1 - beta1) * grad.gz;
  const vx = beta2 * (state.vx || 0) + (1 - beta2) * grad.gx ** 2;
  const vz = beta2 * (state.vz || 0) + (1 - beta2) * grad.gz ** 2;
  const mxH = mx / (1 - beta1 ** t);
  const mzH = mz / (1 - beta1 ** t);
  const vxH = vx / (1 - beta2 ** t);
  const vzH = vz / (1 - beta2 ** t);
  const dx = (lr / (Math.sqrt(vxH) + eps)) * mxH;
  const dz = (lr / (Math.sqrt(vzH) + eps)) * mzH;
  return {
    x: CLAMP(pos.x - dx),
    z: CLAMP(pos.z - dz),
    state: { t, mx, mz, vx, vz },
    velocity: { vx: -dx, vz: -dz },
  };
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────
export function applyOptimizer(name, pos, fn, hyperparams, optimizerState) {
  const grad = gradient(fn, pos.x, pos.z);
  switch (name) {
    case 'Momentum': return stepMomentum(pos, grad, hyperparams, optimizerState);
    case 'RMSprop':  return stepRMSprop(pos, grad, hyperparams, optimizerState);
    case 'Adam':     return stepAdam(pos, grad, hyperparams, optimizerState);
    default:         return stepSGD(pos, grad, hyperparams);
  }
}
