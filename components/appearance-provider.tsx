'use client'

import { useEffect } from 'react'
import { useSiteSettings } from '@/lib/site-settings'

// Converte HEX para HSL
function hexToHSL(hex: string): { h: number; s: number; l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null

  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

// Converte HEX para OKLCH (aproximado)
function hexToOKLCH(hex: string): string {
  const hsl = hexToHSL(hex)
  if (!hsl) return 'oklch(0.7 0.18 200)'
  
  // Conversao aproximada de HSL para OKLCH
  const l = hsl.l / 100
  const c = (hsl.s / 100) * 0.4 // Chroma aproximado
  const h = hsl.h
  
  // Ajuste para OKLCH - L vai de 0 a 1, C de 0 a ~0.4
  const oklchL = 0.4 + l * 0.5 // Range de 0.4 a 0.9
  const oklchC = c * 0.5 // Range de 0 a 0.2
  
  return `oklch(${oklchL.toFixed(2)} ${oklchC.toFixed(2)} ${h})`
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSiteSettings()

  useEffect(() => {
    // Aplica a imagem de fundo
    if (settings.backgroundUrl) {
      document.body.style.backgroundImage = `url(${settings.backgroundUrl})`
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundPosition = 'center'
      document.body.style.backgroundRepeat = 'no-repeat'
      document.body.style.backgroundAttachment = 'fixed'
    } else {
      document.body.style.backgroundImage = ''
      document.body.style.backgroundSize = ''
      document.body.style.backgroundPosition = ''
      document.body.style.backgroundRepeat = ''
      document.body.style.backgroundAttachment = ''
    }
  }, [settings.backgroundUrl])

  useEffect(() => {
    // Aplica a cor primaria
    if (settings.primaryColor) {
      const oklch = hexToOKLCH(settings.primaryColor)
      document.documentElement.style.setProperty('--primary', oklch)
      document.documentElement.style.setProperty('--ring', oklch)
      document.documentElement.style.setProperty('--sidebar-primary', oklch)
      document.documentElement.style.setProperty('--sidebar-ring', oklch)
      document.documentElement.style.setProperty('--chart-1', oklch)
    }
  }, [settings.primaryColor])

  useEffect(() => {
    // Aplica a cor de destaque
    if (settings.accentColor) {
      const oklch = hexToOKLCH(settings.accentColor)
      document.documentElement.style.setProperty('--accent', oklch)
      document.documentElement.style.setProperty('--chart-2', oklch)
    }
  }, [settings.accentColor])

  useEffect(() => {
    // Aplica o favicon dinamicamente
    if (settings.faviconUrl) {
      // Remove favicons existentes
      const existingFavicons = document.querySelectorAll("link[rel*='icon']")
      existingFavicons.forEach(favicon => favicon.remove())

      // Cria novo favicon
      const link = document.createElement('link')
      link.rel = 'icon'
      link.href = settings.faviconUrl
      
      // Detecta tipo baseado na extensao
      if (settings.faviconUrl.endsWith('.ico')) {
        link.type = 'image/x-icon'
      } else if (settings.faviconUrl.endsWith('.png')) {
        link.type = 'image/png'
      } else if (settings.faviconUrl.endsWith('.svg')) {
        link.type = 'image/svg+xml'
      }
      
      document.head.appendChild(link)

      // Adiciona tambem apple-touch-icon para dispositivos Apple
      const appleLink = document.createElement('link')
      appleLink.rel = 'apple-touch-icon'
      appleLink.href = settings.faviconUrl
      document.head.appendChild(appleLink)
    }
  }, [settings.faviconUrl])

  useEffect(() => {
    // Aplica a fonte personalizada
    if (settings.fontFamily && settings.fontFamily !== 'Inter') {
      // Carrega a fonte do Google Fonts
      const fontLink = document.getElementById('custom-font-link')
      if (fontLink) {
        fontLink.remove()
      }

      const link = document.createElement('link')
      link.id = 'custom-font-link'
      link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(' ', '+')}:wght@400;500;600;700&display=swap`
      document.head.appendChild(link)

      // Aplica a fonte no CSS
      document.documentElement.style.setProperty('--font-sans', `'${settings.fontFamily}', system-ui, sans-serif`)
    } else {
      // Reseta para a fonte padrao
      document.documentElement.style.setProperty('--font-sans', "'Geist', 'Geist Fallback', system-ui, sans-serif")
    }
  }, [settings.fontFamily])

  return <>{children}</>
}
