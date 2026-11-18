import express from 'express';
import type { Request, Response } from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'cloud-store.json');
const TEACHER_TARGET_EMAIL = 'maulana9502@gmail.com';
const TOTAL_VERSUS_BANK_SIZE = 125;

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

interface StoredPlayerProgress {
  key: string;
  uid?: string;
  name: string;
  school: string;
  className: string;
  avatar: Record<string, unknown>;
  progress: Record<string, unknown>;
  updatedAt: string;
}

interface StoredArchive {
  archiveId: string;
  uid: string;
  studentName: string;
  school: string;
  className: string;
  chapterId: number;
  chapterTitle: string;
  mcqScore: number;
  mcqTotal: number;
  mcqAnswers: Record<number, string>;
  essayAnswer: string;
  driveLink?: string;
  teacherTarget: string;
  createdAt: string;
}

interface CloudStore {
  progressByKey: Record<string, StoredPlayerProgress>;
  archives: StoredArchive[];
}

function loadStore(): CloudStore {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as CloudStore;
      return {
        progressByKey: parsed.progressByKey || {},
        archives: Array.isArray(parsed.archives) ? parsed.archives : [],
      };
    }
  } catch (err) {
    console.warn('Gagal membaca cloud-store.json:', err);
  }
  return { progressByKey: {}, archives: [] };
}

function saveStore(store: CloudStore): void {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Gagal menulis cloud-store.json:', err);
  }
}

const cloudStore = loadStore();

function makeProgressKey(school: string, className: string, name: string, uid?: string): string {
  if (uid && uid.trim()) return `uid:${uid.trim()}`;
  const s = school.trim().toLowerCase().replace(/\s+/g, '_');
  const c = className.trim().toLowerCase().replace(/\s+/g, '_');
  const n = name.trim().toLowerCase().replace(/\s+/g, '_');
  return `stu:${s}|${c}|${n}`;
}

interface ConnectedPlayer {
  id: string;
  uid?: string;
  name: string;
  school: string;
  className: string;
  level: number;
  xp: number;
  completedCount: number;
  answeredCount: number;
  x: number;
  y: number;
  z: number;
  rotY: number;
  avatar: Record<string, unknown>;
  isMoving: boolean;
  lastSeen: number;
}

interface MatchFighter {
  id: string;
  name: string;
  className: string;
  score: number;
  answeredRound: number;
}

interface ServerVersusMatch {
  matchId: string;
  player1: MatchFighter;
  player2: MatchFighter;
  questionIds: number[];
  currentRound: number;
  roundDeadline: number;
  status: 'active' | 'finished';
  winnerId: string | null;
}

const activePlayers = new Map<string, { ws?: WebSocket; player: ConnectedPlayer }>();
const activeMatches = new Map<string, ServerVersusMatch>();

function pickServerQuestionIds(count = 5): number[] {
  const pool: number[] = [];
  for (let i = 1; i <= TOTAL_VERSUS_BANK_SIZE; i++) pool.push(i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  // Spread across different passages (passages are groups of 5 consecutive IDs)
  const chosen: number[] = [];
  const usedPassages = new Set<number>();
  for (const id of pool) {
    if (chosen.length >= count) break;
    const pIdx = Math.floor((id - 1) / 5);
    if (!usedPassages.has(pIdx)) {
      chosen.push(id);
      usedPassages.add(pIdx);
    }
  }
  return chosen;
}

function sendToPlayer(playerId: string, payload: unknown): boolean {
  const entry = activePlayers.get(playerId);
  if (entry?.ws && entry.ws.readyState === WebSocket.OPEN) {
    entry.ws.send(JSON.stringify(payload));
    return true;
  }
  return false;
}

function broadcastAll(payload: unknown, excludeId?: string): void {
  const msg = JSON.stringify(payload);
  for (const [id, entry] of activePlayers.entries()) {
    if (excludeId && id === excludeId) continue;
    if (entry.ws && entry.ws.readyState === WebSocket.OPEN) {
      entry.ws.send(msg);
    }
  }
}

function getPlayersSnapshot(excludeId?: string): ConnectedPlayer[] {
  const list: ConnectedPlayer[] = [];
  for (const [id, entry] of activePlayers.entries()) {
    if (excludeId && id === excludeId) continue;
    list.push(entry.player);
  }
  return list;
}

function sendWorldSnapshot(ws: WebSocket, selfId: string): void {
  if (ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ type: 'world:snapshot', players: getPlayersSnapshot(selfId) }));
}

