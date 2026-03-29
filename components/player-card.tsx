'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { TierBadge } from './tier-badge'
import { ModeIcon } from './mode-icons'
import { PlayerProfile } from './player-profile'
import { Button } from '@/components/ui/button'
import { usePlayersStore } from '@/lib/store'
import { useSiteSettings } from '@/lib/site-settings'
import { GAME_MODES, type Player, type GameMode } from '@/lib/types'
import { formatNumber } from '@/lib/format'
import { Trash2 } from 'lucide-react'

interface PlayerCardProps {
  player: Player
  rank: number
  selectedMode: GameMode
}

// Player titles based on points - MCTiers style
function getPlayerTitle(totalPoints: number): { title: string; category: string; color: string } {
  // Top Tier
  if (totalPoints >= 400) return { title: 'Combat God', category: 'Top Tier', color: 'text-amber-400' }
  if (totalPoints >= 350) return { title: 'Combat Legend', category: 'Top Tier', color: 'text-amber-400' }
  if (totalPoints >= 300) return { title: 'Combat Master', category: 'Top Tier', color: 'text-amber-400' }
  // High Tier
  if (totalPoints >= 200) return { title: 'Combat Ace', category: 'High Tier', color: 'text-purple-400' }
  if (totalPoints >= 150) return { title: 'Combat Elite', category: 'High Tier', color: 'text-purple-400' }
  // Mid Tier
  if (totalPoints >= 100) return { title: 'Combat Skilled', category: 'Mid Tier', color: 'text-blue-400' }
  if (totalPoints >= 70) return { title: 'Combat Fighter', category: 'Mid Tier', color: 'text-blue-400' }
  // Low Tier
  if (totalPoints >= 30) return { title: 'Combat Rookie', category: 'Low Tier', color: 'text-gray-400' }
  return { title: 'Combat Beginner', category: 'Low Tier', color: 'text-gray-400' }
}

// Get rank background color for top 3
function getRankBackground(rank: number): string {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-amber-500/90 to-amber-600/90' // Gold
    case 2:
      return 'bg-gradient-to-r from-slate-400/90 to-slate-500/90' // Silver
    case 3:
      return 'bg-gradient-to-r from-orange-500/90 to-orange-600/90' // Bronze
    default:
      return 'bg-[#2a2d35]'
  }
}

// Region badge component
function RegionBadge({ region }: { region: string }) {
  return (
    <span className="px-3 py-1.5 rounded-md text-sm font-bold bg-emerald-500/90 text-white">
      {region}
    </span>
  )
}

