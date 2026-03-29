export type GameMode =
  | 'Overall'
  | 'LTMs'
  | 'Vanilla'
  | 'UHC'
  | 'Pot'
  | 'NethOP'
  | 'SMP'
  | 'Sword'
  | 'Axe'
  | 'Mace'
  | 'Crystal'

export const GAME_MODES: GameMode[] = [
  'Overall',
  'LTMs',
  'Vanilla',
  'UHC',
  'Pot',
  'NethOP',
  'SMP',
  'Sword',
  'Axe',
  'Mace',
]

export type TierType =
  | 'HT1'
  | 'HT2'
  | 'HT3'
  | 'HT4'
  | 'HT5'
  | 'LT1'
  | 'LT2'
  | 'LT3'
  | 'LT4'
  | 'LT5'
  | 'MT1'
  | 'MT2'
  | 'MT3'
  | 'MT4'
  | 'MT5'

export const TIERS: TierType[] = [
  'HT1',
  'HT2',
  'HT3',
  'HT4',
  'HT5',
  'MT1',
  'MT2',
  'MT3',
  'MT4',
  'MT5',
  'LT1',
  'LT2',
  'LT3',
  'LT4',
  'LT5',
]

export interface TierInfo {
  color: string
  textColor: string
  bgGlow: string
  label: string
  gradient: string
}

export const TIER_INFO: Record<TierType, TierInfo> = {
  HT1: {
    color: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500',
    textColor: 'text-amber-950',
    bgGlow: 'shadow-amber-500/50',
    label: 'High Tier 1',
    gradient: 'from-amber-400 to-yellow-500',
  },
  HT2: {
    color: 'bg-gradient-to-r from-amber-500 to-orange-500',
    textColor: 'text-white',
    bgGlow: 'shadow-amber-500/40',
    label: 'High Tier 2',
    gradient: 'from-amber-500 to-orange-500',
  },
  HT3: {
    color: 'bg-gradient-to-r from-emerald-400 to-teal-500',
    textColor: 'text-white',
    bgGlow: 'shadow-emerald-500/40',
    label: 'High Tier 3',
    gradient: 'from-emerald-400 to-teal-500',
  },
  HT4: {
    color: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    textColor: 'text-white',
    bgGlow: 'shadow-cyan-500/40',
    label: 'High Tier 4',
    gradient: 'from-cyan-400 to-blue-500',
  },
  HT5: {
    color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    textColor: 'text-white',
    bgGlow: 'shadow-blue-500/40',
    label: 'High Tier 5',
    gradient: 'from-blue-500 to-indigo-600',
  },
  MT1: {
    color: 'bg-gradient-to-r from-purple-500 to-fuchsia-500',
    textColor: 'text-white',
    bgGlow: 'shadow-purple-500/40',
    label: 'Mid Tier 1',
    gradient: 'from-purple-500 to-fuchsia-500',
  },
  MT2: {
    color: 'bg-gradient-to-r from-fuchsia-500 to-pink-500',
    textColor: 'text-white',
    bgGlow: 'shadow-fuchsia-500/40',
    label: 'Mid Tier 2',
    gradient: 'from-fuchsia-500 to-pink-500',
  },
  MT3: {
    color: 'bg-gradient-to-r from-pink-500 to-rose-500',
    textColor: 'text-white',
    bgGlow: 'shadow-pink-500/40',
    label: 'Mid Tier 3',
    gradient: 'from-pink-500 to-rose-500',
  },
  MT4: {
    color: 'bg-gradient-to-r from-rose-500 to-red-500',
    textColor: 'text-white',
    bgGlow: 'shadow-rose-500/40',
    label: 'Mid Tier 4',
    gradient: 'from-rose-500 to-red-500',
  },
  MT5: {
    color: 'bg-gradient-to-r from-red-500 to-orange-600',
    textColor: 'text-white',
    bgGlow: 'shadow-red-500/40',
    label: 'Mid Tier 5',
    gradient: 'from-red-500 to-orange-600',
  },
  LT1: {
    color: 'bg-gradient-to-r from-slate-400 to-zinc-500',
    textColor: 'text-white',
    bgGlow: 'shadow-slate-500/30',
    label: 'Low Tier 1',
    gradient: 'from-slate-400 to-zinc-500',
  },
  LT2: {
    color: 'bg-gradient-to-r from-zinc-500 to-neutral-600',
    textColor: 'text-white',
    bgGlow: 'shadow-zinc-500/30',
    label: 'Low Tier 2',
    gradient: 'from-zinc-500 to-neutral-600',
  },
  LT3: {
    color: 'bg-gradient-to-r from-neutral-500 to-stone-600',
    textColor: 'text-white',
    bgGlow: 'shadow-neutral-500/30',
    label: 'Low Tier 3',
    gradient: 'from-neutral-500 to-stone-600',
  },
  LT4: {
    color: 'bg-gradient-to-r from-stone-500 to-gray-600',
    textColor: 'text-white',
    bgGlow: 'shadow-stone-500/30',
    label: 'Low Tier 4',
    gradient: 'from-stone-500 to-gray-600',
  },
  LT5: {
    color: 'bg-gradient-to-r from-gray-500 to-gray-700',
    textColor: 'text-white',
    bgGlow: 'shadow-gray-500/30',
    label: 'Low Tier 5',
    gradient: 'from-gray-500 to-gray-700',
  },
}

export type Region = 'NA' | 'EU' | 'BR' | 'AS' | 'OCE'

export const REGIONS: Region[] = ['NA', 'EU', 'BR', 'AS', 'OCE']

export const REGION_FLAGS: Record<Region, string> = {
  NA: '🇺🇸',
  EU: '🇪🇺',
  BR: '🇧🇷',
  AS: '🇯🇵',
  OCE: '🇦🇺',
}

export const REGION_NAMES: Record<Region, string> = {
  NA: 'North America',
  EU: 'Europe',
  BR: 'Brazil',
  AS: 'Asia',
  OCE: 'Oceania',
}

export interface PlayerTier {
  mode: GameMode
  tier: TierType
  points: number
  peak?: TierType
  peakPoints?: number
  wins: number
  losses: number
  winStreak?: number
  bestWinStreak?: number
  tierDate?: Date
}

export interface Player {
  id: string
  nick: string
  region: Region
  tiers: PlayerTier[]
  totalMatches?: number
  joinedAt?: Date
  lastSeen?: Date
}
