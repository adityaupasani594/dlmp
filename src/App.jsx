import { useState } from 'react';
import { OptimizerCanvas } from './components/canvas/OptimizerCanvas';
import { TheoryPanel } from './components/ui/TheoryPanel';
import { Header } from './components/ui/Header';
import { HomePage } from './components/ui/HomePage';
import { Quiz } from './components/ui/Quiz';
import { Certificate } from './components/ui/Certificate';
import { useSimStore } from './store/useSimStore';

export default function App() {
  const [page, setPage] = useState('home'); // 'home' | 'simulator'

  const showQuiz        = useSimStore((s) => s.showQuiz);
  const showCertificate = useSimStore((s) => s.showCertificate);

  if (page === 'home') {
    return <HomePage onEnter={() => setPage('simulator')} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 overflow-hidden font-sans">
      {/* Top header bar — clicking logo goes back home */}
      <Header onHome={() => setPage('home')} />

      {/* Main split layout */}
      <main className="flex flex-1 min-h-0">
        {/* 3D Canvas — 65% width */}
        <div className="flex-[0_0_65%] min-w-0 h-full">
          <OptimizerCanvas />
        </div>

        {/* Theory/Control Panel — 35% width */}
        <div className="flex-[0_0_35%] min-w-0 h-full">
          <TheoryPanel />
        </div>
      </main>

      {/* Quiz modal overlay */}
      {showQuiz && <Quiz />}

      {/* Certificate modal overlay */}
      {showCertificate && <Certificate />}
    </div>
  );
}
