'use client'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { REGIONS, TIERS, REGION_FLAGS, REGION_NAMES, type Region, type TierType } from '@/lib/types'
import { TierBadge } from './tier-badge'
import { Search, MapPin, Award } from 'lucide-react'

interface FiltersPanelProps {
  search: string
  onSearchChange: (search: string) => void
  region: Region | 'ALL'
  onRegionChange: (region: Region | 'ALL') => void
  tier: TierType | 'ALL'
  onTierChange: (tier: TierType | 'ALL') => void
}

export function FiltersPanel({
  search,
  onSearchChange,
  region,
  onRegionChange,
  tier,
  onTierChange,
}: FiltersPanelProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {/* Search */}
      <div className="relative flex-1 group">
        <Search className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4',
          'text-muted-foreground transition-colors duration-200',
          'group-focus-within:text-primary'
        )} />
        <Input
          placeholder="Buscar jogador..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            'pl-10 h-9 bg-secondary/30 border-border/30',
            'transition-all duration-300',
            'hover:bg-secondary/50 hover:border-primary/30',
            'focus:bg-secondary/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20'
          )}
        />
      </div>
      
      <div className="flex gap-2">
        {/* Region Filter */}
        <Select value={region} onValueChange={(v) => onRegionChange(v as Region | 'ALL')}>
          <SelectTrigger className={cn(
            'w-[140px] h-9 bg-secondary/30 border-border/30',
            'transition-all duration-300',
            'hover:bg-secondary/50 hover:border-primary/30'
          )}>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Região" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur-xl border-border/30">
            <SelectItem 
              value="ALL" 
              className="cursor-pointer transition-colors hover:bg-primary/10"
            >
              Todas Regiões
            </SelectItem>
            {REGIONS.map((r) => (
              <SelectItem 
                key={r} 
                value={r}
                className="cursor-pointer transition-colors hover:bg-primary/10"
              >
                <span className="flex items-center gap-2">
                  <span>{REGION_FLAGS[r]}</span>
                  <span>{REGION_NAMES[r]}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tier Filter */}
        <Select value={tier} onValueChange={(v) => onTierChange(v as TierType | 'ALL')}>
          <SelectTrigger className={cn(
            'w-[120px] h-9 bg-secondary/30 border-border/30',
            'transition-all duration-300',
            'hover:bg-secondary/50 hover:border-primary/30'
          )}>
            <div className="flex items-center gap-2">
              <Award className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Tier" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur-xl border-border/30">
            <SelectItem 
              value="ALL"
              className="cursor-pointer transition-colors hover:bg-primary/10"
            >
              Todos Tiers
            </SelectItem>
            {TIERS.map((t) => (
              <SelectItem 
                key={t} 
                value={t}
                className="cursor-pointer transition-colors hover:bg-primary/10"
              >
                <TierBadge tier={t} size="sm" />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
