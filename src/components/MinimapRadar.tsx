import React from 'react';
import { CHAPTERS } from '../data/curriculum';
import { VERSUS_BUILDING_POS } from '../game/WorldEngine';
import type { RemotePlayer } from '../types/game';

interface MinimapRadarProps {
  playerPos: { x: number; z: number; rotY: number };
  remotePlayers: RemotePlayer[];
  completedChapters: number[];
  onSelectChapter?: (chapterId: number) => void;
  onSelectVersus?: () => void;
}

export const MinimapRadar: React.FC<MinimapRadarProps> = ({
  playerPos,
  remotePlayers,
  completedChapters,
  onSelectChapter,
  onSelectVersus,
}) => {
  const radarSize = 112;
  const center = radarSize / 2;
  const scale = 0.42;

  const toRadarXY = (wx: number, wz: number) => {
    const dx = (wx - playerPos.x) * scale;
    const dz = (wz - playerPos.z) * scale;
    const dist = Math.hypot(dx, dz);
    const maxR = center - 8;
    const factor = dist > maxR ? maxR / dist : 1;
    return {
      cx: center + dx * factor,
      cy: center + dz * factor,
    };
  };

  const vsPos = toRadarXY(VERSUS_BUILDING_POS.x, VERSUS_BUILDING_POS.z);

  return (
    <div
      className="relative rounded-full bg-slate-950/90 border-2 border-sky-400/50 shadow-2xl overflow-hidden select-none"
      style={{ width: radarSize, height: radarSize }}
      aria-label="Peta Mini Radar Kota"
    >
      <svg width={radarSize} height={radarSize} className="block">
        <circle cx={center} cy={center} r={center - 14} fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="1" />
        <circle cx={center} cy={center} r={center - 32} fill="none" stroke="rgba(148,163,184,0.14)" strokeWidth="1" />
        <line x1={center} y1={4} x2={center} y2={radarSize - 4} stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
        <line x1={4} y1={center} x2={radarSize - 4} y2={center} stroke="rgba(148,163,184,0.12)" strokeWidth="1" />

        {/* 11 Chapter Buildings */}
        {CHAPTERS.map((ch) => {
          const { cx, cy } = toRadarXY(ch.buildingPos.x, ch.buildingPos.z);
          const done = completedChapters.includes(ch.id);
          return (
            <g
              key={ch.id}
              onClick={() => onSelectChapter?.(ch.id)}
              className="cursor-pointer"
            >
              <circle
                cx={cx}
                cy={cy}
                r={done ? 4.2 : 3.4}
                fill={done ? '#fbbf24' : '#38bdf8'}
                stroke="#0f172a"
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* Gedung Versus Diamond Marker */}
        <g onClick={() => onSelectVersus?.()} className="cursor-pointer">
          <polygon
            points={`${vsPos.cx},${vsPos.cy - 6} ${vsPos.cx + 6},${vsPos.cy} ${vsPos.cx},${vsPos.cy + 6} ${vsPos.cx - 6},${vsPos.cy}`}
            fill="#f43f5e"
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
        </g>

        {/* Remote Online Players (Green Dots ala GTA) */}
        {remotePlayers.map((rp) => {
          const { cx, cy } = toRadarXY(rp.x, rp.z);
          return (
            <circle
              key={rp.id}
              cx={cx}
              cy={cy}
              r={4}
              fill="#22c55e"
              stroke="#ffffff"
              strokeWidth="1"
            />
          );
        })}

        {/* Local Player Heading Arrow */}
        <g transform={`translate(${center}, ${center}) rotate(${(-playerPos.rotY * 180) / Math.PI + 180})`}>
          <polygon points="0,-7 5,6 0,3 -5,6" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
        </g>
      </svg>

      <div className="absolute bottom-1 inset-x-0 text-center text-[9px] font-bold tracking-wider text-slate-300 pointer-events-none">
        U
      </div>
    </div>
  );
};
