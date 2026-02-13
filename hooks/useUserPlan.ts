"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { createClient, type User } from "@supabase/supabase-js"

export type PlanType = "free" | "pro" | "premium"
export type FeatureKey = string

type HookReturn = {
  plan: PlanType
  loading: boolean
  refreshPlan: () => Promise<void>
}

function safeCreateSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

/**
 * Regras simples (ajuste depois como quiser):
 * - free: só o básico
 * - pro: libera tudo exceto recursos "premium"
 * - premium: libera tudo
 */
export function hasFeatureAccess(plan: PlanType, feature: FeatureKey) {
  if (plan === "premium") return true
  if (plan === "pro") return !feature.toLowerCase().includes("premium")
  return false
}

export function useUserPlan(): HookReturn {
  const supabase = useMemo(() => safeCreateSupabase(), [])
  const [plan, setPlan] = useState<PlanType>("free")
  const [loading, setLoading] = useState<boolean>(true)

  const load = useCallback(async () => {
    try {
      setLoading(true)

      // Sem supabase configurado -> não quebra build/preview, assume free
      if (!supabase) {
        setPlan("free")
        return
      }

      const { data } = await supabase.auth.getUser()
      const user: User | null = data?.user ?? null

      // Sem usuário logado -> free
      if (!user) {
        setPlan("free")
        return
      }

      // Aqui você pode trocar para buscar o plano no seu DB.
      // Por enquanto: tenta ler do metadata do usuário (opcional)
      const metaPlan = (user.user_metadata?.plan as PlanType | undefined) ?? "free"
      setPlan(metaPlan)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    load()
  }, [load])

  return {
    plan,
    loading,
    refreshPlan: load
  }
}
