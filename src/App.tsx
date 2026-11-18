import React, { Component, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookMarked,
  Cloud,
  CloudLightning,
  CloudRain,
  DoorOpen,
  FileSpreadsheet,
  Maximize2,
  Minimize2,
  Moon,
  Music,
  Palette,
  PlayCircle,
  Sun,
  Swords,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { audioManager } from './audio/AudioManager';
import { AvatarStudioModal } from './components/AvatarStudioModal';
import { ChapterModal } from './components/ChapterModal';
import { Joystick } from './components/Joystick';
import { LoginModal } from './components/LoginModal';
import { MinimapRadar } from './components/MinimapRadar';
import { OnlinePlayersDrawer } from './components/OnlinePlayersDrawer';
import { TeacherArchiveModal } from './components/TeacherArchiveModal';
import { VersusModal } from './components/VersusModal';
import { CHAPTERS, INTERIOR_BUILD_REWARDS } from './data/curriculum';
import { getVersusQuestionsByIds } from './data/versusBank';
import { VERSUS_BUILDING_POS, WorldEngine } from './game/WorldEngine';
import {
  initFirebaseAuth,
  loadProgressFromFirestore,
  saveProgressToFirestore,
  signInWithGoogleForGame,
  subscribeOnlinePlayersFromFirestore,
  syncPlayerPresenceToFirestore,
  testFirestoreConnection,
} from './services/firebase';
import { detectRealLocalWeather, getLocalTimePeriod } from './services/weather';
import type {
  AvatarConfig,
  ChapterData,
  ChapterProgress,
  LocalWeatherState,
  PlayerProfile,
  RemotePlayer,
  StudentProgressState,
  TimeOfDayMode,
  VersusChallengeIncoming,
  VersusMatchState,
} from './types/game';

const DEFAULT_AVATAR: AvatarConfig = {
  skinColor: '#f1c27d',
  shirtColor: '#2563eb',
  pantsColor: '#1e293b',
  hairColor: '#0f172a',
  hairStyle: 'neat',
  expression: 'smile',
  companionType: 'garuda',
  companionColor: '#fbbf24',
};

function createClientId(): string {
  const saved = sessionStorage.getItem('nbq_client_id');
  if (saved) return saved;
  const fresh = `p_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
  sessionStorage.setItem('nbq_client_id', fresh);
  return fresh;
}

class AppErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-[100dvh] bg-slate-950 text-white flex items-center justify-center p-6">
          <div className="max-w-md p-6 rounded-2xl bg-slate-900 border border-rose-400/30 space-y-3">
            <h2 className="text-lg font-bold text-rose-300">Terjadi Gangguan Aplikasi</h2>
            <p className="text-xs text-slate-300 break-words">{this.state.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 text-xs font-bold"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function GameApp() {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<WorldEngine | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [hasEnteredWorld, setHasEnteredWorld] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const [profile, setProfile] = useState<PlayerProfile>(() => ({
    id: createClientId(),
    name: 'Siswa',
    school: 'SMP Nusantara',
    className: 'VIII-A',
    avatar: DEFAULT_AVATAR,
    isGoogleSignedIn: false,
  }));

  const [progress, setProgress] = useState<StudentProgressState>({
    xp: 0,
    level: 1,
    completedChapters: [],
    chapters: {},
    versusWins: 0,
  });

  const [playerPos, setPlayerPos] = useState({ x: 0, z: 12, rotY: Math.PI });
  const [nearbyChapter, setNearbyChapter] = useState<ChapterData | null>(null);
  const [nearVersus, setNearVersus] = useState(false);
  const [insideChapter, setInsideChapter] = useState<ChapterData | null>(null);
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [chapterModalTab, setChapterModalTab] = useState<'video' | 'quiz' | 'archive'>('video');

  const [onlineDrawerOpen, setOnlineDrawerOpen] = useState(false);
  const [avatarStudioOpen, setAvatarStudioOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [chaptersQuickOpen, setChaptersQuickOpen] = useState(false);

  // Versus PvP & Arena state
  const [versusModalOpen, setVersusModalOpen] = useState(false);
  const [incomingChallenge, setIncomingChallenge] = useState<VersusChallengeIncoming | null>(null);
  const [activeMatch, setActiveMatch] = useState<VersusMatchState | null>(null);
  const [challengeStatus, setChallengeStatus] = useState<string | null>(null);

  // Real Local Time & Weather
  const [timeMode, setTimeMode] = useState<TimeOfDayMode>('real');
  const [weatherState, setWeatherState] = useState<LocalWeatherState>(() => {
    const now = new Date();
    return {
      condition: 'clear',
      temperatureC: 29,
      label: 'Cerah',
      locationLabel: 'Cuaca Lokal',
      timePeriod: getLocalTimePeriod(now.getHours()),
      localHour: now.getHours() + now.getMinutes() / 60,
    };
  });

  const [musicOn, setMusicOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);
  const [isMobileFullscreen, setIsMobileFullscreen] = useState(false);
  const wasNativeFullscreenRef = useRef(false);

  const [wsPlayers, setWsPlayers] = useState<RemotePlayer[]>([]);
  const [httpPlayers, setHttpPlayers] = useState<RemotePlayer[]>([]);
  const [fsPlayers, setFsPlayers] = useState<RemotePlayer[]>([]);

  const profileRef = useRef(profile);
  const progressRef = useRef(progress);
  profileRef.current = profile;
  progressRef.current = progress;

  const totalAnswered = useMemo(
    () =>
      Object.values(progress.chapters).reduce(
        (sum, ch) => sum + Object.keys(ch.mcqAnswers || {}).length,
        0
      ),
    [progress.chapters]
  );

  // Merge Firestore, HTTP Heartbeat, and WebSocket players cleanly so everyone meets in 1 city
  const remotePlayers = useMemo(() => {
    const merged = new Map<string, RemotePlayer>();
    for (const p of fsPlayers) {
      if (p.id !== profile.id && p.uid !== profile.uid) merged.set(p.id, p);
    }
    for (const p of httpPlayers) {
      if (p.id !== profile.id && p.uid !== profile.uid) merged.set(p.id, p);
    }
    for (const p of wsPlayers) {
      if (p.id !== profile.id && p.uid !== profile.uid) merged.set(p.id, p);
    }
    return Array.from(merged.values());
  }, [wsPlayers, httpPlayers, fsPlayers, profile.id, profile.uid]);

  // Real local weather detection + periodic refresh
  useEffect(() => {
    let active = true;
    const refreshWeather = async () => {
      const next = await detectRealLocalWeather();
      if (!active) return;
      setWeatherState(next);
      engineRef.current?.setWeatherState(next);
    };
    refreshWeather();

    const weatherTimer = window.setInterval(refreshWeather, 300000);
    const clockTimer = window.setInterval(() => {
      const now = new Date();
      setWeatherState((prev) => {
        const updated = {
          ...prev,
          localHour: now.getHours() + now.getMinutes() / 60,
          timePeriod: getLocalTimePeriod(now.getHours()),
        };
        engineRef.current?.setWeatherState(updated);
        return updated;
      });
    }, 30000);

    return () => {
      active = false;
      clearInterval(weatherTimer);
      clearInterval(clockTimer);
    };
  }, []);

  // Sync browser native fullscreen changes (e.g. Android back gesture / ESC)
  useEffect(() => {
    const handleFsChange = () => {
      const fsEl =
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element | null }).webkitFullscreenElement ||
        null;
      if (fsEl) {
        wasNativeFullscreenRef.current = true;
      } else if (wasNativeFullscreenRef.current) {
        wasNativeFullscreenRef.current = false;
        setIsMobileFullscreen(false);
      }
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const toggleMobileFullscreen = useCallback(async () => {
    const docEl = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    };
    const doc = document as Document & {
      webkitExitFullscreen?: () => Promise<void> | void;
      webkitFullscreenElement?: Element | null;
    };

    if (!isMobileFullscreen) {
      setIsMobileFullscreen(true);
      setChaptersQuickOpen(false);
      setOnlineDrawerOpen(false);
      try {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
          wasNativeFullscreenRef.current = true;
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
          wasNativeFullscreenRef.current = true;
        }
      } catch {
        // Fallback to clean HUD fullscreen mode when iframe/iOS Safari blocks native requestFullscreen
      }
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), 120);
    } else {
      setIsMobileFullscreen(false);
      wasNativeFullscreenRef.current = false;
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (doc.webkitFullscreenElement && doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
      } catch {
        // ignore exit error
      }
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), 120);
    }
  }, [isMobileFullscreen]);

  // Startup Firebase connection check + auth listener
  useEffect(() => {
    testFirestoreConnection();
    let unsubPlayers: (() => void) | null = null;
    const unsubAuth = initFirebaseAuth((user) => {
      if (user) {
        setProfile((prev) => ({
          ...prev,
          uid: user.uid,
          email: user.email || prev.email,
          isGoogleSignedIn: true,
        }));
        unsubPlayers?.();
        unsubPlayers = subscribeOnlinePlayersFromFirestore(DEFAULT_AVATAR, (list) => {
          setFsPlayers(list);
        });
      } else {
        unsubPlayers?.();
        unsubPlayers = null;
        setFsPlayers([]);
      }
    });
    return () => {
      unsubAuth();
      unsubPlayers?.();
    };
  }, []);

  const persistCloudProgress = useCallback(
    async (nextProfile: PlayerProfile, nextProgress: StudentProgressState) => {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: nextProfile.uid,
            name: nextProfile.name,
            school: nextProfile.school,
            className: nextProfile.className,
            avatar: nextProfile.avatar,
            progress: nextProgress,
          }),
        });
      } catch (err) {
        console.warn('Server progress save warning:', err);
      }

      if (nextProfile.isGoogleSignedIn) {
        saveProgressToFirestore(nextProfile, nextProgress).catch(() => {});
      }
    },
    []
  );

  const loadSavedProgress = useCallback(async (targetProfile: PlayerProfile) => {
    let loadedProgress: StudentProgressState | null = null;
    let loadedAvatar: AvatarConfig | null = null;

    try {
      const qs = new URLSearchParams({
        school: targetProfile.school,
        className: targetProfile.className,
        name: targetProfile.name,
        ...(targetProfile.uid ? { uid: targetProfile.uid } : {}),
      });
      const res = await fetch(`/api/progress?${qs.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.found?.progress) {
          loadedProgress = data.found.progress as StudentProgressState;
        }
        if (data.found?.avatar && Object.keys(data.found.avatar).length > 0) {
          loadedAvatar = { ...targetProfile.avatar, ...data.found.avatar };
        }
      }
    } catch {
      // ignore offline fetch
    }

    if (targetProfile.isGoogleSignedIn) {
      const fsData = await loadProgressFromFirestore();
      if (fsData?.progress) {
        if (!loadedProgress || fsData.progress.xp >= loadedProgress.xp) {
          loadedProgress = fsData.progress;
        }
      }
      if (fsData?.avatar) {
        loadedAvatar = { ...(loadedAvatar || targetProfile.avatar), ...fsData.avatar };
      }
      if (fsData?.profileMeta?.school && targetProfile.school === 'SMP Nusantara') {
        targetProfile.school = fsData.profileMeta.school;
      }
      if (fsData?.profileMeta?.className && targetProfile.className === 'VIII-A') {
        targetProfile.className = fsData.profileMeta.className;
      }
    }

    if (loadedProgress) setProgress(loadedProgress);
    if (loadedAvatar) setProfile((prev) => ({ ...prev, avatar: loadedAvatar! }));
  }, []);

  const handleStartGame = async (chosenProfile: PlayerProfile) => {
    audioManager.initAudio();
    setProfile(chosenProfile);
    await loadSavedProgress(chosenProfile);
    setHasEnteredWorld(true);
    audioManager.speak(
      `Selamat datang ${chosenProfile.name} dari kelas ${chosenProfile.className} ${chosenProfile.school}! Jelajahi 11 gedung bab dan Gedung Versus adu 1 lawan 1.`
    );
  };

  const handleGoogleLogin = async (draftProfile: PlayerProfile) => {
    setIsGoogleLoading(true);
    setGoogleError(null);
    try {
      const { user } = await signInWithGoogleForGame();
      const merged: PlayerProfile = {
        ...draftProfile,
        uid: user.uid,
        email: user.email || undefined,
        name:
          draftProfile.name && draftProfile.name !== 'Siswa Nusantara'
            ? draftProfile.name
            : user.displayName || 'Siswa',
        isGoogleSignedIn: true,
      };
      await handleStartGame(merged);
    } catch (err) {
      console.error('Google Sign-In error:', err);
      setGoogleError(
        'Login Google dibatalkan atau gagal. Kamu tetap bisa masuk dengan mengisi Nama, Sekolah, dan Kelas.'
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Mount Three.js WorldEngine once entered world
  useEffect(() => {
    if (!hasEnteredWorld || !canvasMountRef.current) return;

    const engine = new WorldEngine(
      canvasMountRef.current,
      profileRef.current.avatar,
      {
        name: profileRef.current.name,
        className: profileRef.current.className,
        level: progressRef.current.level,
        completedCount: progressRef.current.completedChapters.length,
        answeredCount: totalAnswered,
      },
      {
        onNearbyBuildingChange: (ch) => {
          setNearbyChapter(ch);
          if (ch) {
            audioManager.speak(`Kamu berada di depan gedung Bab ${ch.id}: ${ch.shortTitle}.`);
          }
        },
        onEnterBuilding: (ch) => {
          audioManager.playSfx('portal');
          const savedScore = progressRef.current.chapters[ch.id]?.mcqScore || 0;
          engine.setInteriorCorrectCount(savedScore, true);
          setInsideChapter(ch);
          audioManager.speak(
            `Memasuki gedung Bab ${ch.id}. Pilih layar video, meja soal, atau terminal kirim sheet refleksi.`
          );
        },
        onNearbyVersusChange: (near) => {
          setNearVersus(near);
          if (near) {
            audioManager.speak('Kamu berada di depan Gedung Versus! Masuk untuk adu TKA satu lawan satu.');
          }
        },
        onEnterVersus: () => {
          audioManager.playSfx('portal');
          setVersusModalOpen(true);
        },
        onInteriorStationInteract: (station) => {
          if (station === 'exit') {
            audioManager.playSfx('portal');
            setInsideChapter(null);
            setChapterModalOpen(false);
            return;
          }
          setChapterModalTab(station);
          setChapterModalOpen(true);
        },
        onPlayerMove: (pos) => {
          setPlayerPos({ x: pos.x, z: pos.z, rotY: pos.rotY });
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({
                type: 'player:move',
                x: pos.x,
                y: pos.y,
                z: pos.z,
                rotY: pos.rotY,
                isMoving: pos.isMoving,
              })
            );
          }
        },
      }
    );

    engine.updateCompletedChapters(progressRef.current.completedChapters);
    engine.setWeatherState(weatherState);
    engine.setTimeOfDayMode(timeMode);
    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, [hasEnteredWorld]);

  // Sync completed chapters, interior rewards & local avatar updates to 3D engine
  useEffect(() => {
    if (!engineRef.current) return;
    engineRef.current.updateCompletedChapters(progress.completedChapters);
    if (insideChapter) {
      const score = progress.chapters[insideChapter.id]?.mcqScore || 0;
      engineRef.current.setInteriorCorrectCount(score, false);
    }
    engineRef.current.updateLocalAvatar(profile.avatar, {
      name: profile.name,
      className: profile.className,
      level: progress.level,
      completedCount: progress.completedChapters.length,
      answeredCount: totalAnswered,
    });
  }, [profile, progress.level, progress.completedChapters, progress.chapters, insideChapter, totalAnswered]);

  // Sync weather state to 3D engine
  useEffect(() => {
    engineRef.current?.setWeatherState(weatherState);
  }, [weatherState]);

  // Sync remote players to 3D engine
  useEffect(() => {
    engineRef.current?.syncRemotePlayers(remotePlayers);
  }, [remotePlayers]);

  // WebSocket Multiplayer + Versus Duel Connection
  useEffect(() => {
    if (!hasEnteredWorld) return;
    let closed = false;
    let reconnectTimer: number | null = null;

    const connect = () => {
      if (closed) return;
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${proto}//${window.location.host}/ws`);
      wsRef.current = ws;

      ws.onopen = () => {
        const p = profileRef.current;
        const prog = progressRef.current;
        const pos = engineRef.current?.getPlayerPosition() || { x: 0, z: 12, rotY: Math.PI };
        ws.send(
          JSON.stringify({
            type: 'player:join',
            player: {
              id: p.id,
              uid: p.uid,
              name: p.name,
              school: p.school,
              className: p.className,
              level: prog.level,
              xp: prog.xp,
              completedCount: prog.completedChapters.length,
              answeredCount: Object.values(prog.chapters).reduce(
                (s, ch) => s + Object.keys(ch.mcqAnswers || {}).length,
                0
              ),
              x: pos.x,
              y: 0,
              z: pos.z,
              rotY: pos.rotY,
              avatar: p.avatar,
              isMoving: false,
            },
          })
        );
      };

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === 'world:snapshot' && Array.isArray(msg.players)) {
            setWsPlayers(msg.players);
          } else if (msg.type === 'player:upsert' && msg.player) {
            setWsPlayers((prev) => {
              const idx = prev.findIndex((x) => x.id === msg.player.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = msg.player;
                return next;
              }
              return [...prev, msg.player];
            });
          } else if (msg.type === 'player:moved' && msg.id) {
            setWsPlayers((prev) =>
              prev.map((p) =>
                p.id === msg.id
                  ? { ...p, x: msg.x, y: msg.y, z: msg.z, rotY: msg.rotY, isMoving: msg.isMoving }
                  : p
              )
            );
          } else if (msg.type === 'player:left' && msg.id) {
            setWsPlayers((prev) => prev.filter((p) => p.id !== msg.id));
          } else if (msg.type === 'versus:incoming' && msg.challenge) {
            setIncomingChallenge(msg.challenge);
            audioManager.playSfx('portal');
            audioManager.speak(`${msg.challenge.fromName} mengajakmu adu TKA di Gedung Versus!`);
          } else if ((msg.type === 'versus:started' || msg.type === 'versus:state') && msg.match) {
            const m = msg.match;
            const questions = getVersusQuestionsByIds(m.questionIds || []);
            setActiveMatch({
              matchId: m.matchId,
              player1: m.player1,
              player2: m.player2,
              questions,
              currentRound: m.currentRound,
              roundDeadline: m.roundDeadline,
              status: m.status,
              winnerId: m.winnerId,
            });
            setChallengeStatus(null);
            setIncomingChallenge(null);
            setVersusModalOpen(true);
          } else if (msg.type === 'versus:declined') {
            setChallengeStatus(`${msg.byName || 'Lawan'} menolak tantangan duel.`);
          } else if (msg.type === 'versus:error') {
            setChallengeStatus(msg.message || 'Gagal memulai duel.');
          }
        } catch {
          // ignore malformed frames
        }
      };

      ws.onclose = () => {
        if (!closed) {
          reconnectTimer = window.setTimeout(connect, 2500);
        }
      };
    };

    connect();
    return () => {
      closed = true;
      if (reconnectTimer !== null) clearTimeout(reconnectTimer);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [hasEnteredWorld]);

  // HTTP Multiplayer Heartbeat Fallback + Firestore Presence Sync (ensures 1 shared city reliably)
  useEffect(() => {
    if (!hasEnteredWorld) return;

    const sendHeartbeat = async () => {
      const p = profileRef.current;
      const prog = progressRef.current;
      const pos = engineRef.current?.getPlayerPosition() || { x: 0, z: 12, rotY: Math.PI };
      const answeredCount = Object.values(prog.chapters).reduce(
        (s, ch) => s + Object.keys(ch.mcqAnswers || {}).length,
        0
      );

      try {
        const res = await fetch('/api/multiplayer/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: p.id,
            uid: p.uid,
            name: p.name,
            school: p.school,
            className: p.className,
            level: prog.level,
            xp: prog.xp,
            completedCount: prog.completedChapters.length,
            answeredCount,
            x: pos.x,
            y: 0,
            z: pos.z,
            rotY: pos.rotY,
            avatar: p.avatar,
            isMoving: false,
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as { players?: RemotePlayer[] };
          if (Array.isArray(data.players)) {
            setHttpPlayers(data.players);
          }
        }
      } catch {
        // ignore network hiccup
      }

      if (p.isGoogleSignedIn) {
        syncPlayerPresenceToFirestore(
          p,
          prog,
          { x: pos.x, y: 0, z: pos.z, rotY: pos.rotY },
          true
        );
      }
    };

    sendHeartbeat();
    const timer = window.setInterval(sendHeartbeat, 3000);
    return () => clearInterval(timer);
  }, [hasEnteredWorld]);

  const handleUpdateChapterProgress = (nextCh: ChapterProgress, earnedXp = 0) => {
    setProgress((prev) => {
      const nextChapters = { ...prev.chapters, [nextCh.chapterId]: nextCh };
      const completedSet = new Set(prev.completedChapters);
      if (nextCh.completed) completedSet.add(nextCh.chapterId);
      const nextXp = prev.xp + earnedXp;
      const nextLevel = Math.max(1, Math.floor(nextXp / 150) + 1);
      const nextState: StudentProgressState = {
        xp: nextXp,
        level: nextLevel,
        completedChapters: Array.from(completedSet).sort((a, b) => a - b),
        chapters: nextChapters,
        versusWins: prev.versusWins || 0,
      };
      persistCloudProgress(profileRef.current, nextState);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'player:update',
            player: {
              level: nextLevel,
              xp: nextXp,
              completedCount: nextState.completedChapters.length,
              answeredCount: Object.values(nextChapters).reduce(
                (s, c) => s + Object.keys(c.mcqAnswers || {}).length,
                0
              ),
            },
          })
        );
      }
      return nextState;
    });
  };

  const handleClaimVersusReward = (earnedXp: number, didWin: boolean) => {
    setActiveMatch(null);
    if (earnedXp <= 0 && !didWin) return;
    setProgress((prev) => {
      const nextXp = prev.xp + earnedXp;
      const nextLevel = Math.max(1, Math.floor(nextXp / 150) + 1);
      const nextState: StudentProgressState = {
        ...prev,
        xp: nextXp,
        level: nextLevel,
        versusWins: (prev.versusWins || 0) + (didWin ? 1 : 0),
      };
      persistCloudProgress(profileRef.current, nextState);
      return nextState;
    });
  };

  const handleChallengePlayer = (targetId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'versus:challenge', targetId }));
      setChallengeStatus('Tantangan duel 1v1 terkirim! Menunggu jawaban lawan...');
      setVersusModalOpen(true);
    } else {
      setChallengeStatus('Koneksi WebSocket sedang menyambung ulang. Coba lagi sebentar.');
    }
  };

  const handleSaveAvatar = (nextAvatar: AvatarConfig) => {
    const nextProfile = { ...profile, avatar: nextAvatar };
    setProfile(nextProfile);
    persistCloudProgress(nextProfile, progress);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'player:update',
          player: { avatar: nextAvatar },
        })
      );
    }
  };

  const cycleTimeMode = () => {
    const order: TimeOfDayMode[] = ['real', 'morning', 'day', 'afternoon', 'night'];
    const next = order[(order.indexOf(timeMode) + 1) % order.length];
    setTimeMode(next);
    engineRef.current?.setTimeOfDayMode(next);
  };

  const WeatherIcon = useMemo(() => {
    if (weatherState.condition === 'storm') return CloudLightning;
    if (weatherState.condition === 'rain') return CloudRain;
    if (weatherState.condition === 'cloudy') return Cloud;
    if (weatherState.timePeriod === 'Malam' && timeMode === 'real') return Moon;
    if (timeMode === 'night') return Moon;
    return Sun;
  }, [weatherState.condition, weatherState.timePeriod, timeMode]);

  const timeModeBadgeText =
    timeMode === 'real'
      ? `${weatherState.timePeriod} · ${weatherState.label} ${weatherState.temperatureC}°C`
      : timeMode === 'morning'
        ? `Pagi (Manual) · ${weatherState.label}`
        : timeMode === 'day'
          ? `Siang (Manual) · ${weatherState.label}`
          : timeMode === 'afternoon'
            ? `Sore (Manual) · ${weatherState.label}`
            : `Malam (Manual) · ${weatherState.label}`;

  const activeChapter = insideChapter || nearbyChapter;
  const activeChapterProgress: ChapterProgress = activeChapter
    ? progress.chapters[activeChapter.id] || {
        chapterId: activeChapter.id,
        mcqAnswers: {},
        mcqScore: 0,
        mcqSubmitted: false,
        essayAnswer: '',
        completed: false,
      }
    : {
        chapterId: 1,
        mcqAnswers: {},
        mcqScore: 0,
        mcqSubmitted: false,
        essayAnswer: '',
        completed: false,
      };

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-slate-950 select-none">
      {/* Dedicated WebGL Mount Container */}
      <div ref={canvasMountRef} className="absolute inset-0 w-full h-full touch-none" />

      {/* Login Modal before entering city */}
      {!hasEnteredWorld && (
        <LoginModal
          initialProfile={profile}
          onStartGame={handleStartGame}
          onGoogleLogin={handleGoogleLogin}
          isGoogleLoading={isGoogleLoading}
          googleError={googleError}
        />
      )}

      {/* Active HUD Overlays */}
      {hasEnteredWorld && (
        <>
          {/* Top-Left: GTA Radar Minimap + Compact Identity (hidden in HP Fullscreen so nothing blocks screen) */}
          {!isMobileFullscreen && (
            <div className="fixed top-3 left-3 z-20 flex items-start gap-2.5 pointer-events-none">
              <div className="pointer-events-auto">
                <MinimapRadar
                  playerPos={playerPos}
                  remotePlayers={remotePlayers}
                  completedChapters={progress.completedChapters}
                  onSelectChapter={(id) => {
                    const ch = CHAPTERS.find((c) => c.id === id);
                    if (ch) {
                      const fx = ch.buildingPos.x + Math.sin(ch.buildingPos.rotY) * 9.5;
                      const fz = ch.buildingPos.z + Math.cos(ch.buildingPos.rotY) * 9.5;
                      engineRef.current?.teleportNear(fx, fz);
                    }
                  }}
                  onSelectVersus={() => {
                    engineRef.current?.teleportNear(VERSUS_BUILDING_POS.x, 96);
                  }}
                />
              </div>

              <div className="px-3 py-2 rounded-xl bg-slate-950/85 border border-white/15 shadow-lg max-w-[170px] sm:max-w-[230px]">
                <p className="text-xs font-bold text-white truncate">{profile.name}</p>
                <p className="text-[11px] text-slate-300 truncate">
                  {profile.className} · {profile.school}
                </p>
                <p className="font-mono-tabular text-[11px] font-semibold text-amber-300 mt-0.5">
                  Lv.{progress.level} · Bab {progress.completedChapters.length}/11 · {totalAnswered} Soal
                </p>
              </div>
            </div>
          )}

          {/* Incoming Versus Challenge Banner */}
          {incomingChallenge && (
            <div className="fixed top-28 sm:top-4 left-1/2 -translate-x-1/2 z-30 w-[92vw] max-w-md p-3.5 rounded-2xl bg-rose-950/95 border-2 border-amber-400 shadow-2xl flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                  <Swords className="w-4 h-4" />
                  Tantangan Gedung Versus!
                </p>
                <p className="text-xs text-white truncate mt-0.5">
                  {incomingChallenge.fromName} ({incomingChallenge.fromClass}) mengajakmu adu TKA 1v1
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    wsRef.current?.send(
                      JSON.stringify({
                        type: 'versus:accept',
                        matchId: incomingChallenge.matchId,
                        fromId: incomingChallenge.fromId,
                      })
                    );
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
                >
                  Terima
                </button>
                <button
                  onClick={() => {
                    wsRef.current?.send(
                      JSON.stringify({
                        type: 'versus:decline',
                        matchId: incomingChallenge.matchId,
                        fromId: incomingChallenge.fromId,
                      })
                    );
                    setIncomingChallenge(null);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Tolak
                </button>
              </div>
            </div>
          )}

          {/* Top-Right: Online Players, Gedung Versus, Weather/Time & Mobile Fullscreen */}
          {isMobileFullscreen ? (
            <div className="fixed top-3 right-3 z-20 flex items-center gap-1.5">
              <button
                onClick={toggleMobileFullscreen}
                title="Keluar Layar Penuh HP"
                aria-label="Keluar dari mode layar penuh HP"
                className="px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
              >
                <Minimize2 className="w-4 h-4 text-amber-300" />
                <span>Normal</span>
              </button>
            </div>
          ) : (
            <div className="fixed top-3 right-3 z-20 flex flex-col items-end gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setOnlineDrawerOpen(true)}
                  className="px-3 py-2 rounded-xl bg-slate-950/88 hover:bg-slate-900 border border-emerald-400/40 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg whitespace-nowrap"
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Online ({remotePlayers.length + 1})</span>
                </button>

                <button
                  onClick={() => setVersusModalOpen(true)}
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 border border-amber-300/60 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg whitespace-nowrap"
                >
                  <Swords className="w-4 h-4 text-amber-200" />
                  <span className="hidden sm:inline">Versus</span>
                </button>

                <button
                  onClick={() => setChaptersQuickOpen((v) => !v)}
                  className="px-3 py-2 rounded-xl bg-slate-950/88 hover:bg-slate-900 border border-sky-400/40 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg whitespace-nowrap"
                >
                  <BookMarked className="w-4 h-4 text-sky-400" />
                  <span className="hidden sm:inline">11 Bab</span>
                </button>

                <button
                  onClick={toggleMobileFullscreen}
                  title="Layar Penuh HP (Bebas Penghalang)"
                  aria-label="Aktifkan mode layar penuh HP"
                  className="lg:hidden p-2 rounded-xl bg-slate-950/88 hover:bg-slate-900 border border-amber-400/45 text-amber-300 shadow-lg"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={cycleTimeMode}
                  title={`Cuaca Lokal (${weatherState.locationLabel}): Klik untuk ganti mode waktu`}
                  className="px-2.5 py-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-white/15 text-slate-100 text-xs font-semibold flex items-center gap-1.5 shadow-lg max-w-[165px] sm:max-w-none"
                >
                  <WeatherIcon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="truncate">{timeModeBadgeText}</span>
                </button>

                <button
                  onClick={() => {
                    const next = !musicOn;
                    setMusicOn(next);
                    audioManager.setMusicEnabled(next);
                  }}
                  title="Musik Latar"
                  className={`p-2 rounded-xl border shadow-lg ${
                    musicOn
                      ? 'bg-slate-950/85 border-white/15 text-sky-300'
                      : 'bg-slate-950/85 border-white/10 text-slate-500'
                  }`}
                  aria-label="Aktifkan atau matikan musik latar"
                >
                  <Music className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const next = !voiceOn;
                    setVoiceOn(next);
                    audioManager.setVoiceEnabled(next);
                  }}
                  title="Pemandu Suara AI"
                  className={`p-2 rounded-xl border shadow-lg ${
                    voiceOn
                      ? 'bg-slate-950/85 border-white/15 text-emerald-300'
                      : 'bg-slate-950/85 border-white/10 text-slate-500'
                  }`}
                  aria-label="Aktifkan atau matikan pemandu suara AI"
                >
                  {voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setAvatarStudioOpen(true)}
                  title="Kustomisasi Avatar & Pendamping"
                  className="p-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-white/15 text-amber-300 shadow-lg"
                  aria-label="Buka studio avatar"
                >
                  <Palette className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setArchiveModalOpen(true)}
                  title="Sheet Arsip Guru"
                  className="px-2.5 py-2 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-white/15 text-emerald-300 text-xs font-semibold flex items-center gap-1 shadow-lg"
                  aria-label="Buka sheet arsip guru"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden md:inline">Sheet Guru</span>
                </button>
              </div>
            </div>
          )}

          {/* Collapsible 11-Chapter + Gedung Versus Quick Navigation Drawer */}
          {chaptersQuickOpen && (
            <div className="fixed top-28 right-3 z-30 w-72 max-h-[60dvh] rounded-2xl bg-slate-900/95 border border-white/15 shadow-2xl overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Peta Cepat Kota TKA</span>
                <button
                  onClick={() => setChaptersQuickOpen(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Tutup
                </button>
              </div>
              <div className="overflow-y-auto custom-scroll p-2 space-y-1.5">
                <button
                  onClick={() => {
                    engineRef.current?.teleportNear(VERSUS_BUILDING_POS.x, 96);
                    setChaptersQuickOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl bg-rose-600/25 hover:bg-rose-600/35 border border-rose-400/40 text-left flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-amber-300 truncate">
                      Gedung Versus: Adu TKA 1v1
                    </p>
                    <p className="text-[11px] text-rose-200 truncate">125 Soal Teks Bacaan Acak</p>
                  </div>
                  <Swords className="w-4 h-4 text-amber-300 shrink-0" />
                </button>

                {CHAPTERS.map((ch) => {
                  const done = progress.completedChapters.includes(ch.id);
                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        const fx = ch.buildingPos.x + Math.sin(ch.buildingPos.rotY) * 9.5;
                        const fz = ch.buildingPos.z + Math.cos(ch.buildingPos.rotY) * 9.5;
                        engineRef.current?.teleportNear(fx, fz);
                        setChaptersQuickOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-white/5 text-left flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          Bab {ch.id}: {ch.shortTitle}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{ch.competency}</p>
                      </div>
                      <span
                        className={`text-[11px] font-bold shrink-0 ${
                          done ? 'text-amber-300' : 'text-sky-400'
                        }`}
                      >
                        {done ? 'Selesai' : 'Kunjungi'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom-Left: Circular Analog Joystick */}
          <div className="fixed bottom-4 left-4 z-20">
            <Joystick onChange={(vec) => engineRef.current?.setJoystickVector(vec.x, vec.y)} />
          </div>

          {/* Bottom-Center / Right: Contextual Building Prompt or Interior Controls */}
          {insideChapter ? (
            <div className="fixed bottom-4 right-4 left-36 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto z-20 flex flex-col items-end sm:items-center gap-2">
              {(() => {
                const score = progress.chapters[insideChapter.id]?.mcqScore || 0;
                const built = Math.min(5, Math.floor(score / 2));
                const nextObj = INTERIOR_BUILD_REWARDS[built];
                return (
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-amber-400/40 text-[11px] text-slate-200 shadow-lg max-w-full truncate">
                    <span className="font-bold text-amber-300">
                      Objek Bab {insideChapter.id}: {built}/5 Terbangun
                    </span>
                    <span className="hidden sm:inline text-slate-300">
                      {nextObj
                        ? ` · Jawab ${nextObj.requiredCorrect} benar -> ${nextObj.name}`
                        : ' · Semua objek gedung lengkap!'}
                    </span>
                  </div>
                );
              })()}
              <div className="flex flex-wrap items-center justify-end sm:justify-center gap-2">
                <button
                  onClick={() => {
                    setChapterModalTab('video');
                    setChapterModalOpen(true);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xl whitespace-nowrap"
                >
                  <PlayCircle className="w-4 h-4" />
                  Video Materi
                </button>
                <button
                  onClick={() => {
                    setChapterModalTab('quiz');
                    setChapterModalOpen(true);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xl whitespace-nowrap"
                >
                  <BookMarked className="w-4 h-4" />
                  Soal & Refleksi
                </button>
                <button
                  onClick={() => {
                    engineRef.current?.exitBuilding();
                    setInsideChapter(null);
                    setChapterModalOpen(false);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-xl whitespace-nowrap"
                >
                  <DoorOpen className="w-4 h-4" />
                  Keluar Kota
                </button>
              </div>
            </div>
          ) : nearVersus ? (
            <div className="fixed bottom-5 right-4 left-36 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto z-20 flex justify-end sm:justify-center">
              <button
                onClick={() => setVersusModalOpen(true)}
                className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-2xl border-2 border-amber-300 flex items-center gap-2 max-w-full"
              >
                <Swords className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="truncate">Masuk Gedung Versus (Adu TKA 1v1)</span>
              </button>
            </div>
          ) : (
            nearbyChapter && (
              <div className="fixed bottom-5 right-4 left-36 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto z-20 flex justify-end sm:justify-center">
                <button
                  onClick={() => {
                    const savedScore = progressRef.current.chapters[nearbyChapter.id]?.mcqScore || 0;
                    engineRef.current?.enterBuilding(nearbyChapter, savedScore);
                  }}
                  className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl border-2 border-white flex items-center gap-2 max-w-full"
                >
                  <DoorOpen className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    Masuk Gedung Bab {nearbyChapter.id}: {nearbyChapter.shortTitle}
                  </span>
                </button>
              </div>
            )
          )}

          {/* Modals */}
          <OnlinePlayersDrawer
            open={onlineDrawerOpen}
            onClose={() => setOnlineDrawerOpen(false)}
            localProfile={profile}
            localPos={playerPos}
            localLevel={progress.level}
            localCompleted={progress.completedChapters.length}
            remotePlayers={remotePlayers}
            onVisitPlayer={(rp) => {
              engineRef.current?.teleportNear(rp.x + 2.5, rp.z + 2.5);
            }}
            onChallengePlayer={(rp) => {
              handleChallengePlayer(rp.id);
            }}
          />

          <AvatarStudioModal
            open={avatarStudioOpen}
            onClose={() => setAvatarStudioOpen(false)}
            avatar={profile.avatar}
            onSave={handleSaveAvatar}
          />

          <ChapterModal
            open={chapterModalOpen}
            initialTab={chapterModalTab}
            chapter={insideChapter}
            progress={activeChapterProgress}
            profile={profile}
            onClose={() => setChapterModalOpen(false)}
            onExitBuilding={() => {
              setChapterModalOpen(false);
              engineRef.current?.exitBuilding();
              setInsideChapter(null);
            }}
            onUpdateProgress={handleUpdateChapterProgress}
            onProfileGoogleConnected={(uid, email) => {
              setProfile((prev) => ({
                ...prev,
                uid,
                email,
                isGoogleSignedIn: true,
              }));
            }}
          />

          <VersusModal
            open={versusModalOpen}
            localProfile={profile}
            versusWins={progress.versusWins || 0}
            remotePlayers={remotePlayers}
            activeMatch={activeMatch}
            challengeStatus={challengeStatus}
            onClose={() => {
              setVersusModalOpen(false);
              setChallengeStatus(null);
            }}
            onChallengePlayer={handleChallengePlayer}
            onSubmitPvpAnswer={(matchId, round, isCorrect, timeBonus) => {
              wsRef.current?.send(
                JSON.stringify({
                  type: 'versus:answer',
                  matchId,
                  round,
                  isCorrect,
                  timeBonus,
                })
              );
            }}
            onRequestAdvanceRound={(matchId) => {
              wsRef.current?.send(
                JSON.stringify({
                  type: 'versus:advance',
                  matchId,
                })
              );
            }}
            onExitMatch={handleClaimVersusReward}
          />

          <TeacherArchiveModal
            open={archiveModalOpen}
            onClose={() => setArchiveModalOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <GameApp />
    </AppErrorBoundary>
  );
}
