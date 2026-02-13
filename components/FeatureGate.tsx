"use client"

import { ReactNode } from "react"
import { Lock } from "lucide-react"
import { useUserPlan, hasFeatureAccess, type FeatureKey } from "@/hooks/useUserPlan"

type Props = {
  feature: FeatureKey
  children: ReactNode
  fallback?: ReactNode
}

export default function FeatureGate({ feature, children, fallback }: Props) {
  const { plan, isLoading } = useUserPlan()

  if (isLoading) return null

  const allowed = hasFeatureAccess(plan, feature)

  if (allowed) return <>{children}</>

  return (
    <>
      {fallback ?? (
        <div className="flex items-center gap-2 rounded-md border p-3 text-sm">
          <Lock className="h-4 w-4" />
          <span>Recurso disponível apenas em planos superiores.</span>
        </div>
      )}
    </>
  )
}
