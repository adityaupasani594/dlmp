import { useState, useEffect } from 'react';
import { BlockMath } from 'react-katex';
import { QUIZ_QUESTIONS, getGrade } from '../../data/quizQuestions';
import { useSimStore } from '../../store/useSimStore';

const TOTAL = QUIZ_QUESTIONS.length;

// Individual answer option button
function AnswerOption({ text, index, selected, correct, revealed, onClick }) {
  let base = 'w-full text-left px-4 py-3 rounded-xl border text-sm leading-snug transition-all duration-300 font-medium';
  if (!revealed) {
    base += selected === index
      ? ' border-electric/80 bg-electric/15 text-white shadow-md shadow-electric/20'
      : ' border-slate-700/50 bg-slate-800/40 text-slate-300 hover:border-slate-500 hover:bg-slate-800/70';
  } else {
    if (index === correct) {
      base += ' border-neon-green/80 bg-neon-green/10 text-neon-green';
    } else if (index === selected && index !== correct) {
      base += ' border-neon-red/80 bg-neon-red/10 text-neon-red';
    } else {
      base += ' border-slate-800/30 bg-slate-900/30 text-slate-600';
    }
  }

  return (
    <button className={base} onClick={() => !revealed && onClick(index)}>
      <span className="inline-flex items-center gap-3">
        <span className={`
          w-5 h-5 rounded-full border text-[10px] flex items-center justify-center shrink-0 font-mono
          ${revealed && index === correct ? 'border-neon-green text-neon-green' :
            revealed && index === selected && index !== correct ? 'border-neon-red text-neon-red' :
            'border-slate-600 text-slate-500'}
        `}>
          {revealed
            ? index === correct ? '✓' : index === selected ? '✗' : String.fromCharCode(65 + index)
            : String.fromCharCode(65 + index)}
        </span>
        {text}
      </span>
    </button>
  );
}

