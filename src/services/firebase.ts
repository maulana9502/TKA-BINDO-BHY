import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import type {
  ArchiveSubmission,
  AvatarConfig,
  PlayerProfile,
  RemotePlayer,
  StudentProgressState,
} from '../types/game';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');

// In-memory OAuth access token cache (never stored in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const TEACHER_ARCHIVE_EMAIL = 'maulana9502@gmail.com';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Firebase connection failed: the client is offline.');
      return false;
    }
    return true;
  }
}

export function initFirebaseAuth(
  onUserChange: (user: User | null, accessToken: string | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      cachedAccessToken = null;
      onUserChange(null, null);
    } else if (!isSigningIn) {
      onUserChange(user, cachedAccessToken);
    }
  });
}

export async function signInWithGoogleForGame(): Promise<{
  user: User;
  accessToken: string | null;
}> {
  isSigningIn = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }
    return { user: result.user, accessToken: cachedAccessToken };
  } finally {
    isSigningIn = false;
  }
}

export function getCachedDriveAccessToken(): string | null {
  return cachedAccessToken;
}

export async function signOutGoogle(): Promise<void> {
  cachedAccessToken = null;
  await signOut(auth);
}

export function isValidFirestoreId(id: string): boolean {
  return typeof id === 'string' && id.length >= 1 && id.length <= 128 && /^[a-zA-Z0-9_-]+$/.test(id);
}

function serializeAvatar(avatar: AvatarConfig): string {
  return JSON.stringify(avatar).slice(0, 290);
}

function deserializeAvatar(raw: string | undefined, fallback: AvatarConfig): AvatarConfig {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

export async function syncPlayerPresenceToFirestore(
  profile: PlayerProfile,
  progress: StudentProgressState,
  pos: { x: number; y: number; z: number; rotY: number },
  isOnline = true
): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified || !isValidFirestoreId(user.uid)) return;

  const answeredCount = Object.values(progress.chapters).reduce(
    (sum, ch) => sum + Object.keys(ch.mcqAnswers || {}).length,
    0
  );

  try {
    await setDoc(doc(db, 'players', user.uid), {
      uid: user.uid,
      name: profile.name.slice(0, 60) || 'Siswa',
      school: profile.school.slice(0, 80) || 'SMP Nusantara',
      className: profile.className.slice(0, 30) || 'VIII-A',
      level: Math.max(1, Math.min(999, progress.level)),
      xp: Math.max(0, Math.min(1000000, progress.xp)),
      completedCount: Math.max(0, Math.min(11, progress.completedChapters.length)),
      answeredCount: Math.max(0, Math.min(500, answeredCount)),
      x: Number(pos.x.toFixed(2)),
      y: Number(pos.y.toFixed(2)),
      z: Number(pos.z.toFixed(2)),
      rotY: Number(pos.rotY.toFixed(3)),
      isOnline,
      avatarSummary: serializeAvatar(profile.avatar),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore presence sync warning:', err);
  }
}

export function subscribeOnlinePlayersFromFirestore(
  defaultAvatar: AvatarConfig,
  onPlayers: (players: RemotePlayer[]) => void
): Unsubscribe {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) {
    return () => {};
  }
  const q = query(collection(db, 'players'), where('isOnline', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: RemotePlayer[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        if (d.uid === user.uid) return;
        list.push({
          id: String(d.uid),
          uid: String(d.uid),
          name: String(d.name || 'Siswa'),
          school: String(d.school || 'SMP'),
          className: String(d.className || 'VIII'),
          level: Number(d.level || 1),
          xp: Number(d.xp || 0),
          completedCount: Number(d.completedCount || 0),
          answeredCount: Number(d.answeredCount || 0),
          x: Number(d.x || 0),
          y: Number(d.y || 0),
          z: Number(d.z || 0),
          rotY: Number(d.rotY || 0),
          avatar: deserializeAvatar(d.avatarSummary, defaultAvatar),
          lastSeen: Date.now(),
        });
      });
      onPlayers(list);
    },
    (error) => {
      console.warn('Firestore players snapshot warning:', error);
    }
  );
}

