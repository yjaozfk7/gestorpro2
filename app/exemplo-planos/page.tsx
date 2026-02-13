"use client"

import { useUserPlan } from "@/hooks/useUserPlan"

export default function ExemploPlanos() {
  const { plan, loading } = useUserPlan()

  if (loading) {
    return (
      <div className="p-10 text-center text-lg">
        Carregando plano...
      </div>
    )
  }

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">Plano do Usuário</h1>

      <div className="p-6 rounded-xl border shadow-sm">
        <p className="text-lg">
          Seu plano atual é:{" "}
          <span className="font-semibold capitalize">
            {plan}
          </span>
        </p>
      </div>
    </div>
  )
}
