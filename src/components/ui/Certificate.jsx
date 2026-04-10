import { useEffect, useRef } from 'react';
import { useSimStore } from '../../store/useSimStore';
import { getGrade } from '../../data/quizQuestions';

const W = 960;
const H = 680;

function drawCertificate(canvas, name, score, date) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  // ── Background ──────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0,   '#0a0e1a');
  bg.addColorStop(0.4, '#0f1629');
  bg.addColorStop(1,   '#0a1525');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle diagonal grid
  ctx.strokeStyle = 'rgba(79,142,247,0.035)';
  ctx.lineWidth = 1;
  for (let i = -H; i < W + H; i += 44) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + H, H); ctx.stroke();
  }

  // ── Outer gold border ────────────────────────────────────────
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(22, 22, W - 44, H - 44, 20);
  ctx.stroke();

  // ── Inner faint border ───────────────────────────────────────
  ctx.strokeStyle = 'rgba(245,158,11,0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(34, 34, W - 68, H - 68, 14);
  ctx.stroke();

  // ── Corner ornaments ─────────────────────────────────────────
  const corners = [[54,54],[W-54,54],[54,H-54],[W-54,H-54]];
  corners.forEach(([cx,cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(245,158,11,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // ── Small star decorations ────────────────────────────────────
  function star(cx, cy, r) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = 'rgba(245,158,11,0.45)';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const b = (i * 4 * Math.PI) / 5 + (2 * Math.PI) / 5 - Math.PI / 2;
      if (i === 0) ctx.moveTo(r * Math.cos(a), r * Math.sin(a));
      else         ctx.lineTo(r * Math.cos(a), r * Math.sin(a));
      ctx.lineTo((r * 0.4) * Math.cos(b), (r * 0.4) * Math.sin(b));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  [W/2 - 260, W/2 - 130, W/2, W/2 + 130, W/2 + 260].forEach((x) => star(x, 72, 6));

  // ── Issuer ───────────────────────────────────────────────────
  ctx.textAlign = 'center';
  ctx.font = 'bold 13px Arial, sans-serif';
  ctx.fillStyle = '#4f8ef7';
  ctx.letterSpacing = '3px';
  ctx.fillText('THE OPTIMIZER TRAP', W / 2, 105);
  ctx.letterSpacing = '0px';

  // ── "Certificate of Completion" title ─────────────────────────
  ctx.font = 'bold 44px Georgia, serif';
  const titleGrad = ctx.createLinearGradient(W / 2 - 240, 0, W / 2 + 240, 0);
  titleGrad.addColorStop(0, '#d97706');
  titleGrad.addColorStop(0.5, '#fbbf24');
  titleGrad.addColorStop(1, '#d97706');
  ctx.fillStyle = titleGrad;
  ctx.fillText('Certificate of Completion', W / 2, 160);

  // Divider
  const div1Grad = ctx.createLinearGradient(80, 0, W - 80, 0);
  div1Grad.addColorStop(0, 'transparent');
  div1Grad.addColorStop(0.2, '#f59e0b66');
  div1Grad.addColorStop(0.5, '#f59e0b');
  div1Grad.addColorStop(0.8, '#f59e0b66');
  div1Grad.addColorStop(1, 'transparent');
  ctx.strokeStyle = div1Grad;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 178); ctx.lineTo(W - 80, 178); ctx.stroke();

  // ── Presented to ─────────────────────────────────────────────
  ctx.font = 'italic 15px Georgia, serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('This certifies that', W / 2, 214);

  // ── Student name ─────────────────────────────────────────────
  ctx.font = 'bold 40px Georgia, serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(name || 'Student', W / 2, 268);

  // Name underline
  const nw = ctx.measureText(name || 'Student').width;
  const nameGrad = ctx.createLinearGradient(W/2 - nw/2, 0, W/2 + nw/2, 0);
  nameGrad.addColorStop(0, '#4f8ef700');
  nameGrad.addColorStop(0.5, '#4f8ef7');
  nameGrad.addColorStop(1, '#4f8ef700');
  ctx.strokeStyle = nameGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W/2 - nw/2, 278); ctx.lineTo(W/2 + nw/2, 278);
  ctx.stroke();

  // ── Body copy ─────────────────────────────────────────────────
  ctx.font = '14px Arial, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('has successfully mastered the Neural Network Optimizer Challenge', W / 2, 312);
  ctx.fillText('navigating complex loss landscapes across all three simulation levels', W / 2, 332);

  ctx.strokeStyle = 'rgba(245,158,11,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 352); ctx.lineTo(W - 80, 352); ctx.stroke();

  // ── Level badges ──────────────────────────────────────────────
  const grade = getGrade(score);
  const badges = [
    { emoji: '🏔️', title: 'Level 1', sub: 'Saddle Point', x: W/2 - 180 },
    { emoji: '🕳️', title: 'Level 2', sub: 'Deep Trap',    x: W/2       },
    { emoji: '🌊', title: 'Level 3', sub: 'Noisy Valley', x: W/2 + 180 },
  ];

  badges.forEach(({ emoji, title, sub, x }) => {
    // Badge ring
    ctx.beginPath();
    ctx.arc(x, 408, 36, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16,185,129,0.1)';
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Checkmark outer glow
    ctx.beginPath();
    ctx.arc(x, 408, 40, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(16,185,129,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Emoji
    ctx.font = '28px serif';
    ctx.textAlign = 'center';
    ctx.fillText(emoji, x, 418);

    // Level text
    ctx.font = 'bold 11px Arial, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(title, x, 462);
    ctx.font = '10px Arial, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(sub, x, 476);
  });

  // ── Score badge ───────────────────────────────────────────────
  const sbx = W / 2;
  const sby = 535;

  ctx.beginPath();
  ctx.roundRect(sbx - 130, sby - 22, 260, 44, 22);
  ctx.fillStyle = 'rgba(79,142,247,0.08)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(79,142,247,0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = 'bold 16px Arial, sans-serif';
  ctx.fillStyle = grade.color;
  ctx.textAlign = 'center';
  ctx.fillText(`Quiz Score: ${score}/10  ·  Grade: ${grade.letter}  ·  ${grade.label}`, sbx, sby + 6);

  // ── Date + watermark ──────────────────────────────────────────
  ctx.font = '12px Arial, sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText(`Issued on ${date}  ·  optimizertrap.edu`, W / 2, 590);

  // Signature line (left)
  ctx.strokeStyle = 'rgba(148,163,184,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 625); ctx.lineTo(260, 625); ctx.stroke();
  ctx.font = '10px Arial, sans-serif';
  ctx.fillStyle = '#475569';
  ctx.textAlign = 'center';
  ctx.fillText('Simulation Engine', 170, 640);

  // Signature line (right)
  ctx.beginPath(); ctx.moveTo(W - 260, 625); ctx.lineTo(W - 80, 625); ctx.stroke();
  ctx.fillText('ML Education Platform', W - 170, 640);
}

export function Certificate() {
  const canvasRef = useRef();
  const closeCertificate = useSimStore((s) => s.closeCertificate);
  const name  = useSimStore((s) => s.certificateName);
  const score = useSimStore((s) => s.quizScore);
  const grade = getGrade(score);

  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    if (canvasRef.current) {
      drawCertificate(canvasRef.current, name, score, date);
    }
  }, [name, score, date]);

  function handleDownload() {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `optimizer-trap-certificate-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(10,14,26,0.96)', backdropFilter: 'blur(16px)' }}
    >
      {/* Glowing blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-amber/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-electric/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl mx-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <h2 className="text-lg font-bold font-[Outfit] text-white">Your Certificate</h2>
              <p className="text-xs text-slate-500">Grade: <span className="font-bold" style={{ color: grade.color }}>{grade.letter} — {grade.label}</span></p>
            </div>
          </div>
          <button
            onClick={closeCertificate}
            className="text-slate-500 hover:text-white text-lg w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-800 transition-colors"
          >✕</button>
        </div>

        {/* Canvas certificate */}
        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-neon-amber/20">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="w-full block"
            style={{ imageRendering: 'crisp-edges' }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-center">
          <button
            id="btn-download-cert"
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-neon-amber to-yellow-300 text-slate-900 hover:opacity-90 transition-opacity shadow-lg shadow-neon-amber/25"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M7 10l5 5m0 0l5-5m-5 5V4" />
            </svg>
            Download Certificate (PNG)
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-electric/40 text-electric hover:bg-electric/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
            </svg>
            Print / Save as PDF
          </button>

          <button
            onClick={closeCertificate}
            className="px-6 py-3 rounded-xl text-sm border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
