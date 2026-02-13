"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type PlanType = "free" | "pro" | "premium"

export function useUserPlan() {
  const [plan, setPlan] = useState<PlanType>("free")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserPlan = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        setPlan("free")
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single()

      if (profile?.plan) {
        setPlan(profile.plan as PlanType)
      } else {
        setPlan("free")
      }

      setLoading(false)
    }

    fetchUserPlan()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchUserPlan()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { plan, loading }
}
