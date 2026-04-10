import { saddlePoint, deepTrap, noisyValley } from '../math/simulationMath';

/** Euclidean distance check */
const within = (pos, target, thresh) =>
  Math.sqrt((pos.x - target.x) ** 2 + (pos.z - target.z) ** 2) < thresh;

export const LEVELS = [
  {
    id: 0,
    name: 'Level 1',
    shortName: 'The Saddle Point',
    emoji: '🏔️',
    description:
      'A saddle-shaped landscape. SGD stalls at the flat center. Use Momentum to roll through the saddle and reach the true valley below.',
    surfaceFn: saddlePoint,
    startPos: { x: 0.15, z: 0.15 },
    globalMin: { x: 0, z: 3.16 },
    checkGlobalMin: (pos) =>
      Math.abs(pos.x) < 0.6 && (Math.abs(pos.z - 3.16) < 0.6 || Math.abs(pos.z + 3.16) < 0.6),
    suggestedOptimizer: 'Momentum',
    defaultHyperparams: { lr: 0.05, gamma: 0.85, beta1: 0.9, beta2: 0.999, beta: 0.9 },
    hints: [
      '❌ Try SGD first — watch it stall at the saddle.',
      '💡 Switch to Momentum with γ ≈ 0.85 to push through.',
      '🎯 The global minimum is in the valley at z ≈ ±3.16.',
    ],
    cameraPos: [0, 9, 12],
  },
  {
    id: 1,
    name: 'Level 2',
    shortName: 'The Deep Trap',
    emoji: '🕳️',
    description:
      'A deceptively deep local minimum traps naive optimizers. A better global minimum exists far away — use Adam to escape the trap.',
    surfaceFn: deepTrap,
    startPos: { x: -0.3, z: -0.3 },
    globalMin: { x: 3, z: 3 },
    checkGlobalMin: (pos) => within(pos, { x: 3, z: 3 }, 0.55),
    suggestedOptimizer: 'Adam',
    defaultHyperparams: { lr: 0.08, gamma: 0.9, beta1: 0.9, beta2: 0.999, beta: 0.9 },
    hints: [
      '❌ SGD and Momentum get stuck in the local minimum near (0,0).',
      '💡 Adam\'s adaptive learning rates can navigate out.',
      '🎯 The true global minimum is in the far corner at (~3, ~3).',
    ],
    cameraPos: [2, 10, 13],
  },
  {
    id: 2,
    name: 'Level 3',
    shortName: 'The Noisy Valley',
    emoji: '🌊',
    description:
      'A chaotic, multi-modal landscape simulating mini-batch noise. Carefully tune Adam\'s β₁ and β₂ to converge to the hidden global minimum.',
    surfaceFn: noisyValley,
    startPos: { x: -2.5, z: -2.5 },
    globalMin: { x: 2, z: 1 },
    checkGlobalMin: (pos) => within(pos, { x: 2, z: 1 }, 0.55),
    suggestedOptimizer: 'Adam',
    defaultHyperparams: { lr: 0.05, gamma: 0.9, beta1: 0.85, beta2: 0.995, beta: 0.9 },
    hints: [
      '🌪️ The noisy gradients make SGD bounce erratically.',
      '💡 Adam with β₁ ≈ 0.85 and β₂ ≈ 0.995 works well here.',
      '🎯 Global minimum is near (2, 1). Reduce LR near the end.',
    ],
    cameraPos: [0, 9, 12],
  },
];
