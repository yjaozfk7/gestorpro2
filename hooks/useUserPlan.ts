"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"

export type PlanType = "free" | "pro" | "premium"

export type PlanState = {
  plan: PlanType
  loading: boolean
  isLoading: boolean
  refreshPlan: () => Promise<void>
}

const DEFAULT_PLAN: PlanType = "free"

export function hasFeatureAccess(plan: PlanType, featureKey: string) {
  // Ajuste as regras como quiser. Deixei simples:
  if (!featureKey) return true
  if (plan === "premium") return true
  if (plan === "pro") return featureKey !== "premium-only"
  return featureKey === "free"
}

export function useUserPlan(): PlanState {
  const [plan, setPlan] = useState<PlanType>(DEFAULT_PLAN)
  const [loading, setLoading] = useState(true)

  const refreshPlan = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error

      const user = data?.user
      if (!user) {
        setPlan(DEFAULT_PLAN)
        return
      }

      // Se você tiver tabela/perfil no Supabase, troque aqui.
      // Por enquanto, tenta ler do user_metadata:
      const metaPlan = (user.user_metadata?.plan as PlanType | undefined) ?? DEFAULT_PLAN
      setPlan(metaPlan)
    } catch {
      setPlan(DEFAULT_PLAN)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshPlan()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
      refreshPlan()
    })

    return () => subscription.unsubscribe()
  }, [refreshPlan])

  return useMemo(
    () => ({
      plan,
      loading,
      isLoading: loading,
      refreshPlan
    }),
    [plan, loading, refreshPlan]
  )
}
