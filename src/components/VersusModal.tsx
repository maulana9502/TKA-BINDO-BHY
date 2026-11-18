import React, { useEffect, useState } from 'react';
import { Bot, CheckCircle2, Clock, Swords, Trophy, Users, Volume2, X } from 'lucide-react';
import { audioManager } from '../audio/AudioManager';
import { pickRandomVersusQuestions, VERSUS_QUESTION_BANK } from '../data/versusBank';
import type { PlayerProfile, RemotePlayer, VersusMatchState, VersusQuestion } from '../types/game';

interface VersusModalProps {
  open: boolean;
  localProfile: PlayerProfile;
  versusWins: number;
  remotePlayers: RemotePlayer[];
  activeMatch: VersusMatchState | null;
  challengeStatus: string | null;
  onClose: () => void;
  onChallengePlayer: (targetId: string) => void;
  onSubmitPvpAnswer: (matchId: string, round: number, isCorrect: boolean, timeBonus: number) => void;
  onRequestAdvanceRound: (matchId: string) => void;
  onExitMatch: (earnedXp: number, didWin: boolean) => void;
}

export const VersusModal: React.FC<VersusModalProps> = ({
  open,
  localProfile,
  versusWins,
  remotePlayers,
  activeMatch,
  challengeStatus,
  onClose,
  onChallengePlayer,
  onSubmitPvpAnswer,
  onRequestAdvanceRound,
  onExitMatch,
}) => {
  const [botMode, setBotMode] = useState(false);
  const [botQuestions, setBotQuestions] = useState<VersusQuestion[]>([]);
  const [botRound, setBotRound] = useState(0);
  const [botScores, setBotScores] = useState({ player: 0, bot: 0 });
  const [botFinished, setBotFinished] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(25);
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([]);
  const [pvpRewardClaimed, setPvpRewardClaimed] = useState(false);

  // Reset local round selection when PvP round changes
  useEffect(() => {
    if (activeMatch) {
      setSelectedOpt(null);
      setBotMode(false);
      if (activeMatch.status === 'active') {
        setPvpRewardClaimed(false);
      }
    }
  }, [activeMatch?.matchId, activeMatch?.currentRound, activeMatch?.status]);

  // Countdown timer for both PvP and Bot duel
  useEffect(() => {
    if (!open) return;
    const isDuelRunning = (activeMatch && activeMatch.status === 'active') || (botMode && !botFinished);
    if (!isDuelRunning) return;

    const interval = window.setInterval(() => {
      if (activeMatch && activeMatch.status === 'active') {
        const rem = Math.max(0, Math.ceil((activeMatch.roundDeadline - Date.now()) / 1000));
        setSecondsLeft(rem);
        if (rem <= 0) {
          onRequestAdvanceRound(activeMatch.matchId);
        }
      } else if (botMode && !botFinished) {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleBotAnswer(null);
            return 25;
          }
          return prev - 1;
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [open, activeMatch?.matchId, activeMatch?.currentRound, activeMatch?.status, activeMatch?.roundDeadline, botMode, botFinished]);

  if (!open) return null;

  const startBotDuel = () => {
    const picked = pickRandomVersusQuestions(5, usedQuestionIds);
    setUsedQuestionIds((prev) => [...prev.slice(-60), ...picked.map((q) => q.id)]);
    setBotQuestions(picked);
    setBotRound(0);
    setBotScores({ player: 0, bot: 0 });
    setBotFinished(false);
    setSelectedOpt(null);
    setSecondsLeft(25);
    setBotMode(true);
    audioManager.playSfx('portal');
    audioManager.speak('Duel Gedung Versus dimulai! Baca teks dengan cermat dan jawab lebih cepat dari lawan!');
  };

  const handleBotAnswer = (opt: 'A' | 'B' | 'C' | 'D' | null) => {
    if (selectedOpt !== null && opt !== null) return;
    const q = botQuestions[botRound];
    if (!q) return;

    const chosen = opt;
    setSelectedOpt(chosen || 'A');

    const playerCorrect = chosen === q.answer;
    const playerGain = playerCorrect ? 100 + Math.min(50, secondsLeft * 2) : 0;
    const botCorrect = Math.random() < 0.72;
    const botGain = botCorrect ? 85 + Math.floor(Math.random() * 40) : 0;

    setBotScores((prev) => ({
      player: prev.player + playerGain,
      bot: prev.bot + botGain,
    }));
    audioManager.playSfx(playerCorrect ? 'success' : 'coin');

    window.setTimeout(() => {
      if (botRound + 1 >= botQuestions.length) {
        setBotFinished(true);
      } else {
        setBotRound((r) => r + 1);
        setSelectedOpt(null);
        setSecondsLeft(25);
      }
    }, 1150);
  };

  const handlePvpSelect = (opt: 'A' | 'B' | 'C' | 'D') => {
    if (!activeMatch || activeMatch.status !== 'active' || selectedOpt !== null) return;
    const q = activeMatch.questions[activeMatch.currentRound];
    if (!q) return;

    setSelectedOpt(opt);
    const isCorrect = opt === q.answer;
    const timeBonus = isCorrect ? Math.min(50, secondsLeft * 2) : 0;
    audioManager.playSfx(isCorrect ? 'success' : 'coin');
    onSubmitPvpAnswer(activeMatch.matchId, activeMatch.currentRound, isCorrect, timeBonus);
  };

  // Determine current view
  const renderLobby = !activeMatch && !botMode;
  const currentQ: VersusQuestion | undefined = activeMatch
    ? activeMatch.questions[activeMatch.currentRound]
    : botMode
      ? botQuestions[botRound]
      : undefined;

  const isPvpFinished = activeMatch?.status === 'finished';
  const showFinished = isPvpFinished || (botMode && botFinished);

  const finishPlayerScore = activeMatch
    ? activeMatch.player1.id === localProfile.id
      ? activeMatch.player1.score
      : activeMatch.player2.score
    : botScores.player;
  const finishOppScore = activeMatch
    ? activeMatch.player1.id === localProfile.id
      ? activeMatch.player2.score
      : activeMatch.player1.score
    : botScores.bot;
  const finishOppName = activeMatch
    ? activeMatch.player1.id === localProfile.id
      ? activeMatch.player2.name
      : activeMatch.player1.name
    : 'Bot Pustaka SMP';

  const didWin = finishPlayerScore > finishOppScore;
  const isDraw = finishPlayerScore === finishOppScore;
  const finishXp = didWin ? 120 : isDraw ? 60 : 35;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80">
      <div className="w-full max-w-4xl h-[92dvh] sm:h-[88dvh] rounded-2xl bg-slate-900 border border-rose-400/35 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-white/10 bg-gradient-to-r from-rose-950/90 via-slate-950 to-amber-950/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Swords className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-extrabold text-white truncate">
                Gedung Versus — Arena Adu TKA Bahasa Indonesia
              </h2>
              <p className="text-[11px] text-rose-200 truncate">
                {VERSUS_QUESTION_BANK.length} Soal Teks Bacaan Acak (Berbeda dari Bab 1–11) · Kemenangan: {versusWins}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (activeMatch && activeMatch.status === 'finished' && !pvpRewardClaimed) {
                setPvpRewardClaimed(true);
                onExitMatch(finishXp, didWin);
              } else {
                onClose();
              }
            }}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 shrink-0"
            aria-label="Tutup Gedung Versus"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scroll p-4 sm:p-6 space-y-5">
          {renderLobby && (
            <>
              <div className="p-4 sm:p-5 rounded-xl bg-rose-500/10 border border-rose-400/30 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <p className="text-sm font-bold text-amber-300">
                    Siap Adu Kecepatan & Ketepatan Membaca?
                  </p>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Setiap pertandingan mengambil 5 soal acak berbasis teks bacaan dari bank {VERSUS_QUESTION_BANK.length} soal TKA SMP yang tidak pernah ada di gedung materi Bab 1–11. Lawan teman lain di kota atau uji kemampuanmu melawan Bot Pustaka!
                  </p>
                </div>

                <button
                  onClick={startBotDuel}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-2 shrink-0 shadow-lg"
                >
                  <Bot className="w-4 h-4" />
                  Adu Lawan Bot Pustaka
                </button>
              </div>

              {challengeStatus && (
                <div className="p-3 rounded-xl bg-sky-500/15 border border-sky-400/40 text-xs text-sky-100 font-semibold">
                  {challengeStatus}
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Tantang Pemain Online di Kota ({remotePlayers.length})
                </h3>

                {remotePlayers.length === 0 ? (
                  <div className="p-6 rounded-xl bg-slate-800/60 border border-white/10 text-center space-y-2">
                    <p className="text-sm font-semibold text-slate-200">
                      Belum ada pemain lain yang online saat ini
                    </p>
                    <p className="text-xs text-slate-400">
                      Ajak teman membuka tautan aplikasi yang sama untuk duel 1v1 secara real-time, atau klik tombol "Adu Lawan Bot Pustaka" di atas untuk langsung bertanding!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {remotePlayers.map((rp) => (
                      <div
                        key={rp.id}
                        className="p-3.5 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{rp.name}</p>
                          <p className="text-xs text-slate-300 truncate">
                            {rp.className} · {rp.school}
                          </p>
                          <p className="font-mono-tabular text-[11px] text-amber-300 mt-0.5">
                            Lv.{rp.level} · Bab {rp.completedCount}/11
                          </p>
                        </div>
                        <button
                          onClick={() => onChallengePlayer(rp.id)}
                          className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
                        >
                          <Swords className="w-3.5 h-3.5" />
                          Tantang 1v1
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {showFinished && (
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-amber-400/40 text-center space-y-5 my-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8 text-amber-300" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  {didWin ? 'Kamu Menang Duel Versus!' : isDraw ? 'Hasil Seri!' : 'Nyaris Menang!'}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Hadiah pengalaman: <span className="font-bold text-emerald-300">+{finishXp} XP</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                <div className="p-4 rounded-xl bg-sky-500/15 border border-sky-400/30">
                  <p className="text-xs text-sky-200 font-semibold truncate">{localProfile.name}</p>
                  <p className="font-mono-tabular text-2xl font-extrabold text-white mt-1">
                    {finishPlayerScore}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-400/30">
                  <p className="text-xs text-rose-200 font-semibold truncate">{finishOppName}</p>
                  <p className="font-mono-tabular text-2xl font-extrabold text-white mt-1">
                    {finishOppScore}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {botMode && (
                  <button
                    onClick={() => {
                      onExitMatch(finishXp, didWin);
                      startBotDuel();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Swords className="w-4 h-4" />
                    Adu Lagi (Soal Acak Baru)
                  </button>
                )}
                <button
                  onClick={() => {
                    onExitMatch(finishXp, didWin);
                    setBotMode(false);
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Klaim XP & Kembali
                </button>
              </div>
            </div>
          )}

          {!renderLobby && !showFinished && currentQ && (
            <div className="space-y-4">
              {/* Live Duel Scoreboard */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 items-center p-3.5 rounded-xl bg-slate-950/80 border border-white/10">
                <div className="text-left">
                  <p className="text-xs font-bold text-sky-300 truncate">{localProfile.name}</p>
                  <p className="font-mono-tabular text-lg sm:text-xl font-extrabold text-white">
                    {finishPlayerScore}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-[11px] font-bold text-slate-400">
                    Ronde {(activeMatch ? activeMatch.currentRound : botRound) + 1} / 5
                  </p>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-400/40 text-rose-200 font-mono-tabular text-xs font-bold mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    {secondsLeft}d
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-rose-300 truncate">{finishOppName}</p>
                  <p className="font-mono-tabular text-lg sm:text-xl font-extrabold text-white">
                    {finishOppScore}
                  </p>
                </div>
              </div>

              {/* Passage Text */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-800/75 border border-white/10 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wide">
                      {currentQ.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-amber-300">
                      {currentQ.passageTitle}
                    </h3>
                  </div>
                  <button
                    onClick={() =>
                      audioManager.speak(`${currentQ.passageTitle}. ${currentQ.passageText}`)
                    }
                    className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Bacakan Teks
                  </button>
                </div>
                <p className="text-sm text-slate-100 leading-relaxed whitespace-pre-line">
                  {currentQ.passageText}
                </p>
              </div>

              {/* Question & Options */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-white leading-snug">{currentQ.question}</p>
                  <button
                    onClick={() => audioManager.speak(currentQ.question)}
                    className="p-1.5 rounded-lg bg-slate-700 text-sky-300 shrink-0"
                    aria-label="Bacakan pertanyaan"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentQ.options.map((opt) => {
                    const isPicked = selectedOpt === opt.key;
                    const isRight = opt.key === currentQ.answer;
                    let cls =
                      'bg-slate-900/80 border-white/10 text-slate-200 hover:border-amber-400/60';
                    if (selectedOpt !== null) {
                      if (isRight) {
                        cls = 'bg-emerald-500/25 border-emerald-400 text-emerald-200';
                      } else if (isPicked) {
                        cls = 'bg-rose-500/25 border-rose-400 text-rose-200';
                      } else {
                        cls = 'bg-slate-900/40 border-white/5 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={opt.key}
                        type="button"
                        disabled={selectedOpt !== null}
                        onClick={() =>
                          activeMatch ? handlePvpSelect(opt.key) : handleBotAnswer(opt.key)
                        }
                        className={`p-3 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-2.5 transition-colors ${cls}`}
                      >
                        <span className="font-bold shrink-0">{opt.key}.</span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {activeMatch && selectedOpt !== null && (
                  <p className="text-xs text-amber-300 font-semibold">
                    Jawaban terkunci! Menunggu lawan menyelesaikan ronde ini...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
