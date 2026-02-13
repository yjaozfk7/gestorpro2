"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"

/**
 * Ajuste os nomes se o seu app usa outros planos.
 */
export type PlanType = "FREE" | "PRO" | "PREMIUM"

/**
 * FeatureKey precisa existir (exportado) porque o FeatureGate.tsx importa esse type.
 * Se você tiver mais features, adicione aqui.
 */
export type FeatureKey =
  | "tasks"
  | "transactions"
  | "goals"
  | "employees"
  | "reports"
  | "export"
  | "integrations"
  | "unlimited_items"

/**
 * Mapa simples de features por plano.
 * Ajuste conforme seu produto.
 */
const PLAN_FEATURES: Record<PlanType, FeatureKey[]> = {
  FREE: ["tasks", "transactions"],
  PRO: ["tasks", "transactions", "goals", "employees", "export"],
  PREMIUM: [
    "tasks",
    "transactions",
    "goals",
    "employees",
    "reports",
    "export",
    "integrations",
    "unlimited_items",
  ],
}

/**
 * Função usada pelo FeatureGate.tsx
 */
export function hasFeatureAccess(plan: PlanType, feature: FeatureKey) {
  return PLAN_FEATURES[plan]?.includes(feature) ?? false
}

/**
 * Hook principal usado nas páginas.
 * Ele expõe: plan, loading, isLoading e refreshPlan (pra cobrir seus usos antigos).
 */
export function useUserPlan() {
  const [plan, setPlan] = useState<PlanType>("FREE")
  const [loading, setLoading] = useState(true)

  const refreshPlan = useCallback(async () => {
    setLoading(true)

    try {
      // ✅ forma correta: await, sem .then
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error

      const user = data?.user ?? null
      if (!user) {
        setPlan("FREE")
        return
      }

      // 1) tenta pegar do metadata (comum em apps)
      const metaPlan =
        (user.user_metadata?.plan as PlanType | undefined) ??
        (user.app_metadata?.plan as PlanType | undefined)

      if (metaPlan === "FREE" || metaPlan === "PRO" || metaPlan === "PREMIUM") {
        setPlan(metaPlan)
        return
      }

      // 2) fallback: se você tiver uma tabela profiles com "plan", tente buscar
      // (se não existir essa tabela/coluna, o catch abaixo evita quebrar build)
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .maybeSingle()

        const dbPlan = profile?.plan as PlanType | undefined
        if (dbPlan === "FREE" || dbPlan === "PRO" || dbPlan === "PREMIUM") {
          setPlan(dbPlan)
          return
        }
      } catch {
        // ignora, não quebra build
      }

      // 3) último fallback
      setPlan("FREE")
    } catch {
      setPlan("FREE")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshPlan()
  }, [refreshPlan])

  const features = useMemo(() => PLAN_FEATURES[plan] ?? [], [plan])

  return {
    plan,
    features,
    loading,
    isLoading: loading, // ✅ compatibilidade com seu código antigo
    refreshPlan,
  }
}
