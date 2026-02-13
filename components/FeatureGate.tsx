"use client"

import { ReactNode } from "react"
import { Lock } from "lucide-react"
import { useUserPlan, hasFeatureAccess, type FeatureKey } from "@/hooks/useUserPlan"

type Props = {
  feature: FeatureKey
  children: ReactNode
  title?: string
  description?: string
}

export default function FeatureGate({
  feature,
  children,
  title = "Recurso bloqueado",
  description = "Faça upgrade do seu plano para acessar este recurso."
}: Props) {
  const { plan, loading } = useUserPlan()

  if (loading) return null

  const allowed = hasFeatureAccess(plan, feature)

  if (allowed) return <>{children}</>

  return (
    <div className="rounded-2xl border p-6 bg-white dark:bg-gray-900">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Recurso: <span className="font-mono">{feature}</span> • Plano atual:{" "}
            <span className="font-mono">{plan}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
