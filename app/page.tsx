'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ModeTabs } from '@/components/mode-tabs'
import { FiltersPanel } from '@/components/filters-panel'
import { RankingTable } from '@/components/ranking-table'
import { AdminPanel } from '@/components/admin-panel'
import { StatsCard } from '@/components/stats-card'
import { ModeIcon } from '@/components/mode-icons'
import { usePlayersStore, useHydration } from '@/lib/store'
import { useSiteSettings } from '@/lib/site-settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2, Swords, Wrench, Clock, Shield, Lock } from 'lucide-react'
import type { GameMode, Region, TierType } from '@/lib/types'
import type { SeasonalEvent } from '@/lib/site-settings'

// Event theme styles
function getEventStyles(event: SeasonalEvent) {
  switch (event) {
    case 'christmas':
      return {
        bg1: 'bg-red-500/10',
        bg2: 'bg-green-500/10',
        accent: 'text-red-400',
        border: 'border-red-500/30',
        icon: '🎄',
        snowfall: true
      }
    case 'halloween':
      return {
        bg1: 'bg-orange-500/10',
        bg2: 'bg-purple-500/10',
        accent: 'text-orange-400',
        border: 'border-orange-500/30',
        icon: '🎃',
        snowfall: false
      }
    case 'easter':
      return {
        bg1: 'bg-pink-500/10',
        bg2: 'bg-yellow-500/10',
        accent: 'text-pink-400',
        border: 'border-pink-500/30',
        icon: '🐰',
        snowfall: false
      }
    case 'valentines':
      return {
        bg1: 'bg-pink-500/15',
        bg2: 'bg-red-500/10',
        accent: 'text-pink-400',
        border: 'border-pink-500/30',
        icon: '💕',
        snowfall: false
      }
    case 'newyear':
      return {
        bg1: 'bg-yellow-500/10',
        bg2: 'bg-blue-500/10',
        accent: 'text-yellow-400',
        border: 'border-yellow-500/30',
        icon: '🎆',
        snowfall: true
      }
    default:
      return {
        bg1: 'bg-primary/5',
        bg2: 'bg-primary/3',
        accent: 'text-primary',
        border: 'border-primary/20',
        icon: null,
        snowfall: false
      }
  }
}

