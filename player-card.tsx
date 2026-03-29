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

  return (
    <>
      <div 
        onClick={() => setProfileOpen(true)}
        className={cn(
          'group relative cursor-pointer',
          'bg-[#1a1d24] hover:bg-[#1f2329]',
          'border-b border-[#2a2d35] last:border-b-0',
          'transition-all duration-200'
        )}
      >
        <div className="flex items-center py-2 gap-0">
          {/* Rank Number with colored background for top 3 - MCTiers style */}
          {showRankNumbers && (
            <div className={cn(
              'w-16 h-16 flex items-center justify-center flex-shrink-0 rounded-lg mr-2 ml-2',
              showTop3Colors ? getRankBackground(rank) : 'bg-[#2a2d35]'
            )}>
              <span className={cn(
                'text-2xl font-bold italic',
                showTop3Colors && rank <= 3 ? 'text-white' : 'text-muted-foreground/80'
              )}>
                {rank}.
              </span>
            </div>
          )}

          {/* Player Skin - Bust/Upper body like MCTiers */}
          <div className="w-12 h-14 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg bg-[#2a2d35]/50">
            <img
              src={`https://mc-heads.net/bust/${player.nick}/64`}
              alt={player.nick}
              className="h-full w-auto object-contain"
            />
          </div>

          {/* Player Info */}
          <div className="flex-1 min-w-0 px-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground truncate">
                {player.nick}
              </span>
            </div>
            {showPlayerTitle && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                <span className={titleColor}>&#9670;</span>
                <span className={titleColor}>{playerTitle}</span>
                <span className="text-muted-foreground/50">({formatNumber(totalPoints)} points)</span>
              </div>
            )}
          </div>

          {/* Region Badge */}
          {showRegion && (
            <div className="flex-shrink-0 mr-4">
              <RegionBadge region={player.region} />
            </div>
          )}

          {/* Mode Tier Icons - MCTiers style: only show tiers player has, empty for others */}
          <div className="flex items-center gap-2 flex-shrink-0 mr-4">
            {displayModes.map((mode) => {
              const tier = safeTiers.find((t) => t.mode === mode)
              const hasTier = !!tier
              
              return (
                <div 
                  key={mode} 
                  className="flex flex-col items-center gap-1"
                  title={`${mode}: ${tier?.tier || 'Sem tier'}`}
                >
                  {/* Mode Icon in circle */}
                  <div className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center',
                    hasTier ? 'bg-[#2a2d35]' : 'bg-[#2a2d35]/40'
                  )}>
                    <ModeIcon 
                      mode={mode} 
                      size={22} 
                      className={cn(!hasTier && 'opacity-40')}
                    />
                  </div>
                  {/* Tier Badge - show actual tier or "-" */}
                  {hasTier ? (
                    <TierBadge 
                      tier={tier.tier} 
                      size="xs" 
                      className="text-[10px] px-1.5 py-0.5 min-w-[32px] justify-center"
                    />
                  ) : (
                    <span className="text-[10px] text-muted-foreground/50 font-medium">
                      -
                    </span>
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
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 mr-2"
              onClick={(e) => {
                e.stopPropagation()
                removePlayer(player.id)
              }}
            >
              <Trash2 size={14} />
            </Button>
          )}
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