export function PlayerCard({ player, rank, selectedMode }: PlayerCardProps) {
  const [profileOpen, setProfileOpen] = useState(false)
  const { isAdmin, removePlayer } = usePlayersStore()
  const { settings } = useSiteSettings()

  const safeTiers = Array.isArray(player?.tiers) ? player.tiers : []

  const currentTier = safeTiers.find((t) => t?.mode === selectedMode) || safeTiers[0]

  if (!currentTier) return null

  const totalPoints = safeTiers.reduce((acc, t) => acc + (t?.points || 0), 0)
  const { title: playerTitle, color: titleColor } = getPlayerTitle(totalPoints)

  // Check settings
  const showRankNumbers = settings.showRankNumbers !== false
  const showRegion = settings.showRegion !== false
  const showPlayerTitle = settings.showPlayerTitle !== false
  const showTop3Colors = settings.showTop3Colors !== false

  // Modes to display (first 8)
  const displayModes = GAME_MODES.slice(0, 8)

  // Get rank glow effect
  const getRankGlow = (r: number) => {
    if (!showTop3Colors) return ''
    switch (r) {
      case 1: return 'shadow-[0_0_20px_rgba(251,191,36,0.3)]'
      case 2: return 'shadow-[0_0_15px_rgba(148,163,184,0.25)]'
      case 3: return 'shadow-[0_0_15px_rgba(251,146,60,0.25)]'
      default: return ''
    }
  }

  return (
    <>
      <div 
        onClick={() => setProfileOpen(true)}
        className={cn(
          'group relative cursor-pointer',
          'bg-gradient-to-r from-[#1a1d24] to-[#1e2128]',
          'hover:from-[#1f2329] hover:to-[#252a32]',
          'border-b border-[#2a2d35]/50 last:border-b-0',
          'transition-all duration-300',
          showTop3Colors && rank <= 3 && 'hover:scale-[1.01]',
          getRankGlow(rank)
        )}
      >
        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center py-3 px-2 gap-3">
          {/* Rank Number with colored background for top 3 */}
          {showRankNumbers && (
            <div className={cn(
              'w-14 h-14 flex items-center justify-center flex-shrink-0 rounded-xl',
              'transition-all duration-300',
              showTop3Colors ? getRankBackground(rank) : 'bg-[#2a2d35]/80'
            )}>
              <span className={cn(
                'text-xl font-black',
                showTop3Colors && rank <= 3 ? 'text-white drop-shadow-lg' : 'text-muted-foreground/80'
              )}>
                #{rank}
              </span>
            </div>
          )}

          {/* Player Avatar - Face with nice border */}
          <div className={cn(
            'w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden',
            'bg-gradient-to-br from-[#2a2d35] to-[#1f2227]',
            'border-2 transition-all duration-300',
            showTop3Colors && rank === 1 && 'border-amber-500/50',
            showTop3Colors && rank === 2 && 'border-slate-400/50',
            showTop3Colors && rank === 3 && 'border-orange-500/50',
            (!showTop3Colors || rank > 3) && 'border-[#3a3d45]/50',
            'group-hover:border-primary/50'
          )}>
            <img
              src={`https://mc-heads.net/avatar/${player.nick}/56`}
              alt={player.nick}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                {player.nick}
              </span>
              {/* Main tier badge next to name */}
              <TierBadge 
                tier={currentTier.tier} 
                size="sm" 
                className="opacity-90"
              />
            </div>
            {showPlayerTitle && (
              <div className="flex items-center gap-1.5 text-sm mt-0.5">
                <span className={cn(titleColor, 'text-xs')}>&#9670;</span>
                <span className={cn(titleColor, 'font-medium')}>{playerTitle}</span>
                <span className="text-muted-foreground/50 text-xs">({formatNumber(totalPoints)} pts)</span>
              </div>
            )}
          </div>

          {/* Region Badge */}
          {showRegion && (
            <div className="flex-shrink-0">
              <RegionBadge region={player.region} />
            </div>
          )}

          {/* Mode Tier Icons - All modes visible on large screens */}
          <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
            {GAME_MODES.filter(m => m !== 'Overall').map((mode) => {
              const tier = safeTiers.find((t) => t.mode === mode)
              const hasTier = !!tier
              
              return (
                <div 
                  key={mode} 
                  className={cn(
                    'flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200',
                    hasTier 
                      ? 'bg-gradient-to-b from-[#2a2d35] to-[#22252b] hover:from-[#32363f] hover:to-[#2a2d35] shadow-sm' 
                      : 'bg-[#1a1d22]/50'
                  )}
                  title={`${mode}: ${tier?.tier || 'Sem tier'}`}
                >
                  <ModeIcon 
                    mode={mode} 
                    size={28} 
                    className={cn(
                      'transition-all duration-200',
                      !hasTier && 'opacity-20 grayscale'
                    )}
                  />
                  {hasTier ? (
                    <TierBadge 
                      tier={tier.tier} 
                      size="xs" 
                      className="text-[10px] px-1.5 py-0.5 min-w-[32px] justify-center font-bold"
                    />
                  ) : (
                    <span className="text-[10px] text-muted-foreground/20 font-bold">-</span>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Tablet: Show fewer modes */}
          <div className="hidden md:flex lg:hidden items-center gap-1 flex-shrink-0">
            {GAME_MODES.filter(m => m !== 'Overall').slice(0, 5).map((mode) => {
              const tier = safeTiers.find((t) => t.mode === mode)
              const hasTier = !!tier
              
              return (
                <div 
                  key={mode} 
                  className={cn(
                    'flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all duration-200',
                    hasTier 
                      ? 'bg-gradient-to-b from-[#2a2d35] to-[#22252b]' 
                      : 'bg-[#1a1d22]/40'
                  )}
                  title={`${mode}: ${tier?.tier || 'Sem tier'}`}
                >
                  <ModeIcon 
                    mode={mode} 
                    size={22} 
                    className={cn(!hasTier && 'opacity-20 grayscale')}
                  />
                  {hasTier ? (
                    <TierBadge 
                      tier={tier.tier} 
                      size="xs" 
                      className="text-[9px] px-1 py-0 min-w-[26px] justify-center"
                    />
                  ) : (
                    <span className="text-[9px] text-muted-foreground/20 font-medium">-</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Admin delete */}
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                removePlayer(player.id)
              }}
            >
              <Trash2 size={14} />
            </Button>
          )}
        </div>
        
        {/* Mobile Layout */}
        <div className="flex sm:hidden flex-col p-3 gap-3">
          {/* Top row: Rank, Avatar, Name, Tier */}
          <div className="flex items-center gap-3">
            {/* Rank */}
            {showRankNumbers && (
              <div className={cn(
                'w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-lg',
                showTop3Colors ? getRankBackground(rank) : 'bg-[#2a2d35]/80'
              )}>
                <span className={cn(
                  'text-base font-black',
                  showTop3Colors && rank <= 3 ? 'text-white' : 'text-muted-foreground/80'
                )}>
                  #{rank}
                </span>
              </div>
            )}
            
            {/* Avatar */}
            <div className={cn(
              'w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden',
              'bg-gradient-to-br from-[#2a2d35] to-[#1f2227]',
              'border-2',
              showTop3Colors && rank === 1 && 'border-amber-500/50',
              showTop3Colors && rank === 2 && 'border-slate-400/50',
              showTop3Colors && rank === 3 && 'border-orange-500/50',
              (!showTop3Colors || rank > 3) && 'border-[#3a3d45]/50'
            )}>
              <img
                src={`https://mc-heads.net/avatar/${player.nick}/40`}
                alt={player.nick}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Name and info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-foreground truncate">
                  {player.nick}
                </span>
                <TierBadge tier={currentTier.tier} size="xs" />
              </div>
              {showPlayerTitle && (
                <div className="flex items-center gap-1 text-xs mt-0.5">
                  <span className={titleColor}>{playerTitle}</span>
                  <span className="text-muted-foreground/50">({formatNumber(totalPoints)} pts)</span>
                </div>
              )}
            </div>
            
            {/* Region on mobile */}
            {showRegion && (
              <span className="px-2 py-1 rounded text-xs font-bold bg-emerald-500/90 text-white flex-shrink-0">
                {player.region}
              </span>
            )}
            
            {/* Admin delete mobile */}
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  removePlayer(player.id)
                }}
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>
          
          {/* Bottom row: Mode icons grid */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 -mx-1 px-1">
            {GAME_MODES.filter(m => m !== 'Overall').map((mode) => {
              const tier = safeTiers.find((t) => t.mode === mode)
              const hasTier = !!tier
              
              return (
                <div 
                  key={mode} 
                  className={cn(
                    'flex flex-col items-center gap-0.5 p-1.5 rounded-lg flex-shrink-0',
                    hasTier 
                      ? 'bg-gradient-to-b from-[#2a2d35] to-[#22252b]' 
                      : 'bg-[#1a1d22]/40'
                  )}
                >
                  <ModeIcon 
                    mode={mode} 
                    size={20} 
                    className={cn(!hasTier && 'opacity-20 grayscale')}
                  />
                  {hasTier ? (
                    <TierBadge 
                      tier={tier.tier} 
                      size="xs" 
                      className="text-[8px] px-1 py-0 min-w-[24px] justify-center"
                    />
                  ) : (
                    <span className="text-[8px] text-muted-foreground/20 font-medium">-</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Profile modal */}
      <PlayerProfile
        player={player}
        open={profileOpen}
        onOpenChange={setProfileOpen}
      />
    </>
  )
}
