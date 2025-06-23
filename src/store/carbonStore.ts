import create from 'zustand'
import { supabase } from '../utils/supabaseClient'
import { subDays, startOfMonth, format } from 'date-fns'

export interface Activity {
  id: string
  user_id: string
  type: string
  description: string
  carbon_kg: number
  metadata: Record<string, unknown>
  algo_tx_id?: string
  algo_hash?: string
  created_at: string
}

interface CarbonState {
  loading: boolean

  // Raw list
  activities: Activity[]

  // Derived metrics
  total: number
  monthTotal: number
  weekTotal: number
  dailyData: { label: string; value: number }[]
  categoryData: Record<string, number>
  recent: Activity[]

  // Fetch & compute everything
  fetchAll: () => Promise<void>
}

interface AddActivityInput {
  type: string
  description: string
  carbon_kg: number
  metadata: Record<string, unknown>
}

export const useCarbonStore = create<CarbonState & {
  addActivity: (activity: AddActivityInput) => Promise<void>
  fetchActivities: () => Promise<void>
}>((set, get) => ({
  loading: false,
  activities: [],

  total: 0,
  monthTotal: 0,
  weekTotal: 0,
  dailyData: [],
  categoryData: {},
  recent: [],

  fetchAll: async () => {
    set({ loading: true })

    // 1) Get current user
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser()
    if (userErr || !user) {
      console.error('Not signed in')
      set({ loading: false })
      return
    }

    // 2) Fetch activities
    const { data: acts, error: fetchErr } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (fetchErr || !acts) {
      console.error('Failed to load activities', fetchErr)
      set({ loading: false })
      return
    }

    // 3) Compute totals
    const total = acts.reduce((sum, a) => sum + a.carbon_kg, 0)

    const now = new Date()
    const monthStart = startOfMonth(now)
    const weekStart = subDays(now, 6)

    const monthTotal = acts
      .filter((a) => new Date(a.created_at) >= monthStart)
      .reduce((sum, a) => sum + a.carbon_kg, 0)

    const weekTotal = acts
      .filter((a) => new Date(a.created_at) >= weekStart)
      .reduce((sum, a) => sum + a.carbon_kg, 0)

    // 4) Build daily time-series (last 7 days)
    const dailyData = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(now, 6 - i)
      const label = format(d, 'MMM d')
      const value = acts
        .filter((a) => format(new Date(a.created_at), 'MMM d') === label)
        .reduce((sum, a) => sum + a.carbon_kg, 0)
      return { label, value }
    })

    // 5) Sum by category
    const categoryData = acts.reduce((acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + a.carbon_kg
      return acc
    }, {} as Record<string, number>)

    // 6) Take the 5 most recent
    const recent = acts.slice(0, 5)

    // 7) Commit to state
    set({
      loading: false,
      activities: acts,
      total,
      monthTotal,
      weekTotal,
      dailyData,
      categoryData,
      recent,
    })
  },

  addActivity: async (activity) => {
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser()
    if (userErr || !user) {
      console.error('Not signed in')
      return
    }

    const { error: insertErr } = await supabase.from('activities').insert({
      ...activity,
      user_id: user.id,
    })
    if (insertErr) {
      console.error('Failed to add activity', insertErr)
      return
    }

    // Refresh activities after adding
    await get().fetchAll()
  },

  fetchActivities: async () => {
    set({ loading: true })

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser()
    if (userErr || !user) {
      console.error('Not signed in')
      set({ loading: false })
      return
    }

    const { data: acts, error: fetchErr } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (fetchErr || !acts) {
      console.error('Failed to load activities', fetchErr)
      set({ loading: false })
      return
    }

    set({ activities: acts, loading: false })
  },
}))
