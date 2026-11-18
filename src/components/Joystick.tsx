import React, { useRef, useState } from 'react';

interface JoystickProps {
  onChange: (vec: { x: number; y: number }) => void;
}

export const Joystick: React.FC<JoystickProps> = ({ onChange }) => {
  const baseRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const maxRadius = 40;

  const updateFromClient = (clientX: number, clientY: number) => {
    const el = baseRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    const clamped = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);
    const ox = Math.cos(angle) * clamped;
    const oy = Math.sin(angle) * clamped;

    setKnobOffset({ x: ox, y: oy });
    onChange({
      x: Number((ox / maxRadius).toFixed(3)),
      y: Number((-oy / maxRadius).toFixed(3)),
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    pointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClient(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    e.stopPropagation();
    updateFromClient(e.clientX, e.clientY);
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    e.stopPropagation();
    pointerIdRef.current = null;
    setKnobOffset({ x: 0, y: 0 });
    onChange({ x: 0, y: 0 });
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      role="application"
      aria-label="Kontrol Analog Gerakan Karakter"
      className="relative w-28 h-28 rounded-full bg-slate-900/75 border-2 border-white/25 shadow-xl flex items-center justify-center touch-none select-none cursor-grab active:cursor-grabbing"
    >
      <div className="absolute inset-3 rounded-full border border-white/10 pointer-events-none" />
      <div
        style={{
          transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)`,
        }}
        className="w-12 h-12 rounded-full bg-sky-400 border-2 border-white shadow-lg pointer-events-none transition-transform duration-75 ease-out"
      />
    </div>
  );
};
