import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animationFrameId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1, ease: 'power2.out' });
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });
      animationFrameId = requestAnimationFrame(animateRing);
    };

    const addHoverState = () => document.body.classList.add('hovering');
    const removeHoverState = () => document.body.classList.remove('hovering');

    const handleMagneticMove = (e, el) => {
      const strength = 0.35;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      gsap.to(el, {
        x: dx * strength,
        y: dy * strength,
        duration: 0.4,
        ease: 'power2.out'
      });
    };

    const handleMagneticLeave = (el) => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    };

    // Attach global mousemove
    window.addEventListener('mousemove', onMouseMove);
    animateRing();

    // Event delegation for magnetic and hover elements
    const onMouseOverGlobal = (e) => {
      const target = e.target.closest('a, button, .magnetic, .stat-item');
      if (target) {
        addHoverState();
      }
    };

    const onMouseOutGlobal = (e) => {
      const target = e.target.closest('a, button, .magnetic, .stat-item');
      if (target) {
        removeHoverState();
      }
    };

    const onMouseMoveGlobal = (e) => {
      const target = e.target.closest('.magnetic');
      if (target) {
        handleMagneticMove(e, target);
      }
    };

    const onMouseLeaveGlobalCapture = (e) => {
      // Need to capture leave events on magnetic elements
      if (e.target && e.target.classList && e.target.classList.contains('magnetic')) {
         handleMagneticLeave(e.target);
      }
    };

    document.addEventListener('mouseover', onMouseOverGlobal);
    document.addEventListener('mouseout', onMouseOutGlobal);
    document.addEventListener('mousemove', onMouseMoveGlobal);
    document.addEventListener('mouseleave', onMouseLeaveGlobalCapture, true); 

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('mouseover', onMouseOverGlobal);
      document.removeEventListener('mouseout', onMouseOutGlobal);
      document.removeEventListener('mousemove', onMouseMoveGlobal);
      document.removeEventListener('mouseleave', onMouseLeaveGlobalCapture, true);
      removeHoverState();
    };
  }, []);

  return (
    <>
      <style>{`
        body.hovering #cursor { width: 6px; height: 6px; background: transparent; }
        body.hovering #cursor-ring { width: 60px; height: 60px; }
        .magnetic { cursor: none !important; }
        
        /* Cursor Base Styles */
        #cursor {
          position: fixed;
          top: 0; left: 0;
          width: 14px; height: 14px;
          background: #000;
          border: 2px solid #fff;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: width 0.2s, height 0.2s, background 0.2s;
        }
        #cursor-ring {
          position: fixed;
          top: 0; left: 0;
          width: 40px; height: 40px;
          border: 2px solid #000;
          box-shadow: 0 0 0 2px #fff;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
          transition: width 0.2s, height 0.2s, background 0.2s;
        }
      `}</style>
      <div id="cursor" ref={cursorRef}></div>
      <div id="cursor-ring" ref={ringRef}></div>
    </>
  );
}
