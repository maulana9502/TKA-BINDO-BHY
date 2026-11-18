import React, { useState } from 'react';
import { Check, Copy, MapPin, Swords, Users, X } from 'lucide-react';
import type { PlayerProfile, RemotePlayer } from '../types/game';

interface OnlinePlayersDrawerProps {
  open: boolean;
  onClose: () => void;
  localProfile: PlayerProfile;
  localPos: { x: number; z: number };
  localLevel: number;
  localCompleted: number;
  remotePlayers: RemotePlayer[];
  onVisitPlayer: (player: RemotePlayer) => void;
  onChallengePlayer?: (player: RemotePlayer) => void;
}

export const OnlinePlayersDrawer: React.FC<OnlinePlayersDrawerProps> = ({
  open,
  onClose,
  localProfile,
  localPos,
  localLevel,
  localCompleted,
  remotePlayers,
  onVisitPlayer,
  onChallengePlayer,
}) => {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const sorted = [...remotePlayers].sort((a, b) => {
    const da = Math.hypot(a.x - localPos.x, a.z - localPos.z);
    const db = Math.hypot(b.x - localPos.x, b.z - localPos.z);
    return da - db;
  });

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-sm h-full bg-slate-900 border-l border-white/10 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Pemain Online ({remotePlayers.length + 1})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup daftar pemain"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-3">
          {/* Self Card */}
          <div className="p-3.5 rounded-xl bg-sky-500/15 border border-sky-400/35 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {localProfile.name} (Kamu)
                </p>
                <p className="text-xs text-sky-200 truncate">
                  {localProfile.className} · {localProfile.school}
                </p>
              </div>
              <span className="font-mono-tabular text-xs font-semibold text-amber-300 shrink-0">
                Lv.{localLevel} · {localCompleted}/11
              </span>
            </div>

            <button
              onClick={handleCopyInvite}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-900/70 hover:bg-slate-900 border border-sky-400/30 text-sky-200 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Tautan Kota Disalin!' : 'Salin Tautan Ajak Teman ke Kota Ini'}
            </button>
          </div>

          {sorted.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-800/60 border border-white/5 text-center">
              <p className="text-sm font-medium text-slate-200">
                Belum ada teman lain di peta saat ini
              </p>
              <p className="text-xs text-slate-400 mt-1.5">
                Bagikan tautan aplikasi ini agar teman satu kelas atau sekolah lain langsung bertemu di kota 3D yang sama.
              </p>
            </div>
          ) : (
            sorted.map((rp) => {
              const distMeters = Math.round(Math.hypot(rp.x - localPos.x, rp.z - localPos.z));
              return (
                <div
                  key={rp.id}
                  className="p-3.5 rounded-xl bg-slate-800/80 border border-white/10 space-y-2.5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <p className="text-sm font-semibold text-white truncate">{rp.name}</p>
                    </div>
                    <p className="text-xs text-slate-300 truncate mt-0.5">
                      {rp.className} · {rp.school}
                    </p>
                    <p className="font-mono-tabular text-xs text-emerald-300 mt-1">
                      Jarak {distMeters} m · Lv.{rp.level} · Bab {rp.completedCount}/11
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onVisitPlayer(rp);
                        onClose();
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Samperin
                    </button>
                    {onChallengePlayer && (
                      <button
                        onClick={() => {
                          onChallengePlayer(rp);
                          onClose();
                        }}
                        className="flex-1 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        Adu 1v1
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
