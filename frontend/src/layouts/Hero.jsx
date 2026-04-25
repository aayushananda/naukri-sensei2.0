import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

export default function Hero() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    const termLines = gsap.utils.toArray('.term-line');
    const overlay = document.getElementById('terminal-overlay');

    // Terminal sequence
    termLines.forEach((line, i) => {
      tl.to(line, { opacity: 1, duration: 0.01 }, i * 0.18);
    });

    // Wipe overlay and reveal hero
    tl.to(overlay, {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 0.7,
      ease: 'power4.in',
      delay: 0.3
    })
    .set(overlay, { display: 'none' })
    .to('#hero', { opacity: 1, duration: 0.01 })
    .call(runHeroIntro);

    function runHeroIntro() {
      const hero = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Left panel
      hero
        .to('.status-bar', { opacity: 1, y: 0, duration: 0.6 }, 0)
        .to('.hero-tag', { opacity: 1, y: 0, duration: 0.6 }, 0.1)
        .to('.headline-word', {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power4.out',
          from: { opacity: 0, y: 80 }
        }, 0.2)
        .to('.hero-sub', { opacity: 1, y: 0, duration: 0.7 }, 0.6)
        .to('.hero-bottom', { opacity: 1, y: 0, duration: 0.6 }, 0.8)

      // Right panel
        .to('.right-top', { opacity: 1, duration: 0.6 }, 0.3)
        .to('.big-number', { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.4)
        .to('.stat-grid', { opacity: 1, duration: 0.5 }, 0.5)
        .call(countUpStats, null, 0.7);

      // Subtly hover headline
      gsap.to('.hero-headline', {
        y: -8,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2
      });
    }

    function countUpStats() {
      document.querySelectorAll('.stat-value').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const isDecimal = String(target).includes('.');
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function() {
            el.textContent = isDecimal
              ? this.targets()[0].val.toFixed(1)
              : Math.floor(this.targets()[0].val);
          }
        });
      });
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
      <style>{`
        /* Terminal Overlay */
        #terminal-overlay {
          position: fixed;
          inset: 0;
          background: #000;
          z-index: 100;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 80px;
          font-family: var(--font-mono);
        }

        .term-line {
          font-size: clamp(11px, 1.2vw, 14px);
          color: #f4f2ee;
          opacity: 0;
          margin-bottom: 6px;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .term-line .prompt { color: #555; }
        .term-line .cmd { color: #f4f2ee; }
        .term-line .output { color: #888; }
        .term-line .ok { color: #d4d4d4; }
        .term-line .warn { color: #aaa; }

        #term-cursor {
          display: inline-block;
          width: 8px; height: 14px;
          background: #f4f2ee;
          vertical-align: middle;
          animation: blink 0.7s step-end infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }

        /* High Contrast Hero Container */
        #hero {
          opacity: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 90vh;
          margin: 20px;
          border: 4px solid #000;
          border-radius: 24px;
          overflow: hidden;
          background: #fff;
          box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
        }

        @media (max-width: 900px) {
          #hero {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
            min-height: auto;
          }
        }

        /* Left side - Black */
        .hero-left {
          background: #000;
          color: #fff;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          position: relative;
        }

        .status-bar {
          position: absolute;
          top: 40px; left: 60px;
          display: flex;
          align-items: center;
          gap: 16px;
          transform: translateY(20px); opacity: 0;
        }
        .status-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #fff;
          animation: pulse-dot 2s ease infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        .status-text {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.15em;
          color: #aaa;
          text-transform: uppercase;
        }

        .hero-tag {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.25em;
          color: #aaa;
          text-transform: uppercase;
          margin-bottom: 24px;
          transform: translateY(20px); opacity: 0;
        }

        .hero-headline {
          font-family: 'DM Sans', 'Inter', sans-serif;
          font-weight: 800;
          font-size: clamp(60px, 8vw, 120px);
          line-height: 0.9;
          letter-spacing: -0.02em;
          color: #fff;
        }
        .headline-line { display: block; overflow: hidden; }
        .headline-word { display: inline-block; transform: translateY(80px); opacity: 0; }

        .hero-sub {
          margin-top: 40px;
          font-size: 16px;
          line-height: 1.6;
          color: #ccc;
          max-width: 360px;
          font-weight: 400;
          transform: translateY(20px); opacity: 0;
        }

        .hero-bottom {
          margin-top: 60px;
          display: flex;
          align-items: center;
          gap: 40px;
          transform: translateY(20px); opacity: 0;
        }

        .btn-primary {
          background: #fff;
          color: #000;
          font-family: var(--font-mono);
          font-weight: bold;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 16px 32px;
          border-radius: 8px;
          border: 2px solid #fff;
          transition: transform 0.2s, background 0.3s, color 0.3s;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .btn-primary:active {
          transform: scale(0.95);
        }
        .btn-primary:hover {
          background: #000;
          color: #fff;
        }

        .scroll-hint {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.2em;
          color: #777;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .scroll-hint::before {
          content: '';
          width: 40px; height: 1px;
          background: #777;
        }

        /* Right side - White */
        .hero-right {
          background: #fff;
          color: #000;
          display: flex;
          flex-direction: column;
          padding: 60px;
          position: relative;
        }

        .big-number {
          position: absolute;
          bottom: 20px; right: 20px;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: clamp(120px, 18vw, 240px);
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 2px rgba(0,0,0,0.05);
          pointer-events: none;
          z-index: 0;
          opacity: 0;
        }

        .right-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          transform: translateY(20px); opacity: 0;
          z-index: 2;
        }

        .sys-id {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.2em;
          color: #555;
          text-transform: uppercase;
          line-height: 1.8;
          font-weight: bold;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          opacity: 0;
          margin-top: auto;
          z-index: 2;
        }

        .stat-item {
          background: #fff;
          border: 3px solid #000;
          border-radius: 12px;
          padding: 28px 24px;
          position: relative;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 4px 4px 0px 0px #000;
        }
        .stat-item:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px 0px #000;
        }

        .stat-label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.15em;
          color: #555;
          text-transform: uppercase;
          margin-bottom: 12px;
          font-weight: bold;
        }
        .stat-value {
          font-family: 'Inter', sans-serif;
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #000;
          line-height: 1;
        }
        .stat-unit {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #777;
          letter-spacing: 0.1em;
          margin-top: 8px;
          font-weight: bold;
        }
      `}</style>
      
      {/* Terminal Overlay */}
      <div id="terminal-overlay">
        <div className="term-line" id="tl-0"><span className="prompt">system@init:~$ </span><span className="cmd">boot --sequence hero</span></div>
        <div className="term-line" id="tl-1"><span className="output">▸ Initializing runtime environment.............. </span><span className="ok">[OK]</span></div>
        <div className="term-line" id="tl-2"><span className="output">▸ Loading asset manifest................... </span><span className="ok">[OK]</span></div>
        <div className="term-line" id="tl-3"><span className="output">▸ Injecting motion engine (GSAP 3.12.5)........ </span><span className="ok">[OK]</span></div>
        <div className="term-line" id="tl-4"><span className="output">▸ Calibrating magnetic cursor................... </span><span className="ok">[OK]</span></div>
        <div className="term-line" id="tl-5"><span className="output">▸ Mounting UI components................... </span><span className="ok">[OK]</span></div>
        <div className="term-line" id="tl-6"><span className="warn">▸ WARNING: High intensity animations detected</span></div>
        <div className="term-line" id="tl-7"><span className="output">▸ Building visual layer......................... </span><span className="ok">[DONE]</span></div>
        <div className="term-line" id="tl-8">&nbsp;</div>
        <div className="term-line" id="tl-9"><span className="prompt">system@init:~$ </span><span className="cmd">exec ./hero.sh</span></div>
        <div className="term-line" id="tl-10"><span className="ok">✓ All systems nominal. Launching interface...</span></div>
        <div className="term-line" id="tl-11"><span id="term-cursor"></span></div>
      </div>

      {/* Hero Content */}
      <div id="hero">
        <div className="hero-left">
          <div className="status-bar">
            <div className="status-dot"></div>
            <div className="status-text">SYS // ONLINE — BUILD 2.4.1</div>
          </div>

          <div className="hero-tag">// INTERFACE SYSTEM v2.4</div>

          <div className="hero-headline">
            <span className="headline-line"><span className="headline-word"></span></span>
            <span className="headline-line"><span className="headline-word">Naukri</span></span>
            <span className="headline-line"><span className="headline-word">Sensei</span></span>
          </div>

          <p className="hero-sub">
            A terminal-born interface for the ones who refuse to wait. 
            Systems that move at the speed of thought.
          </p>

          <div className="hero-bottom">
            <button className="btn-primary magnetic">
              <span>Initialize</span>
              <span>→</span>
            </button>
            <div className="scroll-hint">Scroll to explore</div>
          </div>
        </div>

        <div className="hero-right">
          <div className="big-number">01</div>
          
          <div className="right-top">
            <div className="sys-id">
              NODE_ID // 0x4A2F<br/>
              STATUS // ACTIVE<br/>
              REGION // PRIMARY
            </div>
          </div>

          <div className="stat-grid">
            <div className="stat-item magnetic">
              <div className="stat-label">// Latency</div>
              <div className="stat-value" data-target="0.3">0</div>
              <div className="stat-unit">ms response</div>
            </div>
            <div className="stat-item magnetic">
              <div className="stat-label">// Uptime</div>
              <div className="stat-value" data-target="99.9">0</div>
              <div className="stat-unit">% availability</div>
            </div>
            <div className="stat-item magnetic">
              <div className="stat-label">// Sessions</div>
              <div className="stat-value" data-target="2847">0</div>
              <div className="stat-unit">active nodes</div>
            </div>
            <div className="stat-item magnetic">
              <div className="stat-label">// Build</div>
              <div className="stat-value" data-target="2.4">0</div>
              <div className="stat-unit">version stable</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
