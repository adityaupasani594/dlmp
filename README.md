# The Optimizer Trap

An interactive 3D simulator that teaches how neural network optimizers navigate complex loss landscapes — through hands-on experimentation, not just theory.

Students progress through three levels (Saddle Point → Deep Trap → Noisy Valley), experimenting with SGD, Momentum, and Adam to discover how each optimizer behaves. After completing all levels they take a quiz and receive a certificate.

## Technologies Used

| Technology | Purpose |
|---|---|
| [React](https://react.dev/) + [Vite](https://vite.dev/) | UI framework and build tooling |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Three.js](https://threejs.org/) | 3D loss-landscape rendering |
| [@react-three/drei](https://github.com/pmndrs/drei) | Three.js helpers (orbit controls, etc.) |
| [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) | Post-processing visual effects |
| [Zustand](https://zustand-demo.pmnd.rs/) | Global simulation state management |
| [KaTeX](https://katex.org/) + [react-katex](https://github.com/talyssonoc/react-katex) | Math formula rendering |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |

## Getting Started

```bash
npm install
npm run dev
```
