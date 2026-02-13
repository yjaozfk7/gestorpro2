"use client"

import { ReactNode } from "react"
import { Lock } from "lucide-react"
import { useUserPlan } from "@/hooks/useUserPlan"

type Props = {
  children: ReactNode
  feature?: string
  requiredPlan?: string
}

export default function FeatureGate({
  children,
  feature,
  requiredPlan,
}: Props) {
  const { plan, loading } = useUserPlan()

  if (loading) {
    return <>{children}</>
  }

  // Regras simples (para não quebrar build):
  // - Se não exigir plano/feature, libera
  if (!feature && !requiredPlan) return <>{children}</>

  // Se exigir "pro/premium", libera apenas se o plano bater
  const normalizedPlan = String(plan || "").toLowerCase()
  const normalizedRequired = String(requiredPlan || "").toLowerCase()

  const hasAccess =
    !normalizedRequired ||
    normalizedPlan === normalizedRequired ||
    (normalizedRequired === "pro" && (normalizedPlan === "pro" || normalizedPlan === "premium")) ||
    (normalizedRequired === "premium" && normalizedPlan === "premium")

  if (hasAccess) return <>{children}</>

  return (
    <div className="p-6 rounded-2xl border bg-white dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-xl border dark:border-zinc-800">
          <Lock className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold">Recurso bloqueado</h3>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        {requiredPlan
          ? `Este recurso exige o plano ${requiredPlan}.`
          : "Este recurso exige um plano superior."}
      </p>
    </div>
  )
}
