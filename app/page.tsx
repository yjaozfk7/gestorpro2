"use client"

import * as React from "react"
import { createClient } from "@supabase/supabase-js"

export default function Page() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [ok, setOk] = React.useState<string | null>(null)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = React.useMemo(() => {
    if (!supabaseUrl || !supabaseAnonKey) return null
    return createClient(supabaseUrl, supabaseAnonKey)
  }, [supabaseUrl, supabaseAnonKey])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setOk(null)

    if (!supabase) {
      setError("Supabase não configurado (faltam variáveis de ambiente).")
      return
    }

    if (!email || !password) {
      setError("Preencha e-mail e senha.")
      return
    }

    setLoading(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      setOk("Login OK! Redirecionando...")
      // ✅ TROQUE AQUI se a rota real do seu app for outra
      window.location.href = "/exemplo-planos"
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f5f7ff",
        padding: 24,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 980,
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 28,
          alignItems: "center",
        }}
      >
        <div style={{ padding: 16 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#ffffff",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              marginBottom: 18,
            }}
          >
            <span style={{ fontWeight: 800, color: "#1f3fff" }}>GP</span>
          </div>

          <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.1, color: "#0f172a" }}>
            GestorPro
          </h1>
          <p style={{ marginTop: 10, marginBottom: 0, color: "#475569", fontSize: 16 }}>
            Gerencie seu negócio de forma simples e eficiente.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 22,
            padding: 28,
            boxShadow: "0 20px 70px rgba(15, 23, 42, 0.12)",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 26, color: "#0f172a" }}>Entrar</h2>
          <p style={{ marginTop: 6, color: "#64748b" }}>Entre com seu e-mail e senha</p>

          {!supabase && (
            <div
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 12,
                background: "#fff7ed",
                color: "#9a3412",
                fontSize: 14,
              }}
            >
              Faltam as variáveis <b>NEXT_PUBLIC_SUPABASE_URL</b> e/ou{" "}
              <b>NEXT_PUBLIC_SUPABASE_ANON_KEY</b> na Vercel.
            </div>
          )}

          {error && (
            <div
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 12,
                background: "#fef2f2",
                color: "#991b1b",
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          {ok && (
            <div
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 12,
                background: "#ecfdf5",
                color: "#065f46",
                fontSize: 14,
              }}
            >
              {ok}
            </div>
          )}

          <form onSubmit={onSubmit} style={{ marginTop: 18, display: "grid", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 14, color: "#334155" }}>E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
                style={{
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  padding: "0 14px",
                  outline: "none",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 14, color: "#334155" }}>Senha</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  padding: "0 14px",
                  outline: "none",
                }}
              />
            </label>

            <button
              type="submit"
              disabled={loading || !supabase}
              style={{
                height: 46,
                borderRadius: 12,
                border: "none",
                background: !supabase ? "#94a3b8" : "#1f3fff",
                color: "#fff",
                fontWeight: 700,
                cursor: loading || !supabase ? "not-allowed" : "pointer",
                marginTop: 6,
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div style={{ marginTop: 6, textAlign: "center", color: "#1f3fff" }}>
              Não tem uma conta? <span style={{ color: "#94a3b8" }}>(cadastro depois)</span>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
