import React, { useState } from 'react';
import { ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import smpBhaturBg from '../assets/images/smp_bhatur_bg_1794976223380.jpg';
import yayasanLogo from '../assets/images/yayasan_kemala_logo_transparent.png';
import type { AvatarConfig, CompanionType, PlayerProfile } from '../types/game';

interface LoginModalProps {
  initialProfile: PlayerProfile;
  onStartGame: (profile: PlayerProfile) => void;
  onGoogleLogin: (draftProfile: PlayerProfile) => Promise<void>;
  isGoogleLoading: boolean;
  googleError: string | null;
}

const COMPANION_OPTIONS: { id: CompanionType; label: string }[] = [
  { id: 'garuda', label: 'Garuda Mini' },
  { id: 'robot', label: 'Robot Pustaka' },
  { id: 'cat', label: 'Kucing Cerdas' },
  { id: 'dragon', label: 'Naga Aksara' },
];

const SHIRT_COLORS = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', '#0891b2'];

export const LoginModal: React.FC<LoginModalProps> = ({
  initialProfile,
  onStartGame,
  onGoogleLogin,
  isGoogleLoading,
  googleError,
}) => {
  const [name, setName] = useState(initialProfile.name === 'Siswa' ? '' : initialProfile.name);
  const [school, setSchool] = useState(
    initialProfile.school === 'SMP Nusantara' ? '' : initialProfile.school
  );
  const [className, setClassName] = useState(
    initialProfile.className === 'VIII-A' ? '' : initialProfile.className
  );
  const [avatar, setAvatar] = useState<AvatarConfig>(initialProfile.avatar);
  const [formError, setFormError] = useState<string | null>(null);

  const buildProfile = (): PlayerProfile | null => {
    const cleanName = name.trim();
    const cleanSchool = school.trim();
    const cleanClass = className.trim();
    if (!cleanName || !cleanSchool || !cleanClass) {
      setFormError('Lengkapi Nama, Sekolah, dan Kelas terlebih dahulu.');
      return null;
    }
    setFormError(null);
    return {
      ...initialProfile,
      name: cleanName,
      school: cleanSchool,
      className: cleanClass,
      avatar,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = buildProfile();
    if (p) onStartGame(p);
  };

  const handleGoogleClick = async () => {
    const draft: PlayerProfile = {
      ...initialProfile,
      name: name.trim() || 'Siswa Nusantara',
      school: school.trim() || 'SMP Nusantara',
      className: className.trim() || 'VIII-A',
      avatar,
    };
    await onGoogleLogin(draft);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-950 overflow-y-auto bg-cover bg-center"
      style={{ backgroundImage: `url(${smpBhaturBg})` }}
    >
      {/* Atmospheric readability scrim over school courtyard background */}
      <div className="fixed inset-0 bg-slate-950/60 pointer-events-none" />

      {/* Header Logo Halaman Utama: Yayasan (Pojok Kiri, Kedudukan Lebih Tinggi) & Mau Pintar (Pojok Kanan) — Hilang saat masuk ke dalam kota */}
      <header className="relative z-10 w-full flex items-center justify-between px-4 pt-3 sm:px-6 sm:pt-5 shrink-0">
        <img
          src={yayasanLogo}
          alt="Logo Yayasan Kemala Bhayangkari"
          className="h-14 sm:h-20 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)] select-none"
        />
        <img
          src="/assets/aistudio/logo_maupintar_282e2273.png"
          alt="Logo Mau Pintar Bimbingan Belajar"
          className="h-14 sm:h-20 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)] select-none"
        />
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-slate-900/92 border border-white/20 shadow-2xl p-5 sm:p-6 space-y-4 sm:space-y-5 my-auto">
          <div>
            <p className="text-xs font-semibold text-sky-400 tracking-wide">
              Petualangan 3D TKA Bahasa Indonesia SMP
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Nusantara Bahasa Quest
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5">
              Jelajahi 11 gedung bab materi, Gedung Versus adu 1v1, cuaca lokal langsung, dan kirim refleksi Google Sheet dalam satu kota 3D bersama teman.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Raisa Putri"
                  maxLength={60}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Asal Sekolah
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="Contoh: SMP Bhatur"
                  maxLength={80}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kelas
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Contoh: IX-B"
                  maxLength={30}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="pt-1 space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-300 mb-1.5">
                  Warna Seragam / Jaket
                </p>
                <div className="flex items-center gap-2.5">
                  {SHIRT_COLORS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setAvatar((prev) => ({ ...prev, shirtColor: hex }))}
                      style={{ backgroundColor: hex }}
                      className={`w-8 h-8 rounded-lg border-2 transition-transform ${
                        avatar.shirtColor === hex ? 'border-white scale-110' : 'border-transparent opacity-75'
                      }`}
                      aria-label={`Pilih warna baju ${hex}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Karakter Pendamping Unik
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {COMPANION_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setAvatar((prev) => ({ ...prev, companionType: c.id }))}
                      className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                        avatar.companionType === c.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : 'bg-slate-800 border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {(formError || googleError) && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-400/35 text-xs text-rose-200">
                {formError || googleError}
              </div>
            )}

            <div className="space-y-2.5 pt-1">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                Mulai Petualangan (Progres Otomatis Tersimpan)
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={isGoogleLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm flex items-center justify-center gap-2.5 transition-colors disabled:opacity-60"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                {isGoogleLoading ? 'Menghubungkan Akun Google...' : 'Sign in with Google (Sinkron Cloud & Sheet)'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
