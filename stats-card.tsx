'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { usePlayersStore } from '@/lib/store'
import type { GameMode } from '@/lib/types'
import { Users, Trophy, Globe, Crown } from 'lucide-react'

interface StatsCardProps {
  selectedMode: GameMode
}

export function StatsCard({ selectedMode }: StatsCardProps) {
  const { players } = usePlayersStore()

  const stats = useMemo(() => {
    const playersWithMode = players.filter((p) =>
      p.tiers.some((t) => t.mode === selectedMode)
    )

    const highTierCount = playersWithMode.filter((p) =>
      p.tiers.some((t) => t.mode === selectedMode && t.tier.startsWith('HT'))
    ).length

    const regions = new Set(playersWithMode.map((p) => p.region))

    const topPlayer = playersWithMode
      .map((p) => ({
        player: p,
        points: p.tiers.find((t) => t.mode === selectedMode)?.points || 0,
      }))
      .sort((a, b) => b.points - a.points)[0]

    return {
      totalPlayers: playersWithMode.length,
      highTierCount,
      regions: regions.size,
      topPlayer: topPlayer?.player.nick || '-',
    }
  }, [players, selectedMode])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatItem
        icon={<Users className="h-4 w-4" />}
        label="Total"
        value={stats.totalPlayers.toString()}
        color="text-blue-400"
        bgColor="bg-blue-500/10"
        borderColor="border-blue-500/20"
      />
      <StatItem
        icon={<Trophy className="h-4 w-4" />}
        label="High Tier"
        value={stats.highTierCount.toString()}
        color="text-emerald-400"
        bgColor="bg-emerald-500/10"
        borderColor="border-emerald-500/20"
      />
      <StatItem
        icon={<Globe className="h-4 w-4" />}
        label="Regiões"
        value={stats.regions.toString()}
        color="text-amber-400"
        bgColor="bg-amber-500/10"
        borderColor="border-amber-500/20"
      />
      <StatItem
        icon={<Crown className="h-4 w-4" />}
        label="Top 1"
        value={stats.topPlayer}
        color="text-purple-400"
        bgColor="bg-purple-500/10"
        borderColor="border-purple-500/20"
        truncate
      />
    </div>
  )
}

function StatItem({
  icon,
  label,
  value,
  color,
  bgColor,
  borderColor,
  truncate = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
  bgColor: string
  borderColor: string
  truncate?: boolean
}) {
  return (
    <div className={cn(
      'group relative flex items-center gap-3 p-3 rounded-xl',
      'bg-card/30 border backdrop-blur-sm',
      borderColor,
      'transition-all duration-300 ease-out',
      'hover:bg-card/50 hover:scale-[1.02]',
      'cursor-default'
    )}>
      <div className={cn(
        'flex items-center justify-center w-9 h-9 rounded-lg',
        bgColor,
        color,
        'transition-transform duration-300 group-hover:scale-110'
      )}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn(
          'text-lg font-bold text-foreground',
          'transition-colors duration-200 group-hover:text-primary',
          truncate && 'truncate'
        )}>
          {value}
        </p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      </div>
    </div>
  )
}
