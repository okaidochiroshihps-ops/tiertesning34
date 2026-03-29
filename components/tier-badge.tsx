'use client'

import { cn } from '@/lib/utils'
import { TIER_INFO, type TierType } from '@/lib/types'

interface TierBadgeProps {
  tier?: TierType
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
  glow?: boolean
  showEmpty?: boolean
}

export function TierBadge({ tier, size = 'md', showLabel = false, className, glow = false, showEmpty = false }: TierBadgeProps) {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  // Se nao tem tier e showEmpty esta ativo, mostra um badge vazio
  if (!tier && showEmpty) {
    return (
      <span
        className={cn(
          'rounded-md font-bold inline-flex items-center justify-center',
          'transition-all duration-300',
          'bg-[#1a1d22]/60 text-muted-foreground/30',
          sizeClasses[size],
          className
        )}
      >
        -
      </span>
    )
  }

  // Se nao tem tier, nao renderiza nada
  if (!tier) return null

  const info =
    TIER_INFO[tier] || {
      color: 'bg-gray-500',
      textColor: 'text-white',
      bgGlow: '',
      label: 'Unknown',
      gradient: 'from-gray-500 to-gray-700',
    }

  return (
    <span
      className={cn(
        'rounded-md font-bold inline-flex items-center justify-center',
        'transition-all duration-300',
        info.color,
        info.textColor,
        sizeClasses[size],
        glow && info.bgGlow,
        glow && 'shadow-lg',
        className
      )}
    >
      {showLabel ? info.label : tier}
    </span>
  )
}

// Compact tier badge for showing in player name
export function TierBadgeCompact({ tier, mode }: { tier: TierType; mode: string }) {
  const info = TIER_INFO[tier] || {
    color: 'bg-gray-500',
    textColor: 'text-white',
    gradient: 'from-gray-500 to-gray-700',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        'px-1 py-0.5 rounded text-[9px] font-bold',
        'transition-all duration-200',
        info.color,
        info.textColor
      )}
      title={`${mode}: ${tier}`}
    >
      {tier}
    </span>
  )
}
