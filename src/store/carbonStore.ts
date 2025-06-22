// src/store/carbonStore.ts
import { create } from 'zustand'
import { supabase } from '../utils/supabaseClient'

export interface Activity {
  id: string
  user_id: string
  type: string
  description: string
  carbon_kg: number
  metadata: {
    vehicleType?: string
    distanceKm?: number
    energyUsage?: number
    energyType?: string
    foodWeight?: number
    foodType?: string
    productCategory?: string
    quantity?: number
    [key: string]: unknown
  }
  created_at: string
  algo_tx_id?: string      // populated after anchoring
  algo_hash?: string       // SHA256 hex of the payload
}

interface CarbonState {
  activities: Activity[]
  loading: boolean
  fetchActivities: () => Promise<void>
  addActivity: (
    payload: Omit<Activity, 'id' | 'user_id' | 'created_at' | 'algo_tx_id' | 'algo_hash'>
  ) => Promise<void>
}

export const useCarbonStore = create<CarbonState>((set) => ({
  activities: [],
  loading: false,

  fetchActivities: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('activities')
      .select('*')

    if (error) {
      console.error('fetchActivities error:', error)
      set({ loading: false })
      return
    }
    set({ activities: (data as Activity[]) || [], loading: false })
  },

  addActivity: async (payload) => {
    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData?.user) throw new Error('Must be signed in to add activity')

    // 1) Insert into Supabase
    const { data: newAct, error: insertErr } = await supabase
      .from('activities')
      .insert([{ ...payload, user_id: userData.user.id }])
      .select('*')
      .single()
    if (insertErr || !newAct) {
      console.error('addActivity insert error:', insertErr)
      return
    }
    // optimistically update UI
    set((state) => ({ activities: [newAct as Activity, ...state.activities] }))

    // 2) Anchor on Algorand
    try {
      const resp = await fetch('/.netlify/functions/anchor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: newAct }),
      })
      if (!resp.ok) {
        console.error('Anchor function failed:', await resp.text())
        return
      }
      const { txId, hash } = await resp.json()

      // 3) Patch Supabase record with txId & hash
      const { data: updated, error: updateErr } = await supabase
        .from('activities')
        .update({ algo_tx_id: txId, algo_hash: hash })
        .eq('id', newAct.id)
        .select('*')
        .single()
      if (updateErr) {
        console.error('Error updating activity with anchor data:', updateErr)
        return
      }

      // 4) Update store with anchored info
      set((state) => ({
        activities: state.activities.map((act) =>
          act.id === updated.id ? (updated as Activity) : act
        ),
      }))
    } catch (e) {
      console.error('Unexpected anchoring error:', e)
    }
  },
}))
