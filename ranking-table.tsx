'use client'

import { useMemo } from 'react'
import { PlayerCard } from './player-card'
import { usePlayersStore } from '@/lib/store'
import type { GameMode, Region, TierType } from '@/lib/types'
import { Users } from 'lucide-react'

interface RankingTableProps {
  selectedMode: GameMode
  search: string
  region: Region | 'ALL'
  tier: TierType | 'ALL'
}

export function RankingTable({
  selectedMode,
  search,
  region,
  tier,
}: RankingTableProps) {
  const { players } = usePlayersStore()

  const filteredAndSortedPlayers = useMemo(() => {
    return players
      .map((player) => {
        const modeTier = player.tiers?.find(
          (t) => t.mode === selectedMode
        )

        return { player, modeTier }
      })
      .filter(({ player, modeTier }) => {
        if (!modeTier) return false

        if (
          search &&
          !(player.nick || '')
            .toLowerCase()
            .includes(search.toLowerCase())
        ) {
          return false
        }

        if (region !== 'ALL' && player.region !== region) {
          return false
        }

        if (tier !== 'ALL' && modeTier.tier !== tier) {
          return false
        }

        return true
      })
      .sort(
        (a, b) =>
          (b.modeTier?.points || 0) -
          (a.modeTier?.points || 0)
      )
      .map(({ player }) => player)
  }, [players, selectedMode, search, region, tier])

  if (filteredAndSortedPlayers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nenhum jogador encontrado
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Não há jogadores que correspondam aos filtros selecionados.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-3 px-4">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {filteredAndSortedPlayers.length} jogador
          {filteredAndSortedPlayers.length !== 1 ? 'es' : ''} encontrado
          {filteredAndSortedPlayers.length !== 1 ? 's' : ''}
        </h2>
      </div>

      {/* MCTiers style list - no gaps, using borders */}
      <div className="rounded-xl overflow-hidden border border-[#2a2d35]">
        {filteredAndSortedPlayers.map((player, index) => (
          <PlayerCard
            key={player.id}
            player={player}
            rank={index + 1}
            selectedMode={selectedMode}
          />
        ))}
      </div>
    </div>
  )
}
