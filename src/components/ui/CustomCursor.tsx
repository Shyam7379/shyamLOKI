import { useEffect, useRef, useState } from 'react';
import { Mjolnir } from './Mjolnir';
import './custom-cursor.css';

/**
 * CustomCursor — renders Loki as the primary upright cursor, with Mjolnir
 * pursuing and attacking Loki dynamically based on cursor movement:
 *
 * Attack Mechanics:
 * - Moving RIGHT  → Mjolnir attacks from the LEFT (charging rightward at Loki).
 * - Moving LEFT   → Mjolnir attacks from the RIGHT (charging leftward at Loki).
 * - Moving DOWN   → Mjolnir attacks from UP (diving downward to strike Loki).
 * - Moving UP     → Mjolnir attacks from DOWN (surging upward from below).
 *
 * - Hammerhead Aim: The striking face of Mjolnir is always aimed directly at Loki.
 * - Smooth Orbit Transitions: When switching movement directions, Mjolnir sweeps
 *   in a fluid arc around Loki to re-align its attack vector rather than snapping.
 * - Strike Lunge: Rhythmic attack lunges during movement, and gentle menacing hover when idle.
 */
export function CustomCursor() {
  const lokiRef = useRef<HTMLDivElement>(null);
  const mjolnirRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Only enable on devices that have a fine mouse/trackpad pointer
    const mq = window.matchMedia('(pointer: fine)');
    if (!mq.matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let lastClientX = -100;
    let lastClientY = -100;
    let hasMoved = false;

    // Filtered mouse velocity to determine attack vector
    let mouseVx = 0;
    let mouseVy = 0;

    // Dynamic attack offset (smoothly transitions between Up / Down / Left / Right)
    let currentOffsetX = 32;
    let currentOffsetY = -14;
    let targetOffsetX = 32;
    let targetOffsetY = -14;

    // Mjolnir position and rotation state
    let mjolnirX = -100;
    let mjolnirY = -100;
    let currentAngle = -15;

    let isAttacking = false;
    let isMouseDown = false;
    let animId: number;

    const onMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        lastClientX = clientX;
        lastClientY = clientY;
        mouseX = clientX;
        mouseY = clientY;
        mjolnirX = clientX + 32;
        mjolnirY = clientY - 14;
        setVisible(true);
        return;
      }

      // Calculate instantaneous delta
      const dx = clientX - lastClientX;
      const dy = clientY - lastClientY;
      lastClientX = clientX;
      lastClientY = clientY;

      // Low-pass filter for smooth velocity vector
      mouseVx += (dx - mouseVx) * 0.45;
      mouseVy += (dy - mouseVy) * 0.45;

      mouseX = clientX;
      mouseY = clientY;
    };

    const onMouseDown = () => {
      isMouseDown = true;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onEnter = () => {
      if (hasMoved) setVisible(true);
    };

    const onLeave = () => {
      setVisible(false);
    };

    const onOverInteractive = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor-pointer]'
      );
      setIsPointer(!!interactive);
    };

    // Physics render loop
    const renderLoop = (time: number) => {
      if (hasMoved) {
        // Natural velocity decay when mouse pauses
        mouseVx *= 0.88;
        mouseVy *= 0.88;
        const speed = Math.hypot(mouseVx, mouseVy);

        // ── 1. Loki Cursor (Always crisp, straight, and upright) ───────────
        if (lokiRef.current) {
          lokiRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }

        // ── 2. Determine Attack Origin Based on Movement Direction ─────────
        // Cardinal direction analysis:
        // Moving right -> attack from left (-X)
        // Moving left  -> attack from right (+X)
        // Moving down  -> attack from top (-Y)
        // Moving up    -> attack from bottom (+Y)
        if (speed > 0.8) {
          const absX = Math.abs(mouseVx);
          const absY = Math.abs(mouseVy);

          // Attack distance: dynamically scales with speed (36px to 58px)
          const attackDist = 36 + Math.min(speed * 1.5, 22);

          if (absX >= absY * 0.85 && absX > 1.2) {
            // Primarily Horizontal Attack
            if (mouseVx > 0) {
              // Moving RIGHT → Attack from LEFT
              targetOffsetX = -attackDist;
              targetOffsetY = -4; // slight vertical elevation
            } else {
              // Moving LEFT → Attack from RIGHT
              targetOffsetX = attackDist;
              targetOffsetY = -4;
            }
          } else if (absY > 1.2) {
            // Primarily Vertical Attack
            if (mouseVy > 0) {
              // Moving DOWN → Attack from UP (diving down on Loki)
              targetOffsetX = 0;
              targetOffsetY = -attackDist - 6;
            } else {
              // Moving UP → Attack from DOWN (striking up at Loki)
              targetOffsetX = 0;
              targetOffsetY = attackDist + 6;
            }
          }
        }

        // Smoothly steer attack offset around Loki in a fluid arc (never snap)
        const steerSpeed = speed > 1.5 ? 0.16 : 0.08;
        currentOffsetX += (targetOffsetX - currentOffsetX) * steerSpeed;
        currentOffsetY += (targetOffsetY - currentOffsetY) * steerSpeed;

        // Dynamic strike lunge pulse while actively chasing
        const strikeLunge = speed > 1.2 ? Math.sin(time * 0.016) * 5 : 0;

        // Mouse click extra strike lunge
        const clickLunge = isMouseDown ? -8 : 0;

        // Idle hovering float wave
        const idleFloat = Math.sin(time * 0.003) * 2.5;

        // Position target for Mjolnir
        const targetMjolnirX = mouseX + currentOffsetX;
        const targetMjolnirY = mouseY + currentOffsetY + idleFloat;

        // Smooth critically damped following
        const followSpeed = speed > 1.5 ? 0.26 : 0.20;
        mjolnirX += (targetMjolnirX - mjolnirX) * followSpeed;
        mjolnirY += (targetMjolnirY - mjolnirY) * followSpeed;

        // ── 3. Aim Hammerhead Directly at Loki (The Attack Point) ───────────
        // Calculate vector from Mjolnir to Loki
        const toLokiX = mouseX - mjolnirX;
        const toLokiY = mouseY - mjolnirY;
        const angleToLokiDeg = Math.atan2(toLokiY, toLokiX) * (180 / Math.PI);

        // In the SVG, 0 deg has head facing up. Adding 90 points the head at Loki!
        const targetHeadAngle = angleToLokiDeg + 90;

        // Shortest arc rotation interpolation
        let angleDiff = (targetHeadAngle - currentAngle) % 360;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;

        const rotEase = speed > 1.2 ? 0.22 : 0.12;
        currentAngle += angleDiff * rotEase;

        // Lunge offset along the attack direction towards Loki
        const distToLoki = Math.hypot(toLokiX, toLokiY);
        let lungeX = 0;
        let lungeY = 0;
        if (distToLoki > 1) {
          const normX = toLokiX / distToLoki;
          const normY = toLokiY / distToLoki;
          const totalLunge = strikeLunge + clickLunge;
          lungeX = normX * totalLunge;
          lungeY = normY * totalLunge;
        }

        // Active attacking state class toggle for lightning aura surge
        const nowAttacking = speed > 2 || isMouseDown;
        if (nowAttacking !== isAttacking) {
          isAttacking = nowAttacking;
          if (mjolnirRef.current) {
            mjolnirRef.current.classList.toggle('is-attacking', isAttacking);
          }
        }

        if (mjolnirRef.current) {
          mjolnirRef.current.style.transform = `translate3d(${mjolnirX + lungeX}px, ${mjolnirY + lungeY}px, 0) rotate(${currentAngle}deg)`;
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseover', onOverInteractive);

    document.body.classList.add('has-custom-cursor');

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseover', onOverInteractive);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      {/* ── Mjolnir Hammer (Attacks & pursues Loki based on movement) ── */}
      <div
        ref={mjolnirRef}
        className={`custom-cursor-mjolnir${visible ? ' is-visible' : ''}`}
        aria-hidden="true"
      >
        <Mjolnir size={36} isCharged={isPointer} />
      </div>

      {/* ── Loki Chibi Primary Cursor (Straight & Upright) ── */}
      <div
        ref={lokiRef}
        className={`custom-cursor-loki${visible ? ' is-visible' : ''}${isPointer ? ' is-pointer' : ''}`}
        aria-hidden="true"
      >
        <img
          src="/media/hero/loki-cursor-transparent.png"
          alt=""
          className="custom-cursor-loki__img"
          draggable={false}
        />
      </div>
    </>
  );
}
