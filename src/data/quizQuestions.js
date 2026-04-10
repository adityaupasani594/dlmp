export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Why does vanilla SGD stall at a saddle point?",
    options: [
      "The loss function becomes undefined at saddle points",
      "The gradient ∇J(θ) ≈ 0 at saddle points, so the update step is near zero",
      "SGD always finds global minima and never stalls",
      "Saddle points only affect Adam optimizer",
    ],
    correct: 1,
    explanation:
      "At a saddle point, ∇J(θ) ≈ 0 in many directions, so the SGD step θ = θ − η∇J(θ) is essentially zero — the ball stalls despite not being at a minimum.",
    level: 1,
  },
  {
    id: 3,
    question: "Adam optimally combines ideas from which two preceding optimizers?",
    options: [
      "SGD and RMSprop",
      "Momentum and RMSprop",
      "Momentum and Nesterov Accelerated Gradient",
      "Adagrad and vanilla SGD",
    ],
    correct: 1,
    explanation:
      "Adam uses Momentum (first moment mₜ for gradient direction) and RMSprop (second moment vₜ for adaptive per-parameter scaling) — getting the best of both.",
    level: 2,
  },
  {
    id: 4,
    question: "What fundamental problem does Adam's bias correction term (1 − βᵗ) solve?",
    options: [
      "It prevents the learning rate from growing too large over time",
      "It corrects the downward bias in mₜ and vₜ caused by zero initialization",
      "It normalizes gradient vectors to unit length",
      "It adds L2 regularization to the update rule",
    ],
    correct: 1,
    explanation:
      "Since m₀ = v₀ = 0, early estimates are heavily biased toward zero. Dividing by (1 − β^t) corrects this systematic bias, especially critical in the first few steps.",
    level: 2,
  },
  {
    id: 6,
    question: "Why does a very high learning rate (η) cause gradient descent to diverge?",
    options: [
      "High η causes numerical underflow in the gradient computation",
      "The optimizer steps become so large that they overshoot the minimum, landing at higher loss values",
      "High η prevents momentum from accumulating properly",
      "A high η forces the optimizer to follow the Hessian exactly",
    ],
    correct: 1,
    explanation:
      "With very large η, the parameter update θ = θ − η∇J(θ) overshoots the minimum. Each step lands at a higher-loss region, causing the loss to grow — divergence.",
    level: 1,
  },
  {
    id: 10,
    question: "The amber trail drawn behind the ball in the simulation represents what optimization concept?",
    options: [
      "The gradient magnitude at each point visited",
      "The complete optimization trajectory — the sequence of weight configurations θ₁, θ₂, … in parameter space",
      "A contour line of equal loss value across the landscape",
      "The learning rate schedule visualized over steps",
    ],
    correct: 1,
    explanation:
      "The trail visualizes the parameter trajectory: every point on the amber line is a distinct weight configuration θₜ. Comparing trails across optimizers reveals their qualitatively different navigation strategies.",
    level: 3,
  },
];

export function getGrade(score) {
  const total = QUIZ_QUESTIONS.length; // 5
  if (score === total)      return { letter: 'A+', label: 'Perfect Score',  color: '#10b981' };
  if (score >= total - 1)   return { letter: 'A',  label: 'Excellent',      color: '#10b981' };
  if (score >= total - 2)   return { letter: 'B',  label: 'Proficient',     color: '#4f8ef7' };
  return                           { letter: 'F',  label: 'Needs Review',   color: '#ef4444' };
}
