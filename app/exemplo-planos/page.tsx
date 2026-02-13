"use client"

import { useUserPlan } from "@/hooks/useUserPlan"

export default function ExemploPlanos() {
  const { plan, loading, refreshPlan } = useUserPlan()

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Carregando plano...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Exemplo de Planos</h1>

      <div className="rounded-xl border p-4">
        <p className="text-sm text-muted-foreground">Seu plano atual:</p>
        <p className="text-lg font-bold">{plan}</p>
      </div>

      <button
        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => refreshPlan()}
      >
        Atualizar plano
      </button>
    </div>
  )
}
