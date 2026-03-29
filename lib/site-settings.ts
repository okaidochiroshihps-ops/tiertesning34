'use client'

import { create } from 'zustand'
import { db } from './firebase'
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore'

export type SeasonalEvent = 'none' | 'christmas' | 'halloween' | 'easter' | 'valentines' | 'newyear'

export interface BlacklistedPlayer {
  nick: string
  reason: string
  bannedAt: Date
  expiresAt?: Date // undefined = permanente
  bannedBy: string
}

export interface SiteSettings {
  // Informacoes basicas
  siteName: string
  siteTagline: string
  serverIP: string
  discordLink: string
  
  // Cores principais
  primaryColor: string
  accentColor: string
  
  // Admin
  adminPassword: string
  
  // Social
  youtubeLink: string
  twitterLink: string
  
  // Footer
  footerText: string
  
  // Anuncios
  announcementEnabled: boolean
  announcementText: string
  announcementType: 'info' | 'warning' | 'success' | 'error'
  
  // Manutencao Global
  maintenanceMode: boolean
  maintenanceTitle: string
  maintenanceMessage: string
  maintenanceEstimate: string
  
  // Visual
  logoUrl: string
  backgroundUrl: string
  faviconUrl?: string
  fontFamily?: string
  
  // Layout
  showRankNumbers?: boolean
  showRegion?: boolean
  showPlayerTitle?: boolean
  showTop3Colors?: boolean
  
  // Eventos Comemorativos
  seasonalEvent: SeasonalEvent
  customEventName?: string
  
  // Blacklist
  blacklistedPlayers: BlacklistedPlayer[]
  
  // SEO
  siteDescription: string
  metaDescription?: string
  metaKeywords?: string
  ogImageUrl?: string
  
  // Seguranca
  readOnlyMode?: boolean
  
  // Regras
  rulesEnabled: boolean
  rulesText: string
}

interface SiteSettingsState {
  settings: SiteSettings
  isLoading: boolean
  updateSettings: (updates: Partial<SiteSettings>) => Promise<void>
  resetSettings: () => Promise<void>
  listenSettings: () => void
}

const defaultSettings: SiteSettings = {
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
  faviconUrl: '',
  fontFamily: 'Inter',
  showRankNumbers: true,
  showRegion: true,
  showPlayerTitle: true,
  showTop3Colors: true,
  seasonalEvent: 'none',
  customEventName: '',
  blacklistedPlayers: [],
  siteDescription: 'O sistema de ranking definitivo para jogadores de PvP do Minecraft.',
  metaDescription: '',
  metaKeywords: '',
  ogImageUrl: '',
  readOnlyMode: false,
  rulesEnabled: false,
  rulesText: '',
}

export const useSiteSettings = create<SiteSettingsState>((set, get) => ({
  settings: defaultSettings,
  isLoading: true,
  
  updateSettings: async (updates) => {
    const newSettings = { ...get().settings, ...updates }
    set({ settings: newSettings })
    
    // Salva no Firebase para ser global
    try {
      await setDoc(doc(db, 'settings', 'global'), newSettings)
    } catch (error) {
      console.error('Erro ao salvar configuracoes:', error)
    }
  },
  
  resetSettings: async () => {
    set({ settings: defaultSettings })
    try {
      await setDoc(doc(db, 'settings', 'global'), defaultSettings)
    } catch (error) {
      console.error('Erro ao resetar configuracoes:', error)
    }
  },
  
  listenSettings: () => {
    // Primeiro, tenta carregar as configuracoes existentes
    const settingsRef = doc(db, 'settings', 'global')
    
    // Escuta mudancas em tempo real
    onSnapshot(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Partial<SiteSettings>
        set({ 
          settings: { ...defaultSettings, ...data },
          isLoading: false 
        })
      } else {
        // Se nao existir, cria com valores padrao
        setDoc(settingsRef, defaultSettings)
        set({ settings: defaultSettings, isLoading: false })
      }
    }, (error) => {
      console.error('Erro ao escutar configuracoes:', error)
      set({ isLoading: false })
    })
  }
}))
