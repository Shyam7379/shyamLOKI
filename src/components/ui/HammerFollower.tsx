import { useEffect, useRef, useState } from 'react';
import './HammerFollower.css';

/**
 * HammerFollower — Mjölnir cursor companion
 *
 * Requirements:
 * 1. Follows the cursor smoothly when moving.
 * 2. When the cursor is kept still, randomly revolves around the Loki cursor.
 * 3. As soon as the cursor moves again, seamlessly returns to trailing/following.
 * 4. Responds to clicks with a quick kinetic pulse.
 * 5. Respects touch screens and reduced-motion preferences.
 */
export function HammerFollower() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Disable on touch devices and if visitor prefers reduced motion
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    setIsEnabled(true);
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const container = containerRef.current;
    const body = bodyRef.current;
    if (!container || !body) return;

    // Mouse tracking state
    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let vx = 0;
    let vy = 0;

    let isVisible = false;
    let isMoving = false;
    let stillWeight = 0; // 0 = fully moving/following, 1 = fully revolving
    let lastMoveTime = performance.now();

    // Orbital parameters
    let orbitAngle = 0;
    let hammerRotation = 0;
    const baseRadius = 48; // comfortable distance around Loki's 32px head

    // Frame tracking
    let animationFrameId: number;
    let strikeTimeout: ReturnType<typeof setTimeout> | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (!isVisible) {
        isVisible = true;
        currentX = x + 28;
        currentY = y + 20;
        container.classList.add('hammer-follower--active');
      }

      const dx = x - mouseX;
      const dy = y - mouseY;
      const dist = Math.hypot(dx, dy);

      if (dist > 1.2) {
        lastMoveTime = performance.now();
        isMoving = true;
      }

      mouseX = x;
      mouseY = y;
    };

    const handlePointerDown = () => {
      if (!isVisible) return;
      container.classList.remove('hammer-follower--strike');
      // trigger reflow to restart animation if already active
      void container.offsetWidth;
      container.classList.add('hammer-follower--strike');

      if (strikeTimeout) clearTimeout(strikeTimeout);
      strikeTimeout = setTimeout(() => {
        container.classList.remove('hammer-follower--strike');
      }, 240);
    };

    const handlePointerLeave = () => {
      isVisible = false;
      container.classList.remove('hammer-follower--active');
    };

    const handlePointerEnter = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isVisible = true;
      container.classList.add('hammer-follower--active');
    };

    const handleBlur = () => {
      isVisible = false;
      container.classList.remove('hammer-follower--active');
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('pointerenter', handlePointerEnter);
    window.addEventListener('blur', handleBlur);

    // Main animation loop
    let lastFrameTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now;

      // Check if cursor has become still
      const timeSinceMove = now - lastMoveTime;
      if (timeSinceMove > 140) {
        isMoving = false;
      }

      // Smoothly blend between moving and revolving states
      if (isMoving) {
        stillWeight = Math.max(0, stillWeight - 0.14); // rapid transition to following
      } else {
        stillWeight = Math.min(1, stillWeight + 0.04); // gentle glide into orbit
      }

      // Calculate smoothed mouse velocity
      const dMouseX = mouseX - prevMouseX;
      const dMouseY = mouseY - prevMouseY;
      vx += (dMouseX - vx) * 0.25;
      vy += (dMouseY - vy) * 0.25;
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      const speed = Math.hypot(vx, vy);

      // ── MODE 1: Following Target ──────────────────────────────────────────
      // Loki cursor hotspot is at (3, 3), head is ~32x32px.
      // When moving, Mjölnir trails behind the movement vector.
      const trailMagnitude = Math.min(speed * 3.5 + 24, 52);
      let trailOffsetX = 24;
      let trailOffsetY = 24;

      if (speed > 0.5) {
        const normX = vx / speed;
        const normY = vy / speed;
        trailOffsetX = -normX * trailMagnitude;
        trailOffsetY = -normY * trailMagnitude;
      }

      const followTargetX = mouseX + trailOffsetX;
      const followTargetY = mouseY + trailOffsetY;

      // ── MODE 2: Randomly Revolving around Loki ────────────────────────────
      // Loki head center is around (mouseX + 14, mouseY + 14)
      const lokiCenterX = mouseX + 14;
      const lokiCenterY = mouseY + 14;

      // Compound multi-frequency harmonics for organic, lively orbital motion
      const rX = baseRadius + Math.sin(now * 0.0023) * 14 + Math.cos(now * 0.0041) * 8;
      const rY = (baseRadius * 0.82) + Math.cos(now * 0.0019) * 12 + Math.sin(now * 0.0037) * 7;

      // Dynamic orbital speed variation (surges and eases organically)
      const speedMod = 1 + 0.38 * Math.sin(now * 0.0018) + 0.22 * Math.cos(now * 0.0031);
      const orbitAngularSpeed = 3.6 * speedMod; // radians per second
      orbitAngle += orbitAngularSpeed * dt;

      // Subtle dynamic 3D tilt of the orbit plane over time
      const orbitTilt = Math.sin(now * 0.0009) * 0.42;
      const rawOrbX = Math.cos(orbitAngle) * rX;
      const rawOrbY = Math.sin(orbitAngle) * rY;

      const tiltCos = Math.cos(orbitTilt);
      const tiltSin = Math.sin(orbitTilt);
      const orbitTargetX = lokiCenterX + (rawOrbX * tiltCos - rawOrbY * tiltSin);
      const orbitTargetY = lokiCenterY + (rawOrbX * tiltSin + rawOrbY * tiltCos);

      // ── BLEND TARGETS ─────────────────────────────────────────────────────
      const targetX = followTargetX * (1 - stillWeight) + orbitTargetX * stillWeight;
      const targetY = followTargetY * (1 - stillWeight) + orbitTargetY * stillWeight;

      // Inertial spring-lerp for buttery motion
      const lerpSpeed = isMoving ? 0.22 : 0.16;
      currentX += (targetX - currentX) * lerpSpeed;
      currentY += (targetY - currentY) * lerpSpeed;

      // ── ORIENTATION: HEAD POINTS DIRECTLY TO CURSOR (NO SPINNING) ─────────
      // The hammer head is at the top of the image.
      // Vector from hammer center to cursor / Loki target:
      const toTargetX = lokiCenterX - currentX;
      const toTargetY = lokiCenterY - currentY;
      const distToTarget = Math.hypot(toTargetX, toTargetY);

      if (distToTarget > 4) {
        // Calculate angle pointing to the cursor (adding 90° because head is at top)
        const targetAngle = (Math.atan2(toTargetY, toTargetX) * 180 / Math.PI) + 90;

        // Shortest-angle difference to prevent unwanted 360° spinning flips
        let diff = (targetAngle - hammerRotation) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        // Smoothly orient head towards cursor without rotating/spinning
        hammerRotation += diff * 0.24;
      }

      // ── PSEUDO-3D DEPTH SCALING ───────────────────────────────────────────
      const depth = Math.sin(orbitAngle);
      const orbitDepthScale = 0.88 + (depth + 1) * 0.12; // 0.88 behind, 1.12 in front
      const targetScale = 1 * (1 - stillWeight) + orbitDepthScale * stillWeight;
      const targetOpacity = 1 * (1 - stillWeight) + (0.85 + (depth + 1) * 0.075) * stillWeight;

      // Update orbital aura class
      if (stillWeight > 0.6) {
        container.classList.add('hammer-follower--orbiting');
      } else {
        container.classList.remove('hammer-follower--orbiting');
      }

      // Apply transforms via GPU-accelerated translate3d
      // Center the 32x48 follower element on currentX, currentY
      const renderX = currentX - 16;
      const renderY = currentY - 24;

      container.style.transform = `translate3d(${renderX.toFixed(1)}px, ${renderY.toFixed(1)}px, 0)`;
      body.style.transform = `scale(${targetScale.toFixed(2)}) rotate(${hammerRotation.toFixed(1)}deg)`;
      body.style.opacity = targetOpacity.toFixed(2);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (strikeTimeout) clearTimeout(strikeTimeout);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerEnter);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div
      ref={containerRef}
      className="hammer-follower"
      aria-hidden="true"
    >
      <div ref={bodyRef} className="hammer-follower__body">
        <img
          src="/hammer.png"
          alt=""
          className="hammer-follower__img"
          draggable={false}
          width={32}
          height={48}
        />
      </div>
    </div>
  );
}
