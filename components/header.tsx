'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Input } from '@/components/ui/input'
import { usePlayersStore } from '@/lib/store'
import { useSiteSettings } from '@/lib/site-settings'
import { Shield, LogOut, Lock, Copy, Check, Swords, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export function Header() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { isAdmin, setAdmin } = usePlayersStore()
  const { settings } = useSiteSettings()

  const handleLogin = () => {
    if (password === settings.adminPassword) {
      setAdmin(true)
      setPassword('')
      setError('')
      setOpen(false)
    } else {
      setError('Senha incorreta')
    }
  }

  const handleLogout = () => {
    setAdmin(false)
  }

  const copyIP = () => {
    navigator.clipboard.writeText(settings.serverIP)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getAnnouncementStyles = () => {
    switch (settings.announcementType) {
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400'
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
      case 'error':
        return 'bg-red-500/10 border-red-500/30 text-red-400'
      default:
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
    }
  }

  const getAnnouncementIcon = () => {
    switch (settings.announcementType) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />
      case 'success':
        return <CheckCircle className="h-4 w-4" />
      case 'error':
        return <XCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <>
      {/* Announcement Banner */}
      {settings.announcementEnabled && settings.announcementText && (
        <div className={cn(
          'w-full py-2 px-4 border-b text-center text-sm',
          getAnnouncementStyles()
        )}>
          <div className="container mx-auto flex items-center justify-center gap-2">
            {getAnnouncementIcon()}
            <span>{settings.announcementText}</span>
          </div>
        </div>
      )}
      
      <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className={cn(
              'flex items-center justify-center w-10 h-10 rounded-xl',
              'bg-gradient-to-br from-primary/30 to-primary/10',
              'border border-primary/30',
              'transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20'
            )}>
              <Swords className="h-5 w-5 text-primary transition-transform group-hover:rotate-12" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight transition-colors group-hover:text-primary">
                <span className="text-primary">{settings.siteName.split(/(?=[A-Z])/)[0]}</span>
                <span className="text-foreground">{settings.siteName.split(/(?=[A-Z])/).slice(1).join('')}</span>
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{settings.siteTagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Server IP */}
            <button
              onClick={copyIP}
              className={cn(
                'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg',
                'bg-secondary/50 border border-border/50',
                'transition-all duration-300 hover:bg-secondary hover:border-primary/30',
                'group/ip cursor-pointer'
              )}
            >
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">IP:</span>
              <span className="text-sm font-mono font-medium text-primary group-hover/ip:text-primary">
                {settings.serverIP}
              </span>
              {copied ? (
                <Check className="h-3 w-3 text-emerald-400 animate-in zoom-in duration-200" />
              ) : (
                <Copy className="h-3 w-3 text-muted-foreground transition-colors group-hover/ip:text-primary" />
              )}
            </button>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <div className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg',
                  'bg-emerald-500/10 border border-emerald-500/30',
                  'animate-in slide-in-from-right duration-300'
                )}>
                  <Shield className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">Admin</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout}
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      'gap-2 h-8 text-xs transition-all duration-300',
                      'hover:bg-primary/10 hover:border-primary/50'
                    )}
                  >
                    <Lock className="h-3 w-3" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Login de Administrador
                    </DialogTitle>
                    <DialogDescription>
                      Digite a senha de administrador para gerenciar jogadores e configuracoes.
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
                      <p className="text-sm text-destructive animate-in shake duration-300">
                        {error}
                      </p>
                    )}
                    <Button onClick={handleLogin} className="w-full">
                      Entrar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
