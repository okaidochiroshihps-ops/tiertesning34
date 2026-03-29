'use client'

import { create } from 'zustand'
import { db } from './firebase'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc
} from 'firebase/firestore'

import { useEffect, useState } from 'react'
import type { Player } from './types'

interface PlayersState {
  players: Player[]
  isAdmin: boolean

  setAdmin: (isAdmin: boolean) => void

  addPlayer: (player: Omit<Player, 'id'>) => Promise<void>
  removePlayer: (id: string) => Promise<void>
  updatePlayer: (id: string, data: Partial<Player>) => Promise<void>
  movePlayer: (id: string, direction: 'up' | 'down', mode: string) => Promise<void>
  reorderPlayers: (orderedIds: string[]) => Promise<void>

  listenPlayers: () => void
}

export const usePlayersStore = create<PlayersState>((set) => ({
  players: [],
  isAdmin: false,

  setAdmin: (isAdmin) => set({ isAdmin }),

  addPlayer: async (playerData) => {
    const { players } = usePlayersStore.getState()
    // Define a ordem como o ultimo (maior order + 1)
    const maxOrder = players.reduce((max, p) => Math.max(max, p.order ?? 0), 0)
    
    await addDoc(collection(db, 'players'), {
      ...playerData,
      order: maxOrder + 1,
      joinedAt: new Date(),
      lastSeen: new Date(),
    })
  },

  removePlayer: async (id) => {
    await deleteDoc(doc(db, 'players', id))
  },

  updatePlayer: async (id, data) => {
    await updateDoc(doc(db, 'players', id), {
      ...data,
      lastSeen: new Date(),
    })
  },

  movePlayer: async (id, direction, mode) => {
    const { players } = usePlayersStore.getState()
    
    // Ordena os jogadores pelo order atual
    const sorted = [...players].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
    const currentIndex = sorted.findIndex(p => p.id === id)
    
    if (currentIndex === -1) return
    if (direction === 'up' && currentIndex === 0) return
    if (direction === 'down' && currentIndex === sorted.length - 1) return
    
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const currentPlayer = sorted[currentIndex]
    const swapPlayer = sorted[swapIndex]
    
    // Troca as ordens
    await updateDoc(doc(db, 'players', currentPlayer.id), { order: swapIndex })
    await updateDoc(doc(db, 'players', swapPlayer.id), { order: currentIndex })
  },

  reorderPlayers: async (orderedIds) => {
    // Atualiza a ordem de todos os jogadores
    const updates = orderedIds.map((id, index) => 
      updateDoc(doc(db, 'players', id), { order: index })
    )
    await Promise.all(updates)
  },

  listenPlayers: () => {
    onSnapshot(collection(db, 'players'), (snapshot) => {
      const players = snapshot.docs.map((doc) => {
        const data: any = doc.data()

        const player = {
          id: doc.id,
          nick: data.nick || 'Sem nome',
          region: data.region || 'BR',
          order: typeof data.order === 'number' ? data.order : 9999,

          tiers: Array.isArray(data.tiers)
            ? data.tiers.map((t: any) => ({
                mode: t?.mode || 'Overall',
                tier: t?.tier || 'LT5',
                points: Number(t?.points) || 0,
                wins: Number(t?.wins) || 0,
                losses: Number(t?.losses) || 0,
                peakPoints: Number(t?.peakPoints) || 0,
              }))
            : [
                {
                  mode: data.mode || 'Overall',
                  tier: data.tier || 'LT5',
                  points: Number(data.points) || 0,
                  wins: 0,
                  losses: 0,
                  peakPoints: 0,
                },
              ],
        }
        
        return player
      })

      set({ players })
    })
  },
}))

export function useHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}
