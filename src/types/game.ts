export type TimeOfDayMode = 'real' | 'morning' | 'day' | 'afternoon' | 'night';

export type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'storm' | 'hot';

export interface LocalWeatherState {
  condition: WeatherCondition;
  temperatureC: number;
  label: string;
  locationLabel: string;
  timePeriod: 'Pagi' | 'Siang' | 'Sore' | 'Malam';
  localHour: number;
  isManualOverride?: boolean;
}

export type CompanionType = 'garuda' | 'robot' | 'cat' | 'dragon';

export type HairStyle = 'neat' | 'cap' | 'crown' | 'headset' | 'peci' | 'beanie';

export type FaceExpression = 'smile' | 'focus' | 'cool' | 'excited';

export interface AvatarConfig {
  skinColor: string;
  shirtColor: string;
  pantsColor: string;
  hairColor: string;
  hairStyle: HairStyle;
  expression: FaceExpression;
  companionType: CompanionType;
  companionColor: string;
}

export interface PlayerProfile {
  id: string;
  uid?: string;
  email?: string;
  name: string;
  school: string;
  className: string;
  avatar: AvatarConfig;
  isGoogleSignedIn: boolean;
}

export interface ChapterProgress {
  chapterId: number;
  mcqAnswers: Record<number, string>;
  mcqScore: number;
  mcqSubmitted: boolean;
  essayAnswer: string;
  driveLink?: string;
  completed: boolean;
  archivedAt?: string;
}

export interface StudentProgressState {
  xp: number;
  level: number;
  completedChapters: number[];
  chapters: Record<number, ChapterProgress>;
  versusWins?: number;
}

export interface RemotePlayer {
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
  avatar: AvatarConfig;
  isMoving?: boolean;
  lastSeen?: number;
}

export interface McqQuestion {
  id: number;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  answer: 'A' | 'B' | 'C' | 'D';
}

export interface VersusQuestion {
  id: number;
  category: string;
  passageTitle: string;
  passageText: string;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  answer: 'A' | 'B' | 'C' | 'D';
}

export interface VersusChallengeIncoming {
  matchId: string;
  fromId: string;
  fromName: string;
  fromClass: string;
  fromSchool: string;
}

export interface VersusMatchState {
  matchId: string;
  player1: { id: string; name: string; className: string; score: number; answeredRound: number };
  player2: { id: string; name: string; className: string; score: number; answeredRound: number };
  questions: VersusQuestion[];
  currentRound: number;
  roundDeadline: number;
  status: 'active' | 'finished';
  winnerId?: string | null;
}

export interface GeneralVideoItem {
  id: string;
  title: string;
  url: string;
}

export interface ChapterData {
  id: number;
  shortTitle: string;
  title: string;
  competency: string;
  isOfficialPacket: boolean;
  videoTitle: string;
  videoUrl: string;
  secondaryVideoTitle?: string;
  secondaryVideoUrl?: string;
  usesGeneralVideoList?: boolean;
  videoConfidence: string;
  passageTitle: string;
  passageText: string;
  secondaryPassageTitle?: string;
  secondaryPassageText?: string;
  questions: McqQuestion[];
  essayPrompt: string;
  accentColor: string;
  buildingPos: { x: number; z: number; rotY: number };
}

export interface ArchiveSubmission {
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