function MaintenancePage() {
  const { settings } = useSiteSettings()
  const { isAdmin, setAdmin } = usePlayersStore()
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (password === settings.adminPassword) {
      setAdmin(true)
      setPassword('')
      setError('')
      setShowLogin(false)
    } else {
      setError('Senha incorreta')
    }
  }

  // Se o admin logar, permite ver o site mesmo em manutencao
  if (isAdmin) {
    return null // Retorna null para mostrar o site normal
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Icon */}
        <div className="mx-auto mb-8 w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center animate-pulse">
          <Wrench className="h-12 w-12 text-amber-400" />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
          {settings.maintenanceTitle || 'Site em Manutencao'}
        </h1>

        {/* Message */}
        <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
          {settings.maintenanceMessage || 'Estamos realizando manutencao no site. Por favor, volte mais tarde.'}
        </p>

        {/* Estimate */}
        {settings.maintenanceEstimate && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/30 mb-8">
            <Clock className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-muted-foreground">
              Previsao: <span className="text-foreground font-medium">{settings.maintenanceEstimate}</span>
            </span>
          </div>
        )}

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mt-8 opacity-50">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Swords className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {settings.siteName}
          </span>
        </div>

        {/* Admin Login Button */}
        <div className="mt-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLogin(true)}
            className="gap-2 text-xs hover:bg-primary/10 hover:border-primary/50"
          >
            <Lock className="h-3 w-3" />
            Entrar como Admin
          </Button>
        </div>

        {/* Login Dialog */}
        <Dialog open={showLogin} onOpenChange={setShowLogin}>
          <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Login de Administrador
              </DialogTitle>
              <DialogDescription>
                Digite a senha de administrador para acessar o site durante a manutencao.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-4">
              <Input
                type="password"
                placeholder="Senha de administrador"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="bg-secondary/50 border-border/50"
              />
              {error && (
                <p className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <Button onClick={handleLogin} className="w-full">
                Entrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default function Home() {
  const listenPlayers = usePlayersStore((s) => s.listenPlayers)
  const isAdmin = usePlayersStore((s) => s.isAdmin)
  const { settings, listenSettings, isLoading: settingsLoading } = useSiteSettings()

  const [selectedMode, setSelectedMode] = useState<GameMode>('Overall')
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState<Region | 'ALL'>('ALL')
  const [tier, setTier] = useState<TierType | 'ALL'>('ALL')

  const hydrated = useHydration()

  useEffect(() => {
    listenPlayers()
    listenSettings()
  }, [listenPlayers, listenSettings])

  // Loading state
  if (!hydrated || settingsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Swords className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Carregando rankings...</p>
        </div>
      </div>
    )
  }

  // Maintenance mode - mostra tela de manutencao se nao for admin
  if (settings.maintenanceMode && !isAdmin) {
    return <MaintenancePage />
  }

  // Get event styles
  const eventStyles = getEventStyles(settings.seasonalEvent || 'none')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background effects with event theme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={cn('absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl', eventStyles.bg1)} />
        <div className={cn('absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl', eventStyles.bg2)} />
      </div>

      {/* Snowfall effect for Christmas/New Year */}
      {eventStyles.snowfall && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
          {[...Array(40)].map((_, i) => {
            const size = 8 + Math.random() * 14
            const left = Math.random() * 100
            const delay = Math.random() * 8
            const duration = 8 + Math.random() * 6
            const symbol = settings.seasonalEvent === 'christmas' ? '❄' : '✨'
            
            return (
              <div
                key={i}
                className="absolute animate-fall"
                style={{
                  left: `${left}%`,
                  top: '-20px',
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  fontSize: `${size}px`,
                  opacity: 0.4 + Math.random() * 0.4,
                  color: settings.seasonalEvent === 'christmas' ? '#a5d6ff' : '#ffd700'
                }}
              >
                {symbol}
              </div>
            )
          })}
        </div>
      )}
      
      {/* Valentine's hearts effect */}
      {settings.seasonalEvent === 'valentines' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                fontSize: `${12 + Math.random() * 16}px`,
                opacity: 0.15 + Math.random() * 0.15
              }}
            >
              💕
            </div>
          ))}
        </div>
      )}
      
      {/* Halloween bats effect */}
      {settings.seasonalEvent === 'halloween' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${10 + Math.random() * 30}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
                fontSize: `${18 + Math.random() * 14}px`,
                opacity: 0.2 + Math.random() * 0.2
              }}
            >
              🦇
            </div>
          ))}
        </div>
      )}
      
      {/* Easter eggs effect */}
      {settings.seasonalEvent === 'easter' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
          {[...Array(12)].map((_, i) => {
            const emojis = ['🥚', '🐰', '🌸', '🐣']
            return (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${4 + Math.random() * 4}s`,
                  fontSize: `${14 + Math.random() * 12}px`,
                  opacity: 0.15 + Math.random() * 0.2
                }}
              >
                {emojis[Math.floor(Math.random() * emojis.length)]}
              </div>
            )
          })}
        </div>
      )}

      {/* Event Banner */}
      {settings.seasonalEvent && settings.seasonalEvent !== 'none' && (
        <div className={cn('w-full py-2 px-4 text-center', eventStyles.border, 'border-b')}>
          <div className={cn('container mx-auto flex items-center justify-center gap-2 text-sm', eventStyles.accent)}>
            <span className="text-lg">{eventStyles.icon}</span>
            <span>
              {settings.seasonalEvent === 'christmas' && 'Feliz Natal! Boas festas a todos!'}
              {settings.seasonalEvent === 'halloween' && 'Feliz Halloween! Cuidado com os monstros!'}
              {settings.seasonalEvent === 'easter' && 'Feliz Pascoa! Que seja doce!'}
              {settings.seasonalEvent === 'valentines' && 'Feliz Dia dos Namorados!'}
              {settings.seasonalEvent === 'newyear' && 'Feliz Ano Novo! Que venha um ano incrivel!'}
            </span>
            <span className="text-lg">{eventStyles.icon}</span>
          </div>
        </div>
      )}

      {/* Maintenance Mode Banner for Admin */}
      {settings.maintenanceMode && isAdmin && (
        <div className="w-full py-2 px-4 bg-amber-500/10 border-b border-amber-500/30 text-center">
          <div className="container mx-auto flex items-center justify-center gap-2 text-amber-400 text-sm">
            <Wrench className="h-4 w-4" />
            <span>Modo de manutencao ativo - Apenas voce pode ver o site</span>
          </div>
        </div>
      )}

      <Header />

      <main className="relative container mx-auto px-4 py-6 sm:py-8 flex-1">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className={cn(
              'p-2.5 rounded-xl',
              'bg-gradient-to-br from-primary/20 to-primary/5',
              'border border-primary/20',
              'animate-in fade-in zoom-in duration-500'
            )}>
              <ModeIcon mode={selectedMode} size={28} />
            </div>
          </div>
          <h1 className={cn(
            'text-3xl sm:text-4xl font-bold tracking-tight mb-3',
            'animate-in fade-in slide-in-from-bottom-4 duration-500'
          )}>
            <span className="text-primary">{settings.siteName.split(/(?=[A-Z])/)[0]}</span>
            <span className="text-foreground">{settings.siteName.split(/(?=[A-Z])/).slice(1).join('')}</span>
            <span className="text-muted-foreground text-xl sm:text-2xl ml-2">Rankings</span>
          </h1>
          <p className={cn(
            'text-sm text-muted-foreground max-w-lg mx-auto text-balance',
            'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100'
          )}>
            {settings.siteDescription || 'O sistema de ranking definitivo para jogadores de PvP do Minecraft.'}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <StatsCard selectedMode={selectedMode} />
        </div>

        {/* Mode Tabs */}
        <div className="mb-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <ModeTabs selectedMode={selectedMode} onModeChange={setSelectedMode} />
        </div>

        {/* Filters & Admin */}
        <div className={cn(
          'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5',
          'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400'
        )}>
          <div className="w-full sm:flex-1">
            <FiltersPanel
              search={search}
              onSearchChange={setSearch}
              region={region}
              onRegionChange={setRegion}
              tier={tier}
              onTierChange={setTier}
            />
          </div>
          <AdminPanel />
        </div>

        {/* Rankings Table - MCTiers style */}
        <div className={cn(
          'bg-[#12141a] rounded-2xl border border-[#2a2d35] p-4 sm:p-5',
          'transition-all duration-300',
          'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500'
        )}>
          <RankingTable
            selectedMode={selectedMode}
            search={search}
            region={region}
            tier={tier}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
