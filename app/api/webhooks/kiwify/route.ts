import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    // Não quebra build/preview: só roda se env existir
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { ok: false, error: "Supabase env vars missing" },
        { status: 200 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const body = await req.json().catch(() => ({}))

    // TODO: implemente sua lógica real aqui
    // Exemplo (placeholder):
    await supabase.from("webhooks").insert([
      { provider: "kiwify", payload: body }
    ])

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 200 }
    )
  }
}