export async function saveProgressToFirestore(
  profile: PlayerProfile,
  progress: StudentProgressState
): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified || !isValidFirestoreId(user.uid)) return;

  const ref = doc(db, 'progress', user.uid);
  try {
    const existing = await getDoc(ref);
    const payloadChapters = {
      ...progress.chapters,
      ...(progress.versusWins ? { _versusWins: progress.versusWins } : {}),
    };
    const chapterScores = JSON.stringify(payloadChapters).slice(0, 3900);
    const avatarSummary = JSON.stringify(profile.avatar).slice(0, 490);

    if (!existing.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        name: profile.name.slice(0, 60) || 'Siswa',
        school: profile.school.slice(0, 80) || 'SMP Nusantara',
        className: profile.className.slice(0, 30) || 'VIII-A',
        level: Math.max(1, Math.min(999, progress.level)),
        xp: Math.max(0, Math.min(1000000, progress.xp)),
        completedChapters: progress.completedChapters.slice(0, 11),
        chapterScores,
        avatarSummary,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(
        ref,
        {
          name: profile.name.slice(0, 60) || 'Siswa',
          school: profile.school.slice(0, 80) || 'SMP Nusantara',
          className: profile.className.slice(0, 30) || 'VIII-A',
          level: Math.max(1, Math.min(999, progress.level)),
          xp: Math.max(0, Math.min(1000000, progress.xp)),
          completedChapters: progress.completedChapters.slice(0, 11),
          chapterScores,
          avatarSummary,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `progress/${user.uid}`);
  }
}

export async function loadProgressFromFirestore(): Promise<{
  progress?: StudentProgressState;
  avatar?: Partial<AvatarConfig>;
  profileMeta?: { name: string; school: string; className: string };
} | null> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified || !isValidFirestoreId(user.uid)) return null;

  try {
    const snap = await getDoc(doc(db, 'progress', user.uid));
    if (!snap.exists()) return null;
    const d = snap.data();
    const rawChapters = d.chapterScores ? JSON.parse(d.chapterScores) : {};
    const versusWins = Number(rawChapters._versusWins || 0);
    delete rawChapters._versusWins;
    const avatar = d.avatarSummary ? JSON.parse(d.avatarSummary) : undefined;
    return {
      progress: {
        xp: Number(d.xp || 0),
        level: Number(d.level || 1),
        completedChapters: Array.isArray(d.completedChapters) ? d.completedChapters : [],
        chapters: rawChapters,
        versusWins,
      },
      avatar,
      profileMeta: {
        name: String(d.name || ''),
        school: String(d.school || ''),
        className: String(d.className || ''),
      },
    };
  } catch (err) {
    console.warn('Firestore progress load warning:', err);
    return null;
  }
}

export async function saveArchiveToFirestore(submission: ArchiveSubmission): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified || !isValidFirestoreId(user.uid)) return;

  const archiveId = submission.archiveId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  try {
    await setDoc(doc(db, 'archives', archiveId), {
      archiveId,
      uid: user.uid,
      studentName: submission.studentName.slice(0, 60),
      school: submission.school.slice(0, 80),
      className: submission.className.slice(0, 30),
      chapterId: submission.chapterId,
      chapterTitle: submission.chapterTitle.slice(0, 160),
      mcqScore: submission.mcqScore,
      mcqTotal: submission.mcqTotal,
      essayAnswer: (submission.essayAnswer || '').slice(0, 4000),
      driveLink: (submission.driveLink || '').slice(0, 500),
      teacherTarget: TEACHER_ARCHIVE_EMAIL,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `archives/${archiveId}`);
  }
}

export async function listArchivesFromFirestore(): Promise<ArchiveSubmission[]> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return [];

  const isTeacher =
    user.email === 'maulana9502@gmail.com' || user.email === 'maulanakarim9502@gmail.com';
  try {
    const q = isTeacher
      ? query(collection(db, 'archives'))
      : query(collection(db, 'archives'), where('uid', '==', user.uid));
    const snap = await getDocs(q);
    const items: ArchiveSubmission[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      items.push({
        archiveId: String(d.archiveId),
        uid: String(d.uid),
        studentName: String(d.studentName),
        school: String(d.school),
        className: String(d.className),
        chapterId: Number(d.chapterId),
        chapterTitle: String(d.chapterTitle),
        mcqScore: Number(d.mcqScore),
        mcqTotal: Number(d.mcqTotal),
        mcqAnswers: {},
        essayAnswer: String(d.essayAnswer || ''),
        driveLink: d.driveLink ? String(d.driveLink) : undefined,
        teacherTarget: String(d.teacherTarget || TEACHER_ARCHIVE_EMAIL),
        createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : new Date().toISOString(),
      });
    });
    return items;
  } catch (err) {
    console.warn('Firestore list archives warning:', err);
    return [];
  }
}