async function fetchJsonWithTimeout(url: string, timeoutMs = 3000): Promise<Record<string, unknown> | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: '4mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, onlineCount: activePlayers.size });
  });

  app.get('/api/weather', async (req: Request, res: Response) => {
    let lat = req.query.lat ? Number(req.query.lat) : NaN;
    let lon = req.query.lon ? Number(req.query.lon) : NaN;
    let locationLabel = 'Lokasi Anda';

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
      const isPublicIp =
        forwarded &&
        !forwarded.startsWith('127.') &&
        !forwarded.startsWith('10.') &&
        !forwarded.startsWith('192.168.') &&
        forwarded !== '::1';
      const geoUrl = isPublicIp ? `https://ipwho.is/${encodeURIComponent(forwarded)}` : 'https://ipwho.is/';
      const geo = await fetchJsonWithTimeout(geoUrl, 2500);
      if (geo && geo.success !== false && typeof geo.latitude === 'number' && typeof geo.longitude === 'number') {
        lat = geo.latitude;
        lon = geo.longitude;
        const city = String(geo.city || geo.region || '').trim();
        if (city) locationLabel = city;
      } else {
        // Default Indonesia center (Jakarta)
        lat = -6.2088;
        lon = 106.8456;
        locationLabel = 'Indonesia';
      }
    }

    const meteo = await fetchJsonWithTimeout(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,weather_code&timezone=auto`,
      3000
    );

    const current = (meteo?.current as Record<string, unknown> | undefined) || {};
    const weatherCode = Number(current.weather_code ?? 0);
    const temperatureC = Number(current.temperature_2m ?? 29);

    res.json({
      weatherCode: Number.isFinite(weatherCode) ? weatherCode : 0,
      temperatureC: Number.isFinite(temperatureC) ? temperatureC : 29,
      locationLabel,
    });
  });

  app.get('/api/multiplayer/players', (req: Request, res: Response) => {
    const excludeId = req.query.excludeId ? String(req.query.excludeId) : undefined;
    res.json({ players: getPlayersSnapshot(excludeId) });
  });

  app.post('/api/multiplayer/heartbeat', (req: Request, res: Response) => {
    const p = req.body as ConnectedPlayer | undefined;
    if (!p?.id || !p?.name) {
      res.status(400).json({ error: 'Data pemain tidak valid' });
      return;
    }
    const existing = activePlayers.get(p.id);
    const updated: ConnectedPlayer = {
      ...p,
      lastSeen: Date.now(),
    };
    activePlayers.set(p.id, { ws: existing?.ws, player: updated });
    if (!existing) {
      broadcastAll({ type: 'player:upsert', player: updated }, p.id);
    }
    res.json({ ok: true, players: getPlayersSnapshot(p.id) });
  });

  app.get('/api/progress', (req: Request, res: Response) => {
    const school = String(req.query.school || '');
    const className = String(req.query.className || '');
    const name = String(req.query.name || '');
    const uid = req.query.uid ? String(req.query.uid) : undefined;

    const uidKey = uid ? makeProgressKey(school, className, name, uid) : '';
    const stuKey = makeProgressKey(school, className, name);

    const found = (uidKey && cloudStore.progressByKey[uidKey]) || cloudStore.progressByKey[stuKey] || null;
    res.json({ found });
  });

  app.post('/api/progress', (req: Request, res: Response) => {
    const body = req.body as {
      uid?: string;
      name?: string;
      school?: string;
      className?: string;
      avatar?: Record<string, unknown>;
      progress?: Record<string, unknown>;
    };
    if (!body?.name || !body?.school || !body?.className) {
      res.status(400).json({ error: 'Identitas siswa tidak lengkap' });
      return;
    }

    const stuKey = makeProgressKey(body.school, body.className, body.name);
    const record: StoredPlayerProgress = {
      key: stuKey,
      uid: body.uid,
      name: body.name,
      school: body.school,
      className: body.className,
      avatar: body.avatar || {},
      progress: body.progress || {},
      updatedAt: new Date().toISOString(),
    };
    cloudStore.progressByKey[stuKey] = record;
    if (body.uid) {
      cloudStore.progressByKey[makeProgressKey(body.school, body.className, body.name, body.uid)] = record;
    }
    saveStore(cloudStore);
    res.json({ ok: true, savedAt: record.updatedAt });
  });

  app.get('/api/archive', (_req: Request, res: Response) => {
    res.json({
      teacherTarget: TEACHER_TARGET_EMAIL,
      items: cloudStore.archives,
    });
  });

  app.post('/api/archive', (req: Request, res: Response) => {
    const item = req.body as StoredArchive;
    if (!item?.archiveId || !item?.studentName || !item?.school || !item?.className) {
      res.status(400).json({ error: 'Data arsip tidak lengkap' });
      return;
    }
    const existingIdx = cloudStore.archives.findIndex((a) => a.archiveId === item.archiveId);
    const sanitized: StoredArchive = {
      ...item,
      teacherTarget: TEACHER_TARGET_EMAIL,
      createdAt: item.createdAt || new Date().toISOString(),
    };
    if (existingIdx >= 0) {
      cloudStore.archives[existingIdx] = sanitized;
    } else {
      cloudStore.archives.unshift(sanitized);
    }
    saveStore(cloudStore);
    broadcastAll({ type: 'archive:updated', item: sanitized });
    res.json({ ok: true, item: sanitized });
  });

  // Vite dev middleware or static dist
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const httpServer = http.createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    let playerId = '';

    ws.on('message', (rawData) => {
      try {
        const msg = JSON.parse(String(rawData)) as {
          type: string;
          player?: ConnectedPlayer;
          x?: number;
          y?: number;
          z?: number;
          rotY?: number;
          isMoving?: boolean;
          targetId?: string;
          matchId?: string;
          fromId?: string;
          round?: number;
          isCorrect?: boolean;
          timeBonus?: number;
        };

        if (msg.type === 'player:join' && msg.player) {
          playerId = msg.player.id;
          const p: ConnectedPlayer = {
            ...msg.player,
            lastSeen: Date.now(),
          };
          activePlayers.set(playerId, { ws, player: p });
          sendWorldSnapshot(ws, playerId);
          broadcastAll({ type: 'player:upsert', player: p }, playerId);
        } else if (msg.type === 'player:move' && playerId) {
          const entry = activePlayers.get(playerId);
          if (entry) {
            entry.player.x = Number(msg.x ?? entry.player.x);
            entry.player.y = Number(msg.y ?? entry.player.y);
            entry.player.z = Number(msg.z ?? entry.player.z);
            entry.player.rotY = Number(msg.rotY ?? entry.player.rotY);
            entry.player.isMoving = Boolean(msg.isMoving);
            entry.player.lastSeen = Date.now();
            broadcastAll(
              {
                type: 'player:moved',
                id: playerId,
                x: entry.player.x,
                y: entry.player.y,
                z: entry.player.z,
                rotY: entry.player.rotY,
                isMoving: entry.player.isMoving,
              },
              playerId
            );
          }
        } else if (msg.type === 'player:update' && msg.player && playerId) {
          const entry = activePlayers.get(playerId);
          if (entry) {
            entry.player = { ...entry.player, ...msg.player, lastSeen: Date.now() };
            broadcastAll({ type: 'player:upsert', player: entry.player }, playerId);
          }
        } else if (msg.type === 'versus:challenge' && playerId && msg.targetId) {
          const challenger = activePlayers.get(playerId)?.player;
          if (!challenger) return;
          const matchId = `vs_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
          const delivered = sendToPlayer(msg.targetId, {
            type: 'versus:incoming',
            challenge: {
              matchId,
              fromId: challenger.id,
              fromName: challenger.name,
              fromClass: challenger.className,
              fromSchool: challenger.school,
            },
          });
          if (!delivered) {
            sendToPlayer(playerId, {
              type: 'versus:error',
              message: 'Pemain lawan sedang tidak terhubung ke WebSocket atau baru keluar.',
            });
          }
        } else if (msg.type === 'versus:decline' && playerId && msg.fromId && msg.matchId) {
          const decliner = activePlayers.get(playerId)?.player;
          sendToPlayer(msg.fromId, {
            type: 'versus:declined',
            matchId: msg.matchId,
            byName: decliner?.name || 'Pemain lain',
          });
        } else if (msg.type === 'versus:accept' && playerId && msg.fromId && msg.matchId) {
          const p1 = activePlayers.get(msg.fromId)?.player;
          const p2 = activePlayers.get(playerId)?.player;
          if (!p1 || !p2) {
            sendToPlayer(playerId, {
              type: 'versus:error',
              message: 'Penantang sudah keluar dari permainan.',
            });
            return;
          }
          const questionIds = pickServerQuestionIds(5);
          const match: ServerVersusMatch = {
            matchId: msg.matchId,
            player1: { id: p1.id, name: p1.name, className: p1.className, score: 0, answeredRound: -1 },
            player2: { id: p2.id, name: p2.name, className: p2.className, score: 0, answeredRound: -1 },
            questionIds,
            currentRound: 0,
            roundDeadline: Date.now() + 26000,
            status: 'active',
            winnerId: null,
          };
          activeMatches.set(msg.matchId, match);
          sendToPlayer(p1.id, { type: 'versus:started', match });
          sendToPlayer(p2.id, { type: 'versus:started', match });
        } else if (msg.type === 'versus:answer' && playerId && msg.matchId) {
          const match = activeMatches.get(msg.matchId);
          if (!match || match.status !== 'active') return;
          const round = Number(msg.round ?? match.currentRound);
          if (round !== match.currentRound) return;

          const fighter =
            match.player1.id === playerId
              ? match.player1
              : match.player2.id === playerId
                ? match.player2
                : null;
          if (!fighter || fighter.answeredRound >= round) return;

          fighter.answeredRound = round;
          if (msg.isCorrect) {
            const bonus = Math.max(0, Math.min(50, Number(msg.timeBonus ?? 0)));
            fighter.score += 100 + bonus;
          }

          if (match.player1.answeredRound >= round && match.player2.answeredRound >= round) {
            if (match.currentRound + 1 >= match.questionIds.length) {
              match.status = 'finished';
              match.winnerId =
                match.player1.score > match.player2.score
                  ? match.player1.id
                  : match.player2.score > match.player1.score
                    ? match.player2.id
                    : null;
            } else {
              match.currentRound += 1;
              match.roundDeadline = Date.now() + 26000;
            }
          }

          sendToPlayer(match.player1.id, { type: 'versus:state', match });
          sendToPlayer(match.player2.id, { type: 'versus:state', match });

          if (match.status === 'finished') {
            setTimeout(() => activeMatches.delete(match.matchId), 30000);
          }
        } else if (msg.type === 'versus:advance' && playerId && msg.matchId) {
          const match = activeMatches.get(msg.matchId);
          if (!match || match.status !== 'active') return;
          if (Date.now() < match.roundDeadline - 1000) return;

          if (match.currentRound + 1 >= match.questionIds.length) {
            match.status = 'finished';
            match.winnerId =
              match.player1.score > match.player2.score
                ? match.player1.id
                : match.player2.score > match.player1.score
                  ? match.player2.id
                  : null;
          } else {
            match.currentRound += 1;
            match.roundDeadline = Date.now() + 26000;
          }
          sendToPlayer(match.player1.id, { type: 'versus:state', match });
          sendToPlayer(match.player2.id, { type: 'versus:state', match });
        }
      } catch (err) {
        console.warn('WS parse error:', err);
      }
    });

    ws.on('close', () => {
      if (playerId && activePlayers.has(playerId)) {
        const entry = activePlayers.get(playerId);
        if (entry && entry.ws === ws) {
          activePlayers.delete(playerId);
          broadcastAll({ type: 'player:left', id: playerId });
        }
      }
    });
  });

  // Periodic stale connection cleanup (keeps both WS and HTTP fallback players fresh)
  setInterval(() => {
    const now = Date.now();
    for (const [id, entry] of activePlayers.entries()) {
      const wsAlive = entry.ws && entry.ws.readyState === WebSocket.OPEN;
      if (now - entry.player.lastSeen > 45000 && !wsAlive) {
        activePlayers.delete(id);
        broadcastAll({ type: 'player:left', id });
      }
    }
  }, 15000);

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Nusantara Bahasa Quest server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