// Results screen
function ResultsScreen({ score, onViewCert, onClose }) {
  const grade = getGrade(score);
  const passed = score >= 3;  // 3/5 = 60% pass threshold
  const [name, setName] = useState('');
  const openCertificate = useSimStore((s) => s.openCertificate);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-4">
      {/* Score ring */}
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="50" fill="none"
            stroke={grade.color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / TOTAL)}`}
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-[Outfit]" style={{ color: grade.color }}>
            {score}/{TOTAL}
          </span>
          <span className="text-sm font-bold" style={{ color: grade.color }}>{grade.letter}</span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-[Outfit] text-white mb-1">
          {passed ? '🎓 Quiz Complete!' : '📖 Keep Studying!'}
        </h2>
        <p className="text-slate-400 text-sm">
          {passed
            ? `${grade.label}! You answered ${score} of ${TOTAL} questions correctly.`
            : `You scored ${score}/${TOTAL}. You need at least 3 correct to earn your certificate. Try again!`}
        </p>
      </div>

      {passed && (
        <div className="w-full max-w-sm space-y-3">
          <p className="text-slate-400 text-sm">Enter your name for the certificate:</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name…"
            maxLength={40}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 text-sm outline-none focus:border-electric transition-colors"
          />
          <button
            id="btn-get-cert"
            disabled={!name.trim()}
            onClick={() => { openCertificate(name.trim()); onClose(); }}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-neon-amber to-yellow-400 text-slate-900 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-neon-amber/20"
          >
            🏆 Generate Certificate
          </button>
        </div>
      )}

      {!passed && (
        <button
          onClick={onClose}
          className="py-2.5 px-8 rounded-xl border border-electric/50 text-electric hover:bg-electric/10 text-sm font-semibold transition-all"
        >
          Back to Simulator
        </button>
      )}
    </div>
  );
}

export function Quiz() {
  const finishQuiz = useSimStore((s) => s.finishQuiz);
  const closeQuiz  = useSimStore((s) => s.closeQuiz);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(-1);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState(Array(TOTAL).fill(-1));
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const question = QUIZ_QUESTIONS[currentQ];
  const progress = ((currentQ) / TOTAL) * 100;

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') closeQuiz();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    setSelected(answers[currentQ] ?? -1);
    setRevealed(answers[currentQ] !== -1 && answers[currentQ] >= 0);
  }, [currentQ]);

  function handleSelect(idx) {
    if (revealed) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
    setSelected(idx);
    setRevealed(true);
  }

  function handleNext() {
    if (currentQ < TOTAL - 1) {
      setCurrentQ((q) => q + 1);
      setRevealed(false);
      setSelected(-1);
    } else {
      const finalScore = answers.reduce(
        (acc, ans, i) => acc + (ans === QUIZ_QUESTIONS[i].correct ? 1 : 0), 0
      );
      setScore(finalScore);
      finishQuiz(finalScore);
      setDone(true);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(10,14,26,0.94)', backdropFilter: 'blur(12px)' }}
    >
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-electric/8 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-neon-purple/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric to-neon-purple flex items-center justify-center">
              <span className="text-sm">🧠</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white font-[Outfit]">Final Assessment</h1>
              <p className="text-[10px] text-slate-500">The Optimizer Trap · Knowledge Quiz</p>
            </div>
          </div>
          <button
            onClick={closeQuiz}
            className="text-slate-500 hover:text-white text-lg transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800"
          >✕</button>
        </div>

        {!done && (
          <>
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1.5 font-mono">
                <span>Question {currentQ + 1} of {TOTAL}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-electric to-neon-purple rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question level badge */}
            <div className="mb-1">
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-electric/10 text-electric border border-electric/20">
                Level {question.level} Concept
              </span>
            </div>
          </>
        )}

        {/* Card */}
        <div className="flex-1 overflow-y-auto bg-slate-900/80 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 scrollbar-thin">
          {done ? (
            <ResultsScreen score={score} onClose={closeQuiz} />
          ) : (
            <div className="p-6 space-y-5">
              {/* Question text */}
              <p className="text-base font-semibold text-white leading-snug">{question.question}</p>

              {/* Answer options */}
              <div className="space-y-2.5">
                {question.options.map((opt, i) => (
                  <AnswerOption
                    key={i}
                    text={opt}
                    index={i}
                    selected={selected}
                    correct={question.correct}
                    revealed={revealed}
                    onClick={handleSelect}
                  />
                ))}
              </div>

              {/* Explanation (shown after answering) */}
              {revealed && (
                <div className={`p-3.5 rounded-xl border text-sm leading-relaxed transition-all
                  ${selected === question.correct
                    ? 'bg-neon-green/8 border-neon-green/25 text-slate-300'
                    : 'bg-neon-red/8 border-neon-red/25 text-slate-300'
                  }`}
                >
                  <p className="text-[10px] font-bold mb-1 font-mono tracking-wide uppercase"
                    style={{ color: selected === question.correct ? '#10b981' : '#ef4444' }}>
                    {selected === question.correct ? '✓ Correct' : '✗ Incorrect'} —
                    {selected === question.correct ? ' Great understanding!' : ' Here\'s why:'}
                  </p>
                  <p className="text-slate-400 text-[12px]">{question.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer nav */}
        {!done && (
          <div className="flex justify-between items-center mt-4">
            {/* Dot indicators */}
            <div className="flex gap-1">
              {QUIZ_QUESTIONS.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i < currentQ
                    ? answers[i] === QUIZ_QUESTIONS[i].correct ? 'bg-neon-green' : 'bg-neon-red'
                    : i === currentQ ? 'bg-electric scale-125' : 'bg-slate-700'
                }`} />
              ))}
            </div>

            <button
              id="btn-quiz-next"
              onClick={handleNext}
              disabled={!revealed}
              className="py-2.5 px-6 rounded-xl font-bold text-sm bg-electric/20 border border-electric/50 text-electric hover:bg-electric/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {currentQ < TOTAL - 1 ? 'Next →' : 'See Results →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
