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

  listenPlayers: () => void
}

export const usePlayersStore = create<PlayersState>((set) => ({
  players: [],
  isAdmin: false,

  setAdmin: (isAdmin) => set({ isAdmin }),

  addPlayer: async (playerData) => {
    await addDoc(collection(db, 'players'), {
      ...playerData,
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

  listenPlayers: () => {
    onSnapshot(collection(db, 'players'), (snapshot) => {
      const players = snapshot.docs.map((doc) => {
        const data: any = doc.data()

        return {
          id: doc.id,
          nick: data.nick || 'Sem nome',
          region: data.region || 'BR',

          tiers: Array.isArray(data.tiers)
            ? data.tiers.map((t: any) => ({
                mode: t?.mode || 'Overall',
                tier: t?.tier || 'LT5',
                points: t?.points || 0,
                wins: t?.wins || 0,
                losses: t?.losses || 0,
                peakPoints: t?.peakPoints || 0,
              }))
            : [
                {
                  mode: data.mode || 'Overall',
                  tier: data.tier || 'LT5',
                  points: data.points || 0,
                  wins: 0,
                  losses: 0,
                  peakPoints: 0,
                },
              ],
        }
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
