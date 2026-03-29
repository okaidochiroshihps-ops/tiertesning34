'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { PlayerCard } from './player-card'
import { usePlayersStore } from '@/lib/store'
import type { GameMode, Region, TierType } from '@/lib/types'
import { Users, Trophy, Medal, Award } from 'lucide-react'

// Ordem dos tiers do melhor para o pior
const TIER_ORDER: TierType[] = [
  'HT1', 'HT2', 'HT3', 'HT4', 'HT5',
  'MT1', 'MT2', 'MT3', 'MT4', 'MT5',
  'LT1', 'LT2', 'LT3', 'LT4', 'LT5',
]

// Funcao para obter a posicao do tier na ordem (menor = melhor)
function getTierRank(tier: TierType | undefined): number {
  if (!tier) return 999 // Sem tier = ultimo
  const index = TIER_ORDER.indexOf(tier)
  return index === -1 ? 999 : index
}

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
      .sort((a, b) => {
        // Primeiro ordena pelo tier (HT1 > HT2 > ... > LT5)
        const tierRankA = getTierRank(a.modeTier?.tier)
        const tierRankB = getTierRank(b.modeTier?.tier)
        
        if (tierRankA !== tierRankB) {
          return tierRankA - tierRankB // Menor rank = melhor tier
        }
        
        // Se o tier for igual, ordena por pontos (maior primeiro)
        return (b.modeTier?.points || 0) - (a.modeTier?.points || 0)
      })
      .map(({ player }) => player)
  }, [players, selectedMode, search, region, tier])

  if (filteredAndSortedPlayers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#2a2d35] to-[#1f2227] border border-[#3a3d45]/50 mb-4">
            <Users className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2 mt-4">
          Nenhum jogador encontrado
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Nao ha jogadores que correspondam aos filtros selecionados.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header with stats */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              {filteredAndSortedPlayers.length}
            </span>
            <span className="text-xs text-muted-foreground">
              jogador{filteredAndSortedPlayers.length !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-amber-500 to-amber-600" />
            <span>1o Lugar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-slate-400 to-slate-500" />
            <span>2o Lugar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-orange-500 to-orange-600" />
            <span>3o Lugar</span>
          </div>
        </div>
      </div>

      {/* Players list with visual improvements */}
      <div className={cn(
        'rounded-2xl overflow-hidden',
        'bg-gradient-to-b from-[#12141a] to-[#0f1115]',
        'border border-[#2a2d35]/70',
        'shadow-xl shadow-black/20'
      )}>
        {/* Table header */}
        <div className="flex items-center px-4 py-3 bg-[#1a1d24]/80 border-b border-[#2a2d35]/50 text-xs text-muted-foreground font-medium uppercase tracking-wider">
          <div className="w-14 text-center">#</div>
          <div className="w-14 text-center">Avatar</div>
          <div className="flex-1 pl-3">Jogador</div>
          <div className="w-16 text-center hidden sm:block">Regiao</div>
          <div className="hidden md:block text-center pr-4">Tiers por Modo</div>
        </div>
        
        {/* Players */}
        <div className="divide-y divide-[#2a2d35]/30">
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
      
      {/* Footer info */}
      {filteredAndSortedPlayers.length > 10 && (
        <div className="text-center mt-4 text-xs text-muted-foreground/60">
          Mostrando todos os {filteredAndSortedPlayers.length} jogadores classificados
        </div>
      )}
    </div>
  )
}
