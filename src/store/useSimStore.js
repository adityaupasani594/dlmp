import { create } from 'zustand';
import { applyOptimizer } from '../math/simulationMath';
import { LEVELS } from '../levels/levelConfig';

const TRAIL_MAX = 150;
const MAX_EPOCHS = 800;

export const useSimStore = create((set, get) => ({
  // ── Level state ──────────────────────────────────────────────
  currentLevel: 0,
  unlockedLevels: new Set(LEVELS.map((_, i) => i)),
  completedLevels: new Set(),       // tracks which levels reached global min

  // ── Optimizer config ─────────────────────────────────────────
  optimizer: 'SGD',
  hyperparams: { lr: 0.05, gamma: 0.85, beta1: 0.9, beta2: 0.999, beta: 0.9 },
  speed: 5,

  // ── Simulation state ─────────────────────────────────────────
  isRunning: false,
  epoch: 0,
  currentLoss: null,
  ballPosition: { x: 0.15, z: 0.15 },
  velocity: { vx: 0, vz: 0 },
  trail: [{ x: 0.15, z: 0.15 }],
  optimizerState: {},

  // ── Completion ───────────────────────────────────────────────
  levelComplete: false,
  diverged: false,

  // ── Quiz & Certificate ───────────────────────────────────────
  quizUnlocked: false,
  quizComplete: false,
  quizScore: 0,
  certificateName: '',
  showQuiz: false,
  showCertificate: false,

  // ── Actions ──────────────────────────────────────────────────
  selectLevel(id) {
    const { unlockedLevels } = get();
    if (!unlockedLevels.has(id)) return;
    const level = LEVELS[id];
    set({
      currentLevel: id,
      optimizer: level.suggestedOptimizer,
      hyperparams: { ...level.defaultHyperparams },
      isRunning: false,
      epoch: 0,
      currentLoss: level.surfaceFn(level.startPos.x, level.startPos.z),
      ballPosition: { ...level.startPos },
      velocity: { vx: 0, vz: 0 },
      trail: [{ ...level.startPos }],
      optimizerState: {},
      levelComplete: false,
      diverged: false,
    });
  },

  startSim() { set({ isRunning: true }); },
  pauseSim() { set({ isRunning: false }); },

  resetSim() {
    const { currentLevel } = get();
    const level = LEVELS[currentLevel];
    set({
      isRunning: false,
      epoch: 0,
      currentLoss: level.surfaceFn(level.startPos.x, level.startPos.z),
      ballPosition: { ...level.startPos },
      velocity: { vx: 0, vz: 0 },
      trail: [{ ...level.startPos }],
      optimizerState: {},
      levelComplete: false,
      diverged: false,
    });
  },

  setOptimizer(name) {
    set({ optimizer: name, optimizerState: {}, velocity: { vx: 0, vz: 0 } });
  },

  setHyperparam(key, value) {
    set((s) => ({ hyperparams: { ...s.hyperparams, [key]: value } }));
  },

  setSpeed(value) { set({ speed: value }); },

  // ── Quiz actions ──────────────────────────────────────────────
  openQuiz()  { set({ showQuiz: true }); },
  closeQuiz() { set({ showQuiz: false }); },

  finishQuiz(score) {
    set({ quizComplete: true, quizScore: score, showQuiz: false });
  },

  openCertificate(name)  { set({ showCertificate: true, certificateName: name }); },
  closeCertificate()     { set({ showCertificate: false }); },

  stepSim() {
    const {
      currentLevel, optimizer, hyperparams, ballPosition,
      optimizerState, epoch, trail, unlockedLevels, completedLevels,
      levelComplete, diverged,
    } = get();

    if (levelComplete || diverged) return;
    if (epoch >= MAX_EPOCHS) { set({ isRunning: false }); return; }

    const level = LEVELS[currentLevel];
    const result = applyOptimizer(optimizer, ballPosition, level.surfaceFn, hyperparams, optimizerState);

    const newPos = { x: result.x, z: result.z };
    const newLoss = level.surfaceFn(newPos.x, newPos.z);
    const newTrail = [...trail, { ...newPos }].slice(-TRAIL_MAX);
    const newEpoch = epoch + 1;

    const isDiverged = Math.abs(newLoss) > 50;
    const isComplete = !isDiverged && level.checkGlobalMin(newPos);

    let newUnlocked = unlockedLevels;
    let newCompleted = completedLevels;

    if (isComplete) {
      newCompleted = new Set([...completedLevels, currentLevel]);
      if (currentLevel < LEVELS.length - 1) {
        newUnlocked = new Set([...unlockedLevels, currentLevel + 1]);
      }
    }

    const allLevelsDone = newCompleted.size >= LEVELS.length;

    set({
      ballPosition: newPos,
      currentLoss: newLoss,
      trail: newTrail,
      epoch: newEpoch,
      optimizerState: result.state,
      velocity: result.velocity,
      levelComplete: isComplete,
      diverged: isDiverged,
      unlockedLevels: newUnlocked,
      completedLevels: newCompleted,
      quizUnlocked: allLevelsDone,
      isRunning: isComplete || isDiverged ? false : true,
    });
  },
}));
