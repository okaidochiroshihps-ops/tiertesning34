'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { TierBadge } from './tier-badge'
import { ModeIcon, getModeColor } from './mode-icons'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { REGION_NAMES, GAME_MODES, type Player, type GameMode } from '@/lib/types'
import { formatNumber, formatDate } from '@/lib/format'
import { Trophy, Target, Flame, TrendingUp, Calendar, Swords, Award, X, ExternalLink, User, Clock } from 'lucide-react'

interface PlayerProfileProps {
  player: Player
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Player titles based on points
function getPlayerTitle(totalPoints: number): string {
  if (totalPoints >= 3000) return 'Combat Master'
  if (totalPoints >= 2500) return 'Combat Ace'
  if (totalPoints >= 2000) return 'Combat Elite'
  if (totalPoints >= 1500) return 'Combat Veteran'
  if (totalPoints >= 1000) return 'Combat Fighter'
  if (totalPoints >= 500) return 'Combat Rookie'
  return 'Combat Novice'
}

// Region badge component
function RegionBadge({ region }: { region: string }) {
  return (
    <span className="px-3 py-1 rounded text-sm font-bold bg-emerald-500/90 text-white">
      {region}
    </span>
  )
}

export function PlayerProfile({ player, open, onOpenChange }: PlayerProfileProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('Overall')

  const safeTiers = Array.isArray(player?.tiers) ? player.tiers : []

  const currentTier = safeTiers.find((t) => t?.mode === selectedMode) || safeTiers[0]
  const overallTier = safeTiers.find((t) => t?.mode === 'Overall') || safeTiers[0]

  const totalWins = safeTiers.reduce((acc, t) => acc + (Number(t?.wins) || 0), 0)
  const totalLosses = safeTiers.reduce((acc, t) => acc + (Number(t?.losses) || 0), 0)
  const totalPoints = safeTiers.reduce((acc, t) => acc + (t?.points || 0), 0)

  const winRate = totalWins + totalLosses > 0
    ? Math.round((totalWins / (totalWins + totalLosses)) * 100)
    : 0

  const bestStreak = Math.max(0, ...safeTiers.map((t) => Number(t?.bestWinStreak) || 0))
  const playerTitle = getPlayerTitle(totalPoints)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-[#12141a] border-[#2a2d35]">
        <DialogHeader className="sr-only">
          <DialogTitle>Perfil de {player?.nick || 'Jogador'}</DialogTitle>
          <DialogDescription>
            Visualize as estatisticas e tiers do jogador {player?.nick || ''}.
          </DialogDescription>
        </DialogHeader>

        {/* Header Background */}
        <div className="relative h-32 bg-gradient-to-br from-[#1a1d24] to-[#12141a] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
          
          {/* Close button */}
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 p-2 rounded-lg bg-[#1a1d24] hover:bg-[#2a2d35] transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Avatar & Name */}
        <div className="relative px-6 -mt-20">
          <div className="flex items-end gap-5">
            {/* Full body skin */}
            <div className="relative">
              <div className="w-24 h-40 rounded-xl overflow-hidden ring-4 ring-[#12141a] shadow-2xl bg-[#1a1d24] flex items-center justify-center">
                <Image
                  src={`https://mc-heads.net/body/${player?.nick || 'Steve'}/150`}
                  alt={player?.nick || 'player'}
                  width={96}
                  height={160}
                  className="h-full w-auto object-contain"
                />
              </div>

              {overallTier && (
                <div className="absolute -bottom-2 -right-2">
                  <TierBadge tier={overallTier.tier || 'LT5'} size="md" glow />
                </div>
              )}
            </div>

            <div className="pb-3 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-foreground">
                  {player?.nick || 'Sem nome'}
                </h2>
                <RegionBadge region={player?.region || 'NA'} />
              </div>
              
              {/* Title and points */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <span className="text-emerald-400">◆</span>
                <span>{playerTitle}</span>
                <span className="text-muted-foreground/50">({formatNumber(totalPoints)} points)</span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {REGION_NAMES[player?.region] || 'Desconhecida'}
              </p>
              
              {/* NameMC Link */}
              <a 
                href={`https://namemc.com/profile/${player?.nick}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-[#1a1d24] hover:bg-[#2a2d35] text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <User className="h-3.5 w-3.5" />
                <span>Ver no NameMC</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Dates Info */}
        <div className="px-6 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#1a1d24] border border-[#2a2d35]">
              <Calendar className="h-4 w-4 text-emerald-400" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Data de Entrada</p>
                <p className="text-sm font-medium">{formatDate(player?.joinedAt) || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#1a1d24] border border-[#2a2d35]">
              <Clock className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Ultimo Visto</p>
                <p className="text-sm font-medium">{formatDate(player?.lastSeen) || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* All Mode Tiers - MCTiers style */}
        <div className="px-6 mt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Tiers por Modo
          </h3>
          <div className="flex flex-wrap gap-2">
            {GAME_MODES.map((mode) => {
              const tier = safeTiers.find((t) => t.mode === mode)
              
              return (
                <div 
                  key={mode} 
                  className="flex flex-col items-center gap-1 p-2 rounded-lg bg-[#1a1d24] border border-[#2a2d35]"
                  title={`${mode}: ${tier?.tier || '-'}`}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#2a2d35]">
                    <ModeIcon mode={mode} size={24} />
                  </div>
                  <TierBadge 
                    tier={tier?.tier || 'LT5'} 
                    size="sm"
                    className={!tier ? 'opacity-30' : ''}
                  />
                  <span className="text-[10px] text-muted-foreground">{mode}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-2 px-6 mt-4">
          <StatBox 
            icon={<Swords className="h-4 w-4 text-blue-400" />}
            label="Partidas" 
            value={formatNumber(totalWins + totalLosses)} 
          />
          <StatBox 
            icon={<Trophy className="h-4 w-4 text-emerald-400" />}
            label="Vitorias" 
            value={formatNumber(totalWins)} 
          />
          <StatBox 
            icon={<Target className="h-4 w-4 text-amber-400" />}
            label="Win Rate" 
            value={`${winRate}%`} 
          />
          <StatBox 
            icon={<Flame className="h-4 w-4 text-orange-400" />}
            label="Best Streak" 
            value={String(bestStreak)} 
          />
        </div>

        {/* Mode Selection */}
        <div className="px-6 mt-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Detalhes do Modo
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {GAME_MODES.map((mode) => {
              const tier = safeTiers.find((t) => t.mode === mode)
              if (!tier) return null
              
              const isSelected = selectedMode === mode
              const modeColor = getModeColor(mode)
              
              return (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all duration-200',
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-foreground'
                      : 'bg-[#1a1d24] border-[#2a2d35] text-muted-foreground hover:bg-[#2a2d35] hover:text-foreground'
                  )}
                  style={{
                    boxShadow: isSelected ? `0 0 10px ${modeColor}20` : undefined
                  }}
                >
                  <ModeIcon mode={mode} size={14} />
                  <span className="font-medium">{mode}</span>
                  <TierBadge tier={tier.tier} size="xs" />
                </button>
              )
            })}
          </div>
        </div>

        {/* Mode Details */}
        {currentTier && (
          <div className="px-6 mt-4 pb-6">
            <div className="p-4 rounded-xl bg-[#1a1d24] border border-[#2a2d35]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#2a2d35]">
                    <ModeIcon mode={currentTier.mode} size={24} />
                  </div>
                  <h4 className="font-semibold text-foreground">{currentTier.mode}</h4>
                </div>
                <TierBadge tier={currentTier.tier || 'LT5'} size="lg" glow />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <ModeStatRow 
                  icon={<Award className="h-3.5 w-3.5" />}
                  label="Pontos" 
                  value={formatNumber(currentTier.points || 0)} 
                  highlight
                />
                <ModeStatRow 
                  icon={<TrendingUp className="h-3.5 w-3.5" />}
                  label="Peak" 
                  value={formatNumber(currentTier.peakPoints || 0)} 
                />
                <ModeStatRow 
                  icon={<Trophy className="h-3.5 w-3.5" />}
                  label="Vitorias" 
                  value={formatNumber(currentTier.wins || 0)} 
                />
                <ModeStatRow 
                  icon={<X className="h-3.5 w-3.5" />}
                  label="Derrotas" 
                  value={formatNumber(currentTier.losses || 0)} 
                />
                <ModeStatRow 
                  icon={<Flame className="h-3.5 w-3.5" />}
                  label="Win Streak" 
                  value={String(currentTier.winStreak || 0)} 
                />
                <ModeStatRow 
                  icon={<Flame className="h-3.5 w-3.5" />}
                  label="Best Streak" 
                  value={String(currentTier.bestWinStreak || 0)} 
                />
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Progresso para proximo tier</span>
                  <span>{(currentTier.points || 0) % 1000} / 1000</span>
                </div>
                <div className="h-2 bg-[#2a2d35] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                    style={{
                      width: `${((currentTier.points || 0) % 1000) / 10}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="text-center p-3 rounded-xl bg-[#1a1d24] border border-[#2a2d35]">
      <div className="flex items-center justify-center mb-1">
        {icon}
      </div>
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  )
}

function ModeStatRow({ icon, label, value, highlight = false }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn(
      "p-2.5 rounded-lg transition-colors",
      highlight ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-[#12141a]"
    )}>
      <div className="flex items-center gap-1.5 mb-0.5 text-muted-foreground">
        {icon}
        <p className="text-[10px] uppercase tracking-wider">{label}</p>
      </div>
      <p className={cn("font-semibold", highlight && "text-emerald-400")}>{value}</p>
    </div>
  )
}
