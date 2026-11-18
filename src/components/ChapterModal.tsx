import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Layers,
  PlayCircle,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { audioManager } from '../audio/AudioManager';
import {
  GENERAL_TKA_VIDEOS,
  getYoutubeEmbedUrl,
  INTERIOR_BUILD_REWARDS,
  PUSMENDIK_OFFICIAL_URL,
} from '../data/curriculum';
import {
  getCachedDriveAccessToken,
  saveArchiveToFirestore,
  signInWithGoogleForGame,
  TEACHER_ARCHIVE_EMAIL,
} from '../services/firebase';
import { archiveChapterSheetToGoogleDrive } from '../services/googleDrive';
import type { ArchiveSubmission, ChapterData, ChapterProgress, PlayerProfile } from '../types/game';

interface ChapterModalProps {
  open: boolean;
  initialTab: 'video' | 'quiz' | 'archive';
  chapter: ChapterData | null;
  progress: ChapterProgress;
  profile: PlayerProfile;
  onClose: () => void;
  onExitBuilding: () => void;
  onUpdateProgress: (next: ChapterProgress, earnedXp?: number) => void;
  onProfileGoogleConnected: (uid: string, email: string) => void;
}

export const ChapterModal: React.FC<ChapterModalProps> = ({
  open,
  initialTab,
  chapter,
  progress,
  profile,
  onClose,
  onExitBuilding,
  onUpdateProgress,
  onProfileGoogleConnected,
}) => {
  const [tab, setTab] = useState<'video' | 'quiz' | 'archive'>(initialTab);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>('');
  const [localAnswers, setLocalAnswers] = useState<Record<number, string>>(progress.mcqAnswers || {});
  const [essay, setEssay] = useState<string>(progress.essayAnswer || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  React.useEffect(() => {
    if (open && chapter) {
      setTab(initialTab);
      setSelectedVideoUrl(chapter.videoUrl);
      setSelectedVideoTitle(chapter.videoTitle);
      setLocalAnswers(progress.mcqAnswers || {});
      setEssay(progress.essayAnswer || '');
      setSaveMessage(null);
      setSaveError(null);
    }
  }, [open, chapter?.id, initialTab]);

  if (!open || !chapter) return null;

  const activeVideoUrl = selectedVideoUrl || chapter.videoUrl;
  const activeVideoTitle = selectedVideoTitle || chapter.videoTitle;
  const embedUrl = getYoutubeEmbedUrl(activeVideoUrl);
  const answeredCount = Object.keys(localAnswers).length;
  const unlockedObjectsCount = Math.min(5, Math.floor((progress.mcqScore || 0) / 2));

  const handleSelectOption = (qId: number, key: 'A' | 'B' | 'C' | 'D') => {
    const nextAnswers = { ...localAnswers, [qId]: key };
    setLocalAnswers(nextAnswers);
  };

  const handleGradeMcq = () => {
    let correct = 0;
    for (const q of chapter.questions) {
      if (localAnswers[q.id] === q.answer) correct++;
    }
    const isPassing = correct >= Math.ceil(chapter.questions.length * 0.6);
    const newlyCompleted = isPassing && !progress.completed;
    const earnedXp = newlyCompleted ? 120 + correct * 15 : correct * 5;
    const builtCount = Math.min(5, Math.floor(correct / 2));

    const nextProgress: ChapterProgress = {
      ...progress,
      mcqAnswers: localAnswers,
      mcqScore: correct,
      mcqSubmitted: true,
      essayAnswer: essay,
      completed: progress.completed || isPassing,
    };
    onUpdateProgress(nextProgress, earnedXp);
    audioManager.playSfx(isPassing ? 'success' : 'coin');

    const objectFeedback =
      builtCount > 0
        ? `Kamu berhasil membangun ${builtCount} objek di dalam gedung (${INTERIOR_BUILD_REWARDS.slice(0, builtCount)
            .map((r) => r.name)
            .join(', ')})!`
        : 'Jawab minimal 2 soal benar untuk membangun objek pertama (Karpet Belajar) di dalam gedung!';

    if (isPassing) {
      audioManager.speak(
        `Hebat ${profile.name}! Skor kamu ${correct} dari ${chapter.questions.length} soal di Bab ${chapter.id}. ${objectFeedback} Lampu suar emas gedung menyala!`
      );
    } else {
      audioManager.speak(
        `Skormu ${correct} dari ${chapter.questions.length}. ${objectFeedback}`
      );
    }
  };

  const handleArchiveSheet = async (withGoogleSheet: boolean) => {
    setIsSaving(true);
    setSaveError(null);
    setSaveMessage(null);

    try {
      let correct = 0;
      for (const q of chapter.questions) {
        if (localAnswers[q.id] === q.answer) correct++;
      }
      const isPassing = correct >= Math.ceil(chapter.questions.length * 0.6) || essay.trim().length >= 15;

      let sheetOrFolderLink = progress.driveLink || '';
      if (withGoogleSheet) {
        let token = getCachedDriveAccessToken();
        if (!token) {
          const authRes = await signInWithGoogleForGame();
          token = authRes.accessToken;
          if (authRes.user.uid && authRes.user.email) {
            onProfileGoogleConnected(authRes.user.uid, authRes.user.email);
          }
        }
        if (token) {
          const driveRes = await archiveChapterSheetToGoogleDrive({
            accessToken: token,
            profile,
            chapter,
            chapterProgress: {
              ...progress,
              mcqAnswers: localAnswers,
              mcqScore: correct,
              mcqSubmitted: true,
              essayAnswer: essay,
              completed: progress.completed || isPassing,
            },
          });
          sheetOrFolderLink = driveRes.sheetUrl || driveRes.folderUrl;
        }
      }

      const archiveId = `arch_bab${chapter.id}_${(profile.uid || profile.name).replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}`;
      const submission: ArchiveSubmission = {
        archiveId,
        uid: profile.uid || profile.id,
        studentName: profile.name,
        school: profile.school,
        className: profile.className,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        mcqScore: correct,
        mcqTotal: chapter.questions.length,
        mcqAnswers: localAnswers,
        essayAnswer: essay.trim(),
        driveLink: sheetOrFolderLink || undefined,
        teacherTarget: TEACHER_ARCHIVE_EMAIL,
        createdAt: new Date().toISOString(),
      };

      await fetch('/api/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });

      await saveArchiveToFirestore(submission);

      const updatedProgress: ChapterProgress = {
        ...progress,
        mcqAnswers: localAnswers,
        mcqScore: correct,
        mcqSubmitted: true,
        essayAnswer: essay,
        driveLink: sheetOrFolderLink || progress.driveLink,
        completed: progress.completed || isPassing,
        archivedAt: submission.createdAt,
      };
      onUpdateProgress(updatedProgress, !progress.archivedAt ? 50 : 0);
      audioManager.playSfx('success');

      setSaveMessage(
        sheetOrFolderLink
          ? `Google Sheet refleksi berhasil dibuat di Drive (${profile.school} -> ${profile.className} -> ${profile.name} -> Bab ${chapter.id}) dan dibagikan ke ${TEACHER_ARCHIVE_EMAIL}.`
          : `Refleksi & nilai Bab ${chapter.id} berhasil masuk ke Sheet Arsip Guru (${TEACHER_ARCHIVE_EMAIL}) untuk ${profile.school} / ${profile.className}.`
      );
      audioManager.speak(
        `Refleksi Bab ${chapter.id} berhasil tersimpan sebagai Google Sheet di arsip guru.`
      );
    } catch (err) {
      console.error('Archive error:', err);
      setSaveError(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan refleksi ke Google Sheet. Silakan coba lagi.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 bg-black/75">
      <div className="w-full max-w-4xl h-[92dvh] sm:h-[88dvh] rounded-2xl bg-slate-900 border border-white/15 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-white/10 bg-slate-950/70 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-bold text-amber-300">Bab {chapter.id}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{chapter.competency}</span>
              {progress.completed && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Selesai
                  </span>
                </>
              )}
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white truncate mt-0.5">
              {chapter.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onExitBuilding}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-rose-200 text-xs font-semibold whitespace-nowrap"
            >
              Keluar Gedung
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Lihat interior gedung 3D"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Station Navigation Tabs */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-white/10 bg-slate-900 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setTab('video')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
              tab === 'video'
                ? 'bg-sky-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            Video Pembahasan
          </button>
          <button
            onClick={() => setTab('quiz')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
              tab === 'quiz'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Soal Pilihan Ganda ({answeredCount}/{chapter.questions.length})
          </button>
          <button
            onClick={() => setTab('archive')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
              tab === 'archive'
                ? 'bg-emerald-400 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Refleksi & Kirim Sheet
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-scroll p-4 sm:p-6 space-y-5">
          {tab === 'video' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white">{activeVideoTitle}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Keyakinan video bab: {chapter.videoConfidence}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={PUSMENDIK_OFFICIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-amber-300 flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Laman Resmi Pusmendik
                  </a>
                  <button
                    onClick={() =>
                      audioManager.speak(
                        `Selamat datang di ruang video Bab ${chapter.id}: ${chapter.title}. Simak video pembahasan atau pilih dari daftar video simulasi TKA di bawah.`
                      )
                    }
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-sky-300 flex items-center gap-1.5"
                  >
                    <Volume2 className="w-4 h-4" />
                    Suara AI
                  </button>
                </div>
              </div>

              {/* Primary / Secondary chapter video switcher (for Bab 8 and Bab 1) */}
              {(chapter.secondaryVideoUrl || selectedVideoUrl !== chapter.videoUrl) && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVideoUrl(chapter.videoUrl);
                      setSelectedVideoTitle(chapter.videoTitle);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      activeVideoUrl === chapter.videoUrl
                        ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                        : 'bg-slate-800 border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    Video Utama Bab {chapter.id}
                  </button>
                  {chapter.secondaryVideoUrl && chapter.secondaryVideoTitle && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVideoUrl(chapter.secondaryVideoUrl!);
                        setSelectedVideoTitle(chapter.secondaryVideoTitle!);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        activeVideoUrl === chapter.secondaryVideoUrl
                          ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                          : 'bg-slate-800 border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      {chapter.secondaryVideoTitle}
                    </button>
                  )}
                </div>
              )}

              {embedUrl ? (
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                  <iframe
                    src={embedUrl}
                    title={activeVideoTitle}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-slate-800/80 border border-white/10 space-y-3">
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Video ini berasal dari platform belajar Ruangbelajar (Ruangguru). Kamu bisa membukanya di tab baru atau memutar salah satu video Simulasi TKA SMP (V1–V10) di bawah langsung di layar ini.
                  </p>
                  <a
                    href={activeVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Buka Video Ruangbelajar
                  </a>
                </div>
              )}

              {/* Daftar Video Umum V1-V10 */}
              {chapter.usesGeneralVideoList && (
                <div className="p-4 rounded-xl bg-slate-800/60 border border-white/10 space-y-2.5">
                  <p className="text-xs font-bold text-slate-200">
                    Daftar Video Umum Simulasi & Bedah Soal TKA SMP (V1–V10):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {GENERAL_TKA_VIDEOS.map((vid) => {
                      const active = activeVideoUrl === vid.url;
                      return (
                        <button
                          key={vid.id}
                          type="button"
                          onClick={() => {
                            setSelectedVideoUrl(vid.url);
                            setSelectedVideoTitle(`${vid.id}. ${vid.title}`);
                          }}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-colors flex items-start gap-2 ${
                            active
                              ? 'bg-sky-500/20 border-sky-400 text-sky-100 font-semibold'
                              : 'bg-slate-900/70 border-white/10 text-slate-300 hover:border-sky-400/40'
                          }`}
                        >
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono-tabular font-bold text-[10px] shrink-0">
                            {vid.id}
                          </span>
                          <span className="leading-snug">{vid.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setTab('quiz')}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold"
                >
                  Lanjut ke Latihan Soal Pilihan Ganda
                </button>
              </div>
            </div>
          )}

          {tab === 'quiz' && (
            <div className="space-y-6">
              {/* Hadiah Bangun Objek Gedung Tracker (2 Soal Benar = 1 Objek) */}
              <div className="p-4 rounded-xl bg-indigo-950/55 border border-indigo-400/30 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-300" />
                    Bangun Interior Gedung Bab {chapter.id} (Setiap 2 Soal Benar = 1 Objek)
                  </p>
                  <span className="font-mono-tabular text-xs font-extrabold text-amber-300">
                    {unlockedObjectsCount}/5 Objek Terbangun
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {INTERIOR_BUILD_REWARDS.map((reward) => {
                    const unlocked = (progress.mcqScore || 0) >= reward.requiredCorrect;
                    return (
                      <div
                        key={reward.tier}
                        className={`p-2 rounded-lg border text-[11px] leading-tight ${
                          unlocked
                            ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-100'
                            : 'bg-slate-900/70 border-white/10 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 font-bold">
                          <span>Objek {reward.tier}</span>
                          <span>{reward.requiredCorrect} Benar</span>
                        </div>
                        <p className="mt-1 truncate">{reward.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reading Passage */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-800/75 border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-amber-300">
                    {chapter.passageTitle}
                  </h3>
                  <button
                    onClick={() =>
                      audioManager.speak(
                        `${chapter.passageTitle}. ${chapter.passageText} ${
                          chapter.secondaryPassageText
                            ? `${chapter.secondaryPassageTitle}. ${chapter.secondaryPassageText}`
                            : ''
                        }`
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Bacakan Teks (AI)
                  </button>
                </div>
                <p className="text-sm text-slate-100 leading-relaxed whitespace-pre-line">
                  {chapter.passageText}
                </p>

                {chapter.secondaryPassageText && (
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <h4 className="text-sm font-bold text-sky-300">
                      {chapter.secondaryPassageTitle}
                    </h4>
                    <p className="text-sm text-slate-100 leading-relaxed whitespace-pre-line">
                      {chapter.secondaryPassageText}
                    </p>
                  </div>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {chapter.questions.map((q) => {
                  const chosen = localAnswers[q.id];
                  const isCorrect = chosen === q.answer;
                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl bg-slate-800/50 border border-white/10 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-white leading-snug">
                          {q.id}. {q.question}
                        </p>
                        <button
                          onClick={() =>
                            audioManager.speak(
                              `Nomor ${q.id}. ${q.question}. ${q.options
                                .map((o) => `Pilihan ${o.key}: ${o.text}`)
                                .join('. ')}`
                            )
                          }
                          className="p-1.5 rounded-lg bg-slate-700/70 hover:bg-slate-700 text-sky-300 shrink-0"
                          aria-label={`Bacakan soal ${q.id}`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const selected = chosen === opt.key;
                          let style =
                            'bg-slate-900/70 border-white/10 text-slate-200 hover:border-sky-400/50';
                          if (progress.mcqSubmitted) {
                            if (opt.key === q.answer) {
                              style = 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
                            } else if (selected && !isCorrect) {
                              style = 'bg-rose-500/20 border-rose-400 text-rose-200';
                            }
                          } else if (selected) {
                            style = 'bg-sky-500/25 border-sky-400 text-white';
                          }

                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => handleSelectOption(q.id, opt.key)}
                              className={`p-3 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-2.5 transition-colors ${style}`}
                            >
                              <span className="font-bold shrink-0">{opt.key}.</span>
                              <span>{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit MCQ bar */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-slate-300 space-y-0.5">
                  {progress.mcqSubmitted ? (
                    <>
                      <p>
                        Skor Terakhir:{' '}
                        <strong className="font-mono-tabular text-amber-300">
                          {progress.mcqScore} / {chapter.questions.length}
                        </strong>{' '}
                        · Objek Ruangan:{' '}
                        <strong className="text-emerald-300">{unlockedObjectsCount}/5 Terbangun</strong>
                      </p>
                    </>
                  ) : (
                    <span>
                      Terjawab {answeredCount} dari {chapter.questions.length} soal
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGradeMcq}
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold"
                  >
                    Periksa Jawaban PG
                  </button>
                  {unlockedObjectsCount > 0 && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3.5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Lihat Objek 3D
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setTab('archive')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
                  >
                    Lanjut ke Refleksi & Sheet
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'archive' && (
            <div className="space-y-5">
              {/* Reflection / Essay Prompt */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-800/70 border border-white/10 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Refleksi & Uraian Bab {chapter.id}
                    </h3>
                    <p className="text-sm text-slate-100 mt-1.5 leading-relaxed">
                      {chapter.essayPrompt}
                    </p>
                  </div>
                  <button
                    onClick={() => audioManager.speak(chapter.essayPrompt)}
                    className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sky-300 shrink-0"
                    aria-label="Bacakan soal refleksi"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  rows={6}
                  maxLength={3900}
                  placeholder="Tuliskan refleksi dan jawaban uraianmu di sini dengan kalimat yang runtut..."
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Structured Google Sheet Preview + Actions */}
              <div className="p-4 sm:p-5 rounded-xl bg-emerald-950/35 border border-emerald-400/30 space-y-3">
                <div className="text-xs text-emerald-200 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                    Arsip Google Sheet Guru / Admin ({TEACHER_ARCHIVE_EMAIL}):
                  </p>
                  <p className="font-mono-tabular text-slate-300">
                    {profile.school} / {profile.className} / {profile.name} / Sheet_Refleksi_Bab_{chapter.id}
                  </p>
                </div>

                {saveMessage && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs text-emerald-100">
                    {saveMessage}
                  </div>
                )}

                {saveError && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-xs text-rose-100">
                    {saveError}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleArchiveSheet(true)}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold flex items-center gap-2 disabled:opacity-60"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    {isSaving ? 'Membuat Google Sheet...' : 'Simpan ke Google Sheet'}
                  </button>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleArchiveSheet(false)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 disabled:opacity-60"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isSaving ? 'Mengirim...' : 'Kirim Refleksi ke Sheet Guru'}
                  </button>

                  {progress.driveLink && (
                    <a
                      href={progress.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Buka Google Sheet
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
