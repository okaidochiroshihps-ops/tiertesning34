'use client'

import Image from 'next/image'
import { type GameMode } from '@/lib/types'

interface ModeIconProps {
  mode: GameMode
  className?: string
  size?: number
}

const MODE_ICONS: Record<GameMode, string> = {
  Overall: '/icons/overall.svg',
  LTMs: '/icons/ltms.svg',
  Vanilla: '/icons/vanilla.svg',
  UHC: '/icons/uhc.svg',
  Pot: '/icons/pot.svg',
  NethOP: '/icons/nethop.svg',
  SMP: '/icons/smp.svg',
  Sword: '/icons/sword.svg',
  Axe: '/icons/axe.svg',
  Mace: '/icons/mace.svg',
  Crystal: '/icons/uhc.svg',
}

export function ModeIcon({ mode, className = '', size = 24 }: ModeIconProps) {
  const iconSrc = MODE_ICONS[mode] || MODE_ICONS.Overall

  return (
    <Image
      src={iconSrc}
      alt={`${mode} mode icon`}
      width={size}
      height={size}
      className={`${className} transition-transform duration-200 hover:scale-110`}
    />
  )
}

export function getModeColor(mode: GameMode): string {
  const colors: Record<GameMode, string> = {
    Overall: '#FFD700',
    LTMs: '#A855F7',
    Vanilla: '#6B7280',
    UHC: '#EF4444',
    Pot: '#A855F7',
    NethOP: '#7C3AED',
    SMP: '#10B981',
    Sword: '#3B82F6',
    Axe: '#F59E0B',
    Mace: '#6B7280',
    Crystal: '#EC4899',
  }
  return colors[mode] || '#6B7280'
}
