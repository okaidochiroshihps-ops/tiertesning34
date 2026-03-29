'use client'

import { cn } from '@/lib/utils'
import { TIER_INFO, type TierType } from '@/lib/types'

interface TierBadgeProps {
  tier: TierType
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
  glow?: boolean
}

export function TierBadge({ tier, size = 'md', showLabel = false, className, glow = false }: TierBadgeProps) {
  const info =
    TIER_INFO[tier] || {
      color: 'bg-gray-500',
      textColor: 'text-white',
      bgGlow: '',
      label: 'Unknown',
      gradient: 'from-gray-500 to-gray-700',
    }

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
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
      {showLabel ? info.label : tier || 'N/A'}
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
