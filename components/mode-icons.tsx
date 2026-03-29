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
  LTMs: '/icons/2v2.svg',
  Vanilla: '/icons/vanilla.svg',
  UHC: '/icons/uhc.svg',
  Pot: '/icons/pot.svg',
  NethOP: '/icons/nethop.svg',
  SMP: '/icons/smp.svg',
  Sword: '/icons/sword.svg',
  Axe: '/icons/axe.svg',
  Mace: '/icons/mace.svg',
  Crystal: '/icons/pot.svg',
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
    LTMs: '#CCCCCC',
    Vanilla: '#6195D9',
    UHC: '#D44E50',
    Pot: '#D65474',
    NethOP: '#8083BF',
    SMP: '#10574B',
    Sword: '#71BFDD',
    Axe: '#6195D9',
    Mace: '#60606B',
    Crystal: '#C889E6',
  }
  return colors[mode] || '#6B7280'
}
