"use client"

import * as React from "react"
import { createClient } from "@supabase/supabase-js"

export default function Page() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [mode, setMode] = React.useState<"login" | "signup">("login")
  const [message, setMessage] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = React.useMemo(() => {
    if (!supabaseUrl || !supabaseAnonKey) return null
    return createClient(supabaseUrl, supabaseAnonKey)
  }, [supabaseUrl, supabaseAnonKey])

  // ✅ TROQUE AQUI se a rota real do app for outra
  const redirectTo = "/exemplo-planos"

  function resetAlerts() {
    setError(null)
    setMessage(null)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    resetAlerts()

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

      setMessage("Login OK! Redirecionando...")
      window.location.href = redirectTo
    } finally {
      setLoading(false)
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    resetAlerts()

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
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      // Se o Supabase exigir confirmação por e-mail:
      if (!data.session) {
        setMessage("Conta criada! Verifique seu e-mail para confirmar o cadastro.")
        setMode("login")
        return
      }

      // Se criar e já logar:
      setMessage("Conta criada e login OK! Redirecionando...")
      window.location.href = redirectTo
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = mode === "login" ? handleLogin : handleSignup
  const title = mode === "login" ? "Entrar" : "Criar conta"
  const subtitle =
    mode === "login" ? "Entre com seu e-mail e senha" : "Cadastre seu e-mail e senha"

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
        {/* LADO ESQUERDO */}
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
              overflow: "hidden",
            }}
          >
            {/* ✅ Tenta usar um logo do /public. Se não existir, fica o fallback "GP". */}
            {/* Se você tiver um arquivo, deixe exatamente como: /public/logo.png */}
            <img
              src="/logo.png"
              alt="GestorPro"
              style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10 }}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = "none"
                const parent = (e.currentTarget as HTMLImageElement).parentElement
                if (parent) {
                  parent.innerHTML =
                    '<span style="font-weight:800;color:#1f3fff">GP</span>'
                }
              }}
            />
          </div>

          <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.1, color: "#0f172a" }}>
            GestorPro
          </h1>
          <p style={{ marginTop: 10, marginBottom: 0, color: "#475569", fontSize: 16 }}>
            Gerencie seu negócio de forma simples e eficiente.
          </p>
        </div>

        {/* LADO DIREITO */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 22,
            padding: 28,
            boxShadow: "0 20px 70px rgba(15, 23, 42, 0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 26, color: "#0f172a" }}>{title}</h2>
              <p style={{ marginTop: 6, color: "#64748b" }}>{subtitle}</p>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  resetAlerts()
                  setMode("login")
                }}
                style={{
                  height: 34,
                  padding: "0 10px",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  background: mode === "login" ? "#eef2ff" : "#fff",
                  color: "#1f3fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAlerts()
                  setMode("signup")
                }}
                style={{
                  height: 34,
                  padding: "0 10px",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  background: mode === "signup" ? "#eef2ff" : "#fff",
                  color: "#1f3fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cadastro
              </button>
            </div>
          </div>

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

          {message && (
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
              {message}
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
                autoComplete={mode === "login" ? "current-password" : "new-password"}
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
              {loading
                ? mode === "login"
                  ? "Entrando..."
                  : "Criando conta..."
                : mode === "login"
                ? "Entrar"
                : "Criar conta"}
            </button>

            <div style={{ marginTop: 6, textAlign: "center" }}>
              {mode === "login" ? (
                <button
                  type="button"
                  onClick={() => {
                    resetAlerts()
                    setMode("signup")
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#1f3fff",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Não tem uma conta? Cadastre-se
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    resetAlerts()
                    setMode("login")
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#1f3fff",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Já tem conta? Voltar para login
                </button>
              )}
            </div>
          </form>

          <div style={{ marginTop: 14, fontSize: 12, color: "#94a3b8" }}>
            Dica: se o Supabase estiver exigindo confirmação por e-mail, após cadastrar você precisa
            confirmar no e-mail antes de conseguir entrar.
          </div>
        </div>
      </div>
    </main>
  )
}
