'use client'

import { cn } from '@/lib/utils'
import { GAME_MODES, type GameMode } from '@/lib/types'
import { ModeIcon, getModeColor } from './mode-icons'

interface ModeTabsProps {
  selectedMode: GameMode
  onModeChange: (mode: GameMode) => void
}

export function ModeTabs({ selectedMode, onModeChange }: ModeTabsProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-2">
      <div className="flex items-center justify-center gap-1 p-1.5 bg-secondary/20 rounded-2xl border border-border/30 backdrop-blur-sm min-w-max mx-auto">
        {GAME_MODES.map((mode) => {
          const isSelected = selectedMode === mode
          const modeColor = getModeColor(mode)
          
          return (
            <button
              key={mode}
              onClick={() => onModeChange(mode)}
              className={cn(
                'group relative flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium',
                'transition-all duration-300 ease-out',
                'hover:scale-105 active:scale-95',
                isSelected
                  ? 'bg-secondary/80 text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              )}
              style={{
                boxShadow: isSelected ? `0 0 15px ${modeColor}30, 0 2px 8px ${modeColor}15` : undefined
              }}
            >
              {/* Icon */}
              <div className={cn(
                'transition-transform duration-300',
                isSelected ? 'scale-110' : 'group-hover:scale-110'
              )}>
                <ModeIcon mode={mode} size={32} />
              </div>
              
              {/* Label */}
              <span className={cn(
                'text-xs font-semibold transition-colors duration-200',
                isSelected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
              )}>
                {mode}
              </span>

              {/* Underline indicator */}
              <div 
                className={cn(
                  'absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300',
                  isSelected ? 'w-6 opacity-100' : 'w-0 opacity-0 group-hover:w-3 group-hover:opacity-50'
                )}
                style={{ backgroundColor: modeColor }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
