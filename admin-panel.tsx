'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { usePlayersStore } from '@/lib/store'
import { useSiteSettings } from '@/lib/site-settings'
import { GAME_MODES, REGIONS, TIERS, REGION_FLAGS, REGION_NAMES, type GameMode, type Region, type TierType, type Player } from '@/lib/types'
import { TierBadge } from './tier-badge'
import { ModeIcon } from './mode-icons'
import { 
  UserPlus, Plus, X, Shield, Settings, Globe, 
  MessageSquare, Users, Trash2, Edit3, Save, RotateCcw,
  Server, Link, Bell, Lock, ExternalLink, Search,
  Wrench, Clock, FileText, Image, AlertTriangle
} from 'lucide-react'

interface TierEntry {
  mode: GameMode
  tier: TierType
  points: number
  wins: number
  losses: number
}

export function AdminPanel() {
  const { isAdmin, players, addPlayer, removePlayer, updatePlayer } = usePlayersStore()
  const { settings, updateSettings, resetSettings } = useSiteSettings()
  
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('players')
  
  // Add player state
  const [nick, setNick] = useState('')
  const [region, setRegion] = useState<Region>('NA')
  const [tiers, setTiers] = useState<TierEntry[]>([
    { mode: 'Overall', tier: 'HT5', points: 1500, wins: 0, losses: 0 }
  ])
  
  // Edit player state
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [editNick, setEditNick] = useState('')
  const [editRegion, setEditRegion] = useState<Region>('NA')
  const [editTiers, setEditTiers] = useState<TierEntry[]>([])
  
  // Settings state
  const [localSettings, setLocalSettings] = useState(settings)
  const [searchPlayer, setSearchPlayer] = useState('')
  const [settingsSaved, setSettingsSaved] = useState(false)

  // Sync local settings with global settings
  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const filteredPlayers = players.filter(p => 
    p.nick.toLowerCase().includes(searchPlayer.toLowerCase())
  )

  const addTierEntry = () => {
    const availableModes = GAME_MODES.filter(
      (m) => !tiers.find((t) => t.mode === m)
    )
    if (availableModes.length > 0) {
      setTiers([...tiers, { mode: availableModes[0], tier: 'HT5', points: 1500, wins: 0, losses: 0 }])
    }
  }

  const removeTierEntry = (index: number) => {
    if (tiers.length > 1) {
      setTiers(tiers.filter((_, i) => i !== index))
    }
  }

  const updateTierEntry = (index: number, field: keyof TierEntry, value: string | number) => {
    const newTiers = [...tiers]
    if (field === 'points' || field === 'wins' || field === 'losses') {
      newTiers[index] = { ...newTiers[index], [field]: Number(value) }
    } else if (field === 'mode') {
      newTiers[index] = { ...newTiers[index], mode: value as GameMode }
    } else if (field === 'tier') {
      newTiers[index] = { ...newTiers[index], tier: value as TierType }
    }
    setTiers(newTiers)
  }

  // Edit tier functions
  const addEditTierEntry = () => {
    const availableModes = GAME_MODES.filter(
      (m) => !editTiers.find((t) => t.mode === m)
    )
    if (availableModes.length > 0) {
      setEditTiers([...editTiers, { mode: availableModes[0], tier: 'HT5', points: 1500, wins: 0, losses: 0 }])
    }
  }

  const removeEditTierEntry = (index: number) => {
    if (editTiers.length > 1) {
      setEditTiers(editTiers.filter((_, i) => i !== index))
    }
  }

  const updateEditTierEntry = (index: number, field: keyof TierEntry, value: string | number) => {
    const newTiers = [...editTiers]
    if (field === 'points' || field === 'wins' || field === 'losses') {
      newTiers[index] = { ...newTiers[index], [field]: Number(value) }
    } else if (field === 'mode') {
      newTiers[index] = { ...newTiers[index], mode: value as GameMode }
    } else if (field === 'tier') {
      newTiers[index] = { ...newTiers[index], tier: value as TierType }
    }
    setEditTiers(newTiers)
  }

  const handleSubmit = () => {
    if (!nick.trim()) return

    addPlayer({
      nick: nick.trim(),
      region,
      tiers: tiers.map((t) => ({
        mode: t.mode,
        tier: t.tier,
        points: t.points,
        peak: t.tier,
        peakPoints: t.points,
        wins: t.wins,
        losses: t.losses,
        winStreak: 0,
        bestWinStreak: 0,
      })),
    })

    setNick('')
    setRegion('NA')
    setTiers([{ mode: 'Overall', tier: 'HT5', points: 1500, wins: 0, losses: 0 }])
  }

  const startEditPlayer = (player: Player) => {
    setEditingPlayer(player)
    setEditNick(player.nick)
    setEditRegion(player.region)
    setEditTiers(player.tiers.map(t => ({
      mode: t.mode,
      tier: t.tier,
      points: t.points,
      wins: t.wins,
      losses: t.losses,
    })))
  }

  const saveEditPlayer = () => {
    if (!editingPlayer || !editNick.trim()) return

    updatePlayer(editingPlayer.id, {
      nick: editNick.trim(),
      region: editRegion,
      tiers: editTiers.map((t) => ({
        mode: t.mode,
        tier: t.tier,
        points: t.points,
        peak: t.tier,
        peakPoints: t.points,
        wins: t.wins,
        losses: t.losses,
        winStreak: 0,
        bestWinStreak: 0,
      })),
    })

    setEditingPlayer(null)
  }

  const handleSaveSettings = async () => {
    await updateSettings(localSettings)
    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 2000)
  }

  const handleResetSettings = async () => {
    await resetSettings()
    setLocalSettings({
      siteName: 'GlobalTierTesting',
      siteTagline: 'PvP Rankings',
      serverIP: 'br.yolux.fun',
      discordLink: 'https://discord.gg/yolux',
      primaryColor: '#3b82f6',
      accentColor: '#10b981',
      adminPassword: 'Adminstrator0973@',
      youtubeLink: '',
      twitterLink: '',
      footerText: '2024 GlobalTierTesting. Todos os direitos reservados.',
      announcementEnabled: false,
      announcementText: '',
      announcementType: 'info',
      maintenanceMode: false,
      maintenanceTitle: 'Site em Manutencao',
      maintenanceMessage: 'Estamos realizando manutencao no site. Por favor, volte mais tarde.',
      maintenanceEstimate: '',
      logoUrl: '',
      backgroundUrl: '',
      siteDescription: 'O sistema de ranking definitivo para jogadores de PvP do Minecraft.',
      rulesEnabled: false,
      rulesText: '',
    })
  }

  if (!isAdmin) return null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          size="sm"
          className={cn(
            'gap-2 h-9 bg-emerald-600 hover:bg-emerald-700',
            'transition-all duration-300'
          )}
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Painel Admin</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-card/95 backdrop-blur-xl border-border/30 p-0">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            Painel de Administrador
          </SheetTitle>
          <SheetDescription>
            Gerencie jogadores, configuracoes do site e muito mais. Todas as configuracoes sao GLOBAIS.
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="w-full justify-start px-6 bg-transparent border-b border-border/30 rounded-none h-auto pb-0 gap-1 overflow-x-auto">
            <TabsTrigger 
              value="players" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-4"
            >
              <Users className="h-4 w-4 mr-2" />
              Jogadores
            </TabsTrigger>
            <TabsTrigger 
              value="maintenance"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-400 rounded-none pb-3 px-4"
            >
              <Wrench className="h-4 w-4 mr-2" />
              Manutencao
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-4"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configuracoes
            </TabsTrigger>
            <TabsTrigger 
              value="appearance"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-400 rounded-none pb-3 px-4"
            >
              <Image className="h-4 w-4 mr-2" />
              Aparencia
            </TabsTrigger>
            <TabsTrigger 
              value="blacklist"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-red-500 rounded-none pb-3 px-4"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Blacklist
            </TabsTrigger>
            <TabsTrigger 
              value="advanced"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-red-400 rounded-none pb-3 px-4"
            >
              <Lock className="h-4 w-4 mr-2" />
              Avancado
            </TabsTrigger>
          </TabsList>

          {/* Players Tab */}
          <TabsContent value="players" className="p-6 pt-4 space-y-6 mt-0">
            {/* Add Player Section */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-emerald-400" />
                Adicionar Jogador
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground">Nick</label>
                  <Input
                    placeholder="Digite o nick..."
                    value={nick}
                    onChange={(e) => setNick(e.target.value)}
                    className="h-9 mt-1 bg-background/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Regiao</label>
                  <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
                    <SelectTrigger className="h-9 mt-1 bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          <span className="flex items-center gap-2">
                            <span>{REGION_FLAGS[r]}</span>
                            <span>{REGION_NAMES[r]}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tiers */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-muted-foreground">Tiers</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTierEntry}
                    disabled={tiers.length >= GAME_MODES.length}
                    className="h-7 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Modo
                  </Button>
                </div>

                {tiers.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-background/30">
                    <Select
                      value={entry.mode}
                      onValueChange={(v) => updateTierEntry(index, 'mode', v)}
                    >
                      <SelectTrigger className="w-[100px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GAME_MODES.filter(
                          (m) => m === entry.mode || !tiers.find((t) => t.mode === m)
                        ).map((mode) => (
                          <SelectItem key={mode} value={mode}>
                            <span className="flex items-center gap-1">
                              <ModeIcon mode={mode} size={12} />
                              <span className="text-xs">{mode}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={entry.tier}
                      onValueChange={(v) => updateTierEntry(index, 'tier', v)}
                    >
                      <SelectTrigger className="w-[80px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIERS.map((tier) => (
                          <SelectItem key={tier} value={tier}>
                            <TierBadge tier={tier} size="xs" />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      value={entry.points}
                      onChange={(e) => updateTierEntry(index, 'points', e.target.value)}
                      className="w-20 h-8 text-xs"
                      placeholder="Pts"
                    />

                    <Input
                      type="number"
                      value={entry.wins}
                      onChange={(e) => updateTierEntry(index, 'wins', e.target.value)}
                      className="w-16 h-8 text-xs"
                      placeholder="W"
                    />

                    <Input
                      type="number"
                      value={entry.losses}
                      onChange={(e) => updateTierEntry(index, 'losses', e.target.value)}
                      className="w-16 h-8 text-xs"
                      placeholder="L"
                    />

                    {tiers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTierEntry(index)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
                disabled={!nick.trim()}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Jogador
              </Button>
            </div>

            {/* Players List */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Jogadores ({players.length})
                </h3>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    value={searchPlayer}
                    onChange={(e) => setSearchPlayer(e.target.value)}
                    className="h-8 w-40 pl-7 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredPlayers.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Nenhum jogador encontrado
                  </p>
                ) : (
                  filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg',
                        'bg-background/30 border border-border/30',
                        'hover:bg-background/50 transition-colors',
                        editingPlayer?.id === player.id && 'ring-2 ring-primary'
                      )}
                    >
                      {editingPlayer?.id === player.id ? (
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              value={editNick}
                              onChange={(e) => setEditNick(e.target.value)}
                              className="h-8 text-xs"
                              placeholder="Nick"
                            />
                            <Select value={editRegion} onValueChange={(v) => setEditRegion(v as Region)}>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {REGIONS.map((r) => (
                                  <SelectItem key={r} value={r}>
                                    {REGION_FLAGS[r]} {r}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Tiers</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={addEditTierEntry}
                                disabled={editTiers.length >= GAME_MODES.length}
                                className="h-6 text-xs"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Modo
                              </Button>
                            </div>
                            {editTiers.map((entry, index) => (
                              <div key={index} className="flex items-center gap-1">
                                <Select
                                  value={entry.mode}
                                  onValueChange={(v) => updateEditTierEntry(index, 'mode', v)}
                                >
                                  <SelectTrigger className="w-[80px] h-7 text-[10px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {GAME_MODES.filter(
                                      (m) => m === entry.mode || !editTiers.find((t) => t.mode === m)
                                    ).map((mode) => (
                                      <SelectItem key={mode} value={mode} className="text-xs">
                                        {mode}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Select
                                  value={entry.tier}
                                  onValueChange={(v) => updateEditTierEntry(index, 'tier', v)}
                                >
                                  <SelectTrigger className="w-[70px] h-7 text-[10px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {TIERS.map((tier) => (
                                      <SelectItem key={tier} value={tier}>
                                        <TierBadge tier={tier} size="xs" />
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Input
                                  type="number"
                                  value={entry.points}
                                  onChange={(e) => updateEditTierEntry(index, 'points', e.target.value)}
                                  className="w-16 h-7 text-[10px]"
                                />
                                {editTiers.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeEditTierEntry(index)}
                                    className="h-6 w-6"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={saveEditPlayer}
                              className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Salvar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingPlayer(null)}
                              className="h-7 text-xs"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://mc-heads.net/body/${player.nick}/40`}
                              alt={player.nick}
                              className="w-auto h-10 rounded object-contain"
                            />
                            <div>
                              <p className="text-sm font-medium">{player.nick}</p>
                              <p className="text-xs text-muted-foreground">
                                {REGION_FLAGS[player.region]} {player.region}
                              </p>
                            </div>
                            <div className="flex gap-1 ml-2">
                              {player.tiers.slice(0, 3).map((t) => (
                                <TierBadge key={t.mode} tier={t.tier} size="xs" />
                              ))}
                              {player.tiers.length > 3 && (
                                <span className="text-[10px] text-muted-foreground">+{player.tiers.length - 3}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditPlayer(player)}
                              className="h-8 w-8 hover:bg-primary/10"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remover jogador?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja remover {player.nick}? Esta acao nao pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => removePlayer(player.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Remover
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="p-6 pt-4 space-y-4 mt-0">
            {/* Maintenance Mode Toggle */}
            <div className={cn(
              'rounded-xl border p-4',
              localSettings.maintenanceMode 
                ? 'bg-amber-500/10 border-amber-500/30' 
                : 'bg-secondary/20 border-border/30'
            )}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2 rounded-lg',
                    localSettings.maintenanceMode ? 'bg-amber-500/20' : 'bg-secondary/50'
                  )}>
                    <Wrench className={cn(
                      'h-5 w-5',
                      localSettings.maintenanceMode ? 'text-amber-400' : 'text-muted-foreground'
                    )} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Modo de Manutencao</h3>
                    <p className="text-xs text-muted-foreground">
                      {localSettings.maintenanceMode 
                        ? 'Site fechado para todos os usuarios' 
                        : 'Site aberto normalmente'
                      }
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localSettings.maintenanceMode}
                  onCheckedChange={(checked) => setLocalSettings({...localSettings, maintenanceMode: checked})}
                />
              </div>

              {localSettings.maintenanceMode && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <p className="text-xs text-amber-400">
                    O site esta fechado para todos os usuarios. Apenas administradores logados podem acessar.
                  </p>
                </div>
              )}
            </div>

            {/* Maintenance Settings */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Configuracoes da Pagina de Manutencao
              </h3>

              <div>
                <label className="text-xs text-muted-foreground">Titulo</label>
                <Input
                  value={localSettings.maintenanceTitle}
                  onChange={(e) => setLocalSettings({...localSettings, maintenanceTitle: e.target.value})}
                  className="h-9 mt-1 bg-background/50"
                  placeholder="Site em Manutencao"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Mensagem</label>
                <Textarea
                  value={localSettings.maintenanceMessage}
                  onChange={(e) => setLocalSettings({...localSettings, maintenanceMessage: e.target.value})}
                  className="mt-1 bg-background/50 min-h-[80px]"
                  placeholder="Estamos realizando manutencao no site..."
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Previsao de Retorno (opcional)
                </label>
                <Input
                  value={localSettings.maintenanceEstimate}
                  onChange={(e) => setLocalSettings({...localSettings, maintenanceEstimate: e.target.value})}
                  className="h-9 mt-1 bg-background/50"
                  placeholder="Ex: 2 horas, Amanha, etc."
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleSaveSettings}
                className={cn(
                  'flex-1 bg-emerald-600 hover:bg-emerald-700',
                  settingsSaved && 'bg-emerald-500'
                )}
              >
                <Save className="h-4 w-4 mr-2" />
                {settingsSaved ? 'Salvo!' : 'Salvar Alteracoes'}
              </Button>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="p-6 pt-4 space-y-4 mt-0">
            {/* Site Info */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Informacoes do Site
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Nome do Site</label>
                  <Input
                    value={localSettings.siteName}
                    onChange={(e) => setLocalSettings({...localSettings, siteName: e.target.value})}
                    className="h-9 mt-1 bg-background/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Tagline</label>
                  <Input
                    value={localSettings.siteTagline}
                    onChange={(e) => setLocalSettings({...localSettings, siteTagline: e.target.value})}
                    className="h-9 mt-1 bg-background/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Descricao do Site</label>
                <Textarea
                  value={localSettings.siteDescription}
                  onChange={(e) => setLocalSettings({...localSettings, siteDescription: e.target.value})}
                  className="mt-1 bg-background/50 min-h-[60px]"
                  placeholder="Descricao que aparece na pagina inicial..."
                />
              </div>
            </div>

            {/* Server */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Server className="h-4 w-4 text-emerald-400" />
                Servidor
              </h3>
              
              <div>
                <label className="text-xs text-muted-foreground">IP do Servidor</label>
                <Input
                  value={localSettings.serverIP}
                  onChange={(e) => setLocalSettings({...localSettings, serverIP: e.target.value})}
                  className="h-9 mt-1 bg-background/50 font-mono"
                  placeholder="ex: play.servidor.com"
                />
              </div>
            </div>

            {/* Links */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Link className="h-4 w-4 text-blue-400" />
                Links Sociais
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    Discord
                    <ExternalLink className="h-3 w-3" />
                  </label>
                  <Input
                    value={localSettings.discordLink}
                    onChange={(e) => setLocalSettings({...localSettings, discordLink: e.target.value})}
                    className="h-9 mt-1 bg-background/50"
                    placeholder="https://discord.gg/..."
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    YouTube
                    <ExternalLink className="h-3 w-3" />
                  </label>
                  <Input
                    value={localSettings.youtubeLink}
                    onChange={(e) => setLocalSettings({...localSettings, youtubeLink: e.target.value})}
                    className="h-9 mt-1 bg-background/50"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    Twitter/X
                    <ExternalLink className="h-3 w-3" />
                  </label>
                  <Input
                    value={localSettings.twitterLink}
                    onChange={(e) => setLocalSettings({...localSettings, twitterLink: e.target.value})}
                    className="h-9 mt-1 bg-background/50"
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Announcement */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Bell className="h-4 w-4 text-amber-400" />
                  Anuncio
                </h3>
                <Switch
                  checked={localSettings.announcementEnabled}
                  onCheckedChange={(checked) => setLocalSettings({...localSettings, announcementEnabled: checked})}
                />
              </div>
              
              {localSettings.announcementEnabled && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Tipo</label>
                    <Select 
                      value={localSettings.announcementType} 
                      onValueChange={(v) => setLocalSettings({...localSettings, announcementType: v as 'info' | 'warning' | 'success' | 'error'})}
                    >
                      <SelectTrigger className="h-9 mt-1 bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Informacao</SelectItem>
                        <SelectItem value="warning">Aviso</SelectItem>
                        <SelectItem value="success">Sucesso</SelectItem>
                        <SelectItem value="error">Erro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Mensagem</label>
                    <Textarea
                      value={localSettings.announcementText}
                      onChange={(e) => setLocalSettings({...localSettings, announcementText: e.target.value})}
                      className="mt-1 bg-background/50 min-h-[80px]"
                      placeholder="Digite a mensagem do anuncio..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Visual */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Image className="h-4 w-4 text-purple-400" />
                Visual
              </h3>
              
              <div>
                <label className="text-xs text-muted-foreground">URL do Logo (opcional)</label>
                <Input
                  value={localSettings.logoUrl}
                  onChange={(e) => setLocalSettings({...localSettings, logoUrl: e.target.value})}
                  className="h-9 mt-1 bg-background/50"
                  placeholder="https://exemplo.com/logo.png"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground">URL do Background (opcional)</label>
                <Input
                  value={localSettings.backgroundUrl}
                  onChange={(e) => setLocalSettings({...localSettings, backgroundUrl: e.target.value})}
                  className="h-9 mt-1 bg-background/50"
                  placeholder="https://exemplo.com/background.png"
                />
              </div>
            </div>

            {/* Security */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Lock className="h-4 w-4 text-red-400" />
                Seguranca
              </h3>
              
              <div>
                <label className="text-xs text-muted-foreground">Senha de Admin</label>
                <Input
                  type="password"
                  value={localSettings.adminPassword}
                  onChange={(e) => setLocalSettings({...localSettings, adminPassword: e.target.value})}
                  className="h-9 mt-1 bg-background/50"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                Rodape
              </h3>
              
              <div>
                <label className="text-xs text-muted-foreground">Texto do Rodape</label>
                <Input
                  value={localSettings.footerText}
                  onChange={(e) => setLocalSettings({...localSettings, footerText: e.target.value})}
                  className="h-9 mt-1 bg-background/50"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSaveSettings}
                className={cn(
                  'flex-1 bg-emerald-600 hover:bg-emerald-700',
                  settingsSaved && 'bg-emerald-500'
                )}
              >
                <Save className="h-4 w-4 mr-2" />
                {settingsSaved ? 'Salvo!' : 'Salvar Configuracoes'}
              </Button>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="p-6 pt-4 space-y-4 mt-0">
            {/* Colors */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400" />
                Cores do Site
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Cor Primaria</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="color"
                      value={localSettings.primaryColor}
                      onChange={(e) => setLocalSettings({...localSettings, primaryColor: e.target.value})}
                      className="w-10 h-9 rounded cursor-pointer"
                    />
                    <Input
                      value={localSettings.primaryColor}
                      onChange={(e) => setLocalSettings({...localSettings, primaryColor: e.target.value})}
                      className="h-9 flex-1 bg-background/50 font-mono text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Cor de Destaque</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="color"
                      value={localSettings.accentColor}
                      onChange={(e) => setLocalSettings({...localSettings, accentColor: e.target.value})}
                      className="w-10 h-9 rounded cursor-pointer"
                    />
                    <Input
                      value={localSettings.accentColor}
                      onChange={(e) => setLocalSettings({...localSettings, accentColor: e.target.value})}
                      className="h-9 flex-1 bg-background/50 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Image className="h-4 w-4 text-purple-400" />
                Imagens
              </h3>
              
              <div>
                <label className="text-xs text-muted-foreground">URL do Logo</label>
                <Input
                  value={localSettings.logoUrl}
                  onChange={(e) => setLocalSettings({...localSettings, logoUrl: e.target.value})}
                  className="h-9 mt-1 bg-background/50"
                  placeholder="https://exemplo.com/logo.png"
                />
                {localSettings.logoUrl && (
                  <div className="mt-2 p-2 rounded bg-background/30 flex items-center gap-2">
                    <img src={localSettings.logoUrl} alt="Preview" className="h-8 object-contain" />
                    <span className="text-xs text-muted-foreground">Preview</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-muted-foreground">URL do Background</label>
                <Input
                  value={localSettings.backgroundUrl}
                  onChange={(e) => setLocalSettings({...localSettings, backgroundUrl: e.target.value})}
                  className="h-9 mt-1 bg-background/50"
                  placeholder="https://exemplo.com/background.png"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground">URL do Favicon</label>
                <Input
                  value={localSettings.faviconUrl || ''}
                  onChange={(e) => setLocalSettings({...localSettings, faviconUrl: e.target.value})}
                  className="h-9 mt-1 bg-background/50"
                  placeholder="https://exemplo.com/favicon.ico"
                />
              </div>
            </div>

            {/* Typography */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-400" />
                Tipografia
              </h3>
              
              <div>
                <label className="text-xs text-muted-foreground">Fonte Principal (Google Fonts)</label>
                <Select 
                  value={localSettings.fontFamily || 'Inter'} 
                  onValueChange={(v) => setLocalSettings({...localSettings, fontFamily: v})}
                >
                  <SelectTrigger className="h-9 mt-1 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Seasonal Events */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <span className="text-lg">🎉</span>
                Eventos Comemorativos
              </h3>
              <p className="text-xs text-muted-foreground">Mude a aparencia do site para eventos especiais. A mudanca e GLOBAL para todos os usuarios.</p>
              
              <div>
                <label className="text-xs text-muted-foreground">Evento Ativo</label>
                <Select 
                  value={localSettings.seasonalEvent || 'none'} 
                  onValueChange={(v) => setLocalSettings({...localSettings, seasonalEvent: v as any})}
                >
                  <SelectTrigger className="h-9 mt-1 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <span className="flex items-center gap-2">Nenhum (Padrao)</span>
                    </SelectItem>
                    <SelectItem value="christmas">
                      <span className="flex items-center gap-2">🎄 Natal</span>
                    </SelectItem>
                    <SelectItem value="halloween">
                      <span className="flex items-center gap-2">🎃 Halloween</span>
                    </SelectItem>
                    <SelectItem value="easter">
                      <span className="flex items-center gap-2">🐰 Pascoa</span>
                    </SelectItem>
                    <SelectItem value="valentines">
                      <span className="flex items-center gap-2">💕 Dia dos Namorados</span>
                    </SelectItem>
                    <SelectItem value="newyear">
                      <span className="flex items-center gap-2">🎆 Ano Novo</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {localSettings.seasonalEvent && localSettings.seasonalEvent !== 'none' && (
                <div className="p-3 rounded-lg bg-background/30 border border-border/20">
                  <p className="text-xs text-muted-foreground">
                    {localSettings.seasonalEvent === 'christmas' && '🎄 Tema natalino ativado - cores vermelha e verde, flocos de neve'}
                    {localSettings.seasonalEvent === 'halloween' && '🎃 Tema de Halloween ativado - cores laranja e roxo, morcegos'}
                    {localSettings.seasonalEvent === 'easter' && '🐰 Tema de Pascoa ativado - cores pastel, coelhinhos'}
                    {localSettings.seasonalEvent === 'valentines' && '💕 Tema romantico ativado - cores rosa e vermelho, coracoes'}
                    {localSettings.seasonalEvent === 'newyear' && '🎆 Tema de Ano Novo ativado - fogos de artificio, confetes'}
                  </p>
                </div>
              )}
            </div>

            {/* Layout */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4 text-emerald-400" />
                Layout
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Mostrar Posicao no Ranking</p>
                  <p className="text-xs text-muted-foreground">Exibir numero da posicao ao lado do jogador</p>
                </div>
                <Switch
                  checked={localSettings.showRankNumbers !== false}
                  onCheckedChange={(checked) => setLocalSettings({...localSettings, showRankNumbers: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Mostrar Regiao</p>
                  <p className="text-xs text-muted-foreground">Exibir badge de regiao do jogador</p>
                </div>
                <Switch
                  checked={localSettings.showRegion !== false}
                  onCheckedChange={(checked) => setLocalSettings({...localSettings, showRegion: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Mostrar Titulo do Jogador</p>
                  <p className="text-xs text-muted-foreground">Exibir titulo baseado em pontos</p>
                </div>
                <Switch
                  checked={localSettings.showPlayerTitle !== false}
                  onCheckedChange={(checked) => setLocalSettings({...localSettings, showPlayerTitle: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Cores do Top 3</p>
                  <p className="text-xs text-muted-foreground">Destacar top 3 com cores especiais</p>
                </div>
                <Switch
                  checked={localSettings.showTop3Colors !== false}
                  onCheckedChange={(checked) => setLocalSettings({...localSettings, showTop3Colors: checked})}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSaveSettings}
                className={cn(
                  'flex-1 bg-emerald-600 hover:bg-emerald-700',
                  settingsSaved && 'bg-emerald-500'
                )}
              >
                <Save className="h-4 w-4 mr-2" />
                {settingsSaved ? 'Salvo!' : 'Salvar Aparencia'}
              </Button>
            </div>
          </TabsContent>

          {/* Blacklist Tab */}
          <TabsContent value="blacklist" className="p-6 pt-4 space-y-4 mt-0">
            {/* Add to Blacklist */}
            <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                Adicionar a Blacklist
              </h3>
              <p className="text-xs text-muted-foreground">
                Jogadores na blacklist nao poderao fazer testes e serao removidos do ranking.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Nick do Jogador</label>
                  <Input
                    placeholder="Digite o nick..."
                    id="blacklist-nick"
                    className="h-9 mt-1 bg-background/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Motivo</label>
                  <Select defaultValue="cheating">
                    <SelectTrigger className="h-9 mt-1 bg-background/50" id="blacklist-reason">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cheating">Trapaças/Cheats</SelectItem>
                      <SelectItem value="toxicity">Comportamento Toxico</SelectItem>
                      <SelectItem value="boosting">Boosting</SelectItem>
                      <SelectItem value="multiaccounting">Multi-accounting</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Tipo de Ban</label>
                  <Select defaultValue="permanent">
                    <SelectTrigger className="h-9 mt-1 bg-background/50" id="blacklist-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanente</SelectItem>
                      <SelectItem value="7d">7 dias</SelectItem>
                      <SelectItem value="30d">30 dias</SelectItem>
                      <SelectItem value="90d">90 dias</SelectItem>
                      <SelectItem value="1y">1 ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      const nickInput = document.getElementById('blacklist-nick') as HTMLInputElement
                      const nick = nickInput?.value?.trim()
                      if (!nick) return
                      
                      const newBlacklist = [...(localSettings.blacklistedPlayers || []), {
                        nick,
                        reason: 'Banido pelo administrador',
                        bannedAt: new Date(),
                        bannedBy: 'Admin'
                      }]
                      setLocalSettings({...localSettings, blacklistedPlayers: newBlacklist})
                      nickInput.value = ''
                    }}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Adicionar a Blacklist
                  </Button>
                </div>
              </div>
            </div>

            {/* Blacklisted Players List */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-red-400" />
                Jogadores Banidos ({localSettings.blacklistedPlayers?.length || 0})
              </h3>

              {(!localSettings.blacklistedPlayers || localSettings.blacklistedPlayers.length === 0) ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Nenhum jogador na blacklist</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {localSettings.blacklistedPlayers.map((player, index) => (
                    <div
                      key={`${player.nick}-${index}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/20"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://mc-heads.net/avatar/${player.nick}/32`}
                          alt={player.nick}
                          className="w-8 h-8 rounded"
                        />
                        <div>
                          <p className="font-medium text-red-400">{player.nick}</p>
                          <p className="text-xs text-muted-foreground">{player.reason}</p>
                          <p className="text-[10px] text-muted-foreground/70">
                            {player.expiresAt ? `Expira em: ${new Date(player.expiresAt).toLocaleDateString('pt-BR')}` : 'Permanente'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-emerald-400"
                        onClick={() => {
                          const newBlacklist = localSettings.blacklistedPlayers?.filter((_, i) => i !== index)
                          setLocalSettings({...localSettings, blacklistedPlayers: newBlacklist})
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSaveSettings}
                className={cn(
                  'flex-1 bg-emerald-600 hover:bg-emerald-700',
                  settingsSaved && 'bg-emerald-500'
                )}
              >
                <Save className="h-4 w-4 mr-2" />
                {settingsSaved ? 'Salvo!' : 'Salvar Blacklist'}
              </Button>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="p-6 pt-4 space-y-4 mt-0">
            {/* Security */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Lock className="h-4 w-4 text-red-400" />
                Seguranca
              </h3>
              
              <div>
                <label className="text-xs text-muted-foreground">Senha de Admin</label>
                <Input
                  type="password"
                  value={localSettings.adminPassword}
                  onChange={(e) => setLocalSettings({...localSettings, adminPassword: e.target.value})}
                  className="h-9 mt-1 bg-background/50"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Usado para acessar o painel de administrador</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Modo Somente Leitura</p>
                  <p className="text-xs text-muted-foreground">Bloquear edicoes de jogadores</p>
                </div>
                <Switch
                  checked={localSettings.readOnlyMode || false}
                  onCheckedChange={(checked) => setLocalSettings({...localSettings, readOnlyMode: checked})}
                />
              </div>
            </div>

            {/* SEO */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-400" />
                SEO e Meta Tags
              </h3>
              
              <div>
                <label className="text-xs text-muted-foreground">Meta Description</label>
                <Textarea
                  value={localSettings.metaDescription || localSettings.siteDescription}
                  onChange={(e) => setLocalSettings({...localSettings, metaDescription: e.target.value})}
                  className="mt-1 bg-background/50 min-h-[60px]"
                  placeholder="Descricao para motores de busca..."
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Keywords (separadas por virgula)</label>
                <Input
                  value={localSettings.metaKeywords || ''}
                  onChange={(e) => setLocalSettings({...localSettings, metaKeywords: e.target.value})}
                  className="h-9 mt-1 bg-background/50"
                  placeholder="minecraft, pvp, ranking, tiers..."
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Open Graph Image URL</label>
                <Input
                  value={localSettings.ogImageUrl || ''}
                  onChange={(e) => setLocalSettings({...localSettings, ogImageUrl: e.target.value})}
                  className="h-9 mt-1 bg-background/50"
                  placeholder="https://exemplo.com/og-image.png"
                />
              </div>
            </div>

            {/* Rules */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-amber-400" />
                  Regras do Site
                </h3>
                <Switch
                  checked={localSettings.rulesEnabled || false}
                  onCheckedChange={(checked) => setLocalSettings({...localSettings, rulesEnabled: checked})}
                />
              </div>
              
              {localSettings.rulesEnabled && (
                <div>
                  <label className="text-xs text-muted-foreground">Texto das Regras (Markdown)</label>
                  <Textarea
                    value={localSettings.rulesText || ''}
                    onChange={(e) => setLocalSettings({...localSettings, rulesText: e.target.value})}
                    className="mt-1 bg-background/50 min-h-[150px] font-mono text-xs"
                    placeholder="# Regras&#10;1. Seja respeitoso&#10;2. Sem trapaças..."
                  />
                </div>
              )}
            </div>

            {/* Data Management */}
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                Zona de Perigo
              </h3>
              
              <div className="space-y-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Resetar Todas as Configuracoes
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Resetar configuracoes?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Todas as configuracoes voltarao ao padrao. Esta acao nao pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetSettings} className="bg-red-500 hover:bg-red-600">
                        Resetar Tudo
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover Todos os Jogadores
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover todos os jogadores?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Todos os jogadores serao removidos permanentemente. Esta acao nao pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          players.forEach(p => removePlayer(p.id))
                        }} 
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Remover Todos
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSaveSettings}
                className={cn(
                  'flex-1 bg-emerald-600 hover:bg-emerald-700',
                  settingsSaved && 'bg-emerald-500'
                )}
              >
                <Save className="h-4 w-4 mr-2" />
                {settingsSaved ? 'Salvo!' : 'Salvar Avancado'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
