// types/game.ts - Core types for LanguaVoya

export type TargetLanguage = 'fr' | 'es' | 'it' | 'en';
export type InterfaceLanguage = 'en' | 'fr' | 'es' | 'it' | 'de';
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type GameMode = 'loading' | 'world' | 'conversation' | 'interstitial' | 'error';
export type OverlayType = null | 'journey' | 'journal' | 'settings' | 'help' | 'pause' | 'account' | 'multiplayer';

export type LocationId = 'apartment' | 'grocery' | 'transit' | 'cafe' | 'community';

export interface LocationInfo {
  id: LocationId;
  name: string;
  nameLocalized: Record<TargetLanguage, string>;
  coords: [number, number, number];
  description: string;
}

export type TaskStatus = 'locked' | 'available' | 'current' | 'done' | 'done-with-help';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  targetNpcId?: string;
  targetLocationId?: LocationId;
  requiredIntent?: string;
}

export interface DayScenario {
  dayNumber: number;
  chapterTitle: string;
  scenarioTitle: string;
  teaser: string;
  whyItMatters: string;
  targetLocation: LocationId;
  keyNpcId: string;
  keyWords: string[];
  tasks: Task[];
  unlockMessage?: string;
}

export interface CharacterProfile {
  id: string;
  displayName: string;
  role: string;
  locationId: LocationId;
  coords: [number, number, number];
  rotation: number;
  avatarColor: string;
  personality: string;
  voiceGender: 'male' | 'female';
}

export type PhraseStatus = 'new' | 'needs-practice' | 'comfortable';

export interface SavedPhrase {
  id: string;
  phraseText: string;
  targetLanguage: TargetLanguage;
  translation: string;
  status: PhraseStatus;
  sourceDay: number;
  sourceNpcId: string;
  bookmarked: boolean;
  timesPracticed: number;
  lastPracticed?: string;
  context?: string;
}

export interface ConversationTurn {
  id: string;
  speaker: 'player' | 'npc';
  speakerName: string;
  text: string;
  translation?: string;
  audioAvailable?: boolean;
  correction?: {
    original: string;
    suggested: string;
    explanation: string;
  };
  timestamp: number;
}

export interface ConversationRecord {
  id: string;
  day: number;
  npcId: string;
  npcName: string;
  turns: ConversationTurn[];
  completedAt: string;
}

export interface HintLadderStep {
  level: 1 | 2 | 3;
  clue: string;
  phrases?: string[];
  translation?: string;
  modelReply?: string;
}

export interface FeedbackData {
  title: string;
  managedLines: string[];
  tips: string[];
  newExpressions: Array<{ text: string; translation: string }>;
}

export type TurnPhase =
  | 'awaiting-player'
  | 'listening'
  | 'reviewing-transcript'
  | 'npc-thinking'
  | 'npc-speaking'
  | 'error';

export interface ActiveConversation {
  npcId: string;
  npcName: string;
  phase: TurnPhase;
  inputMode: 'text' | 'voice';
  transcript: string;
  hintLevel: 0 | 1 | 2 | 3;
  turns: ConversationTurn[];
  pendingFeedback?: FeedbackData;
  errorReason?: string;
}

export interface PlayerInventoryItem {
  id: string;
  name: string;
  quantity: number;
  iconName: string;
}

export interface PlayerSaveState {
  version: number;
  playerName: string;
  targetLanguage: TargetLanguage;
  interfaceLanguage: InterfaceLanguage;
  cefrLevel: CefrLevel;
  currentDay: number;
  currentLocation: LocationId;
  playerCoords: [number, number, number];
  playerRotation: number;
  money: number;
  inventory: PlayerInventoryItem[];
  completedDays: number[];
  scenarios: Record<number, DayScenario>;
  savedPhrases: SavedPhrase[];
  conversationHistory: ConversationRecord[];
  tomorrowPhraseQueue: string[]; // phrase IDs to prompt tomorrow
  settings: {
    voiceEnabled: boolean;
    autoTranslate: boolean;
    autoSendVoice: boolean;
    fontSize: 'S' | 'M' | 'L' | 'XL';
    dyslexicFont: boolean;
    reducedMotion: boolean;
    audioVolume: number;
    speechRate: number;
  };
}
