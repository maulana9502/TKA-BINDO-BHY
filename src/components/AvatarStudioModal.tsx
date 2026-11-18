import React, { useState } from 'react';
import { Palette, Sparkles, X } from 'lucide-react';
import type { AvatarConfig, CompanionType, FaceExpression, HairStyle } from '../types/game';

interface AvatarStudioModalProps {
  open: boolean;
  onClose: () => void;
  avatar: AvatarConfig;
  onSave: (next: AvatarConfig) => void;
}

const SKIN_COLORS = ['#f8d9c6', '#f1c27d', '#e0ac69', '#c68642', '#8d5524'];
const SHIRT_COLORS = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', '#0891b2', '#0f172a', '#db2777'];
const PANTS_COLORS = ['#1e293b', '#1d4ed8', '#334155', '#3f6212', '#4c1d95', '#0f172a'];
const HAIR_COLORS = ['#0f172a', '#451a03', '#78350f', '#b45309', '#be123c', '#0284c7'];
const COMPANION_COLORS = ['#fbbf24', '#38bdf8', '#34d399', '#f472b6', '#a78bfa', '#fb7185'];

const HAIR_STYLES: { id: HairStyle; label: string }[] = [
  { id: 'neat', label: 'Rambut Rapi' },
  { id: 'cap', label: 'Topi Sekolah' },
  { id: 'headset', label: 'Headset Gaming' },
  { id: 'crown', label: 'Mahkota Juara' },
  { id: 'peci', label: 'Peci Nusantara' },
  { id: 'beanie', label: 'Kupluk Hangat' },
];

const EXPRESSIONS: { id: FaceExpression; label: string }[] = [
  { id: 'smile', label: 'Senyum Ramah' },
  { id: 'focus', label: 'Fokus Belajar' },
  { id: 'cool', label: 'Kacamata Keren' },
  { id: 'excited', label: 'Semangat Juara' },
];

const COMPANIONS: { id: CompanionType; label: string; desc: string }[] = [
  { id: 'garuda', label: 'Garuda Mini', desc: 'Elang emas penjaga literasi' },
  { id: 'robot', label: 'Robot Pustaka', desc: 'Asisten pintar berlensa biru' },
  { id: 'cat', label: 'Kucing Cerdas', desc: 'Kucing lincah sahabat pembaca' },
  { id: 'dragon', label: 'Naga Aksara', desc: 'Naga kecil penjaga kata' },
];

export const AvatarStudioModal: React.FC<AvatarStudioModalProps> = ({
  open,
  onClose,
  avatar,
  onSave,
}) => {
  const [draft, setDraft] = useState<AvatarConfig>(avatar);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div
        className="w-full max-w-xl max-h-[90dvh] rounded-2xl bg-slate-900 border border-white/15 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">Studio Avatar & Pendamping</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup studio avatar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scroll p-5 space-y-5">
          {/* Skin */}
          <div>
            <p className="text-xs font-semibold text-slate-300 mb-2">Warna Kulit</p>
            <div className="flex flex-wrap gap-2.5">
              {SKIN_COLORS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setDraft((p) => ({ ...p, skinColor: hex }))}
                  style={{ backgroundColor: hex }}
                  className={`w-9 h-9 rounded-xl border-2 transition-transform ${
                    draft.skinColor === hex ? 'border-sky-400 scale-110' : 'border-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Expression */}
          <div>
            <p className="text-xs font-semibold text-slate-300 mb-2">Ekspresi Wajah</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EXPRESSIONS.map((exp) => (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => setDraft((p) => ({ ...p, expression: exp.id }))}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    draft.expression === exp.id
                      ? 'bg-sky-500/25 border-sky-400 text-sky-200'
                      : 'bg-slate-800 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  {exp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hair / Hat */}
          <div>
            <p className="text-xs font-semibold text-slate-300 mb-2">Gaya Rambut & Topi</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2.5">
              {HAIR_STYLES.map((hs) => (
                <button
                  key={hs.id}
                  type="button"
                  onClick={() => setDraft((p) => ({ ...p, hairStyle: hs.id }))}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    draft.hairStyle === hs.id
                      ? 'bg-sky-500/25 border-sky-400 text-sky-200'
                      : 'bg-slate-800 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  {hs.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {HAIR_COLORS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setDraft((p) => ({ ...p, hairColor: hex }))}
                  style={{ backgroundColor: hex }}
                  className={`w-7 h-7 rounded-lg border-2 ${
                    draft.hairColor === hex ? 'border-white scale-110' : 'border-white/15'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Shirt & Pants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-300 mb-2">Warna Baju</p>
              <div className="flex flex-wrap gap-2">
                {SHIRT_COLORS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => setDraft((p) => ({ ...p, shirtColor: hex }))}
                    style={{ backgroundColor: hex }}
                    className={`w-8 h-8 rounded-lg border-2 ${
                      draft.shirtColor === hex ? 'border-white scale-110' : 'border-white/15'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-300 mb-2">Warna Celana</p>
              <div className="flex flex-wrap gap-2">
                {PANTS_COLORS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => setDraft((p) => ({ ...p, pantsColor: hex }))}
                    style={{ backgroundColor: hex }}
                    className={`w-8 h-8 rounded-lg border-2 ${
                      draft.pantsColor === hex ? 'border-white scale-110' : 'border-white/15'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Companion */}
          <div className="pt-2 border-t border-white/10">
            <p className="text-xs font-semibold text-amber-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Karakter Pendamping Unik
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              {COMPANIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setDraft((p) => ({ ...p, companionType: c.id }))}
                  className={`p-3 rounded-xl text-left border transition-colors ${
                    draft.companionType === c.id
                      ? 'bg-amber-500/20 border-amber-400 text-white'
                      : 'bg-slate-800 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-bold">{c.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{c.desc}</p>
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-slate-300 mb-2">Warna Pendamping</p>
            <div className="flex flex-wrap gap-2">
              {COMPANION_COLORS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setDraft((p) => ({ ...p, companionColor: hex }))}
                  style={{ backgroundColor: hex }}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    draft.companionColor === hex ? 'border-white scale-110' : 'border-white/15'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-3.5 border-t border-white/10 flex items-center justify-end gap-2.5 bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(draft);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold"
          >
            Terapkan Tampilan
          </button>
        </div>
      </div>
    </div>
  );
};
