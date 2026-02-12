import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

// Cadastro com e-mail e senha (sem verificação de e-mail)
export async function signUpWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: undefined,
      data: {
        email_confirm: true, // Sinalizar que não precisa confirmar
      },
    },
  })

  if (error) throw error

  // Se o usuário foi criado mas precisa confirmar e-mail, avisar
  if (data.user && !data.session) {
    throw new Error('Seu cadastro foi criado, mas o e-mail precisa ser confirmado. Por favor, configure o Supabase para desabilitar a confirmação de e-mail no Dashboard.')
  }

  return data
}

// Login com e-mail e senha
export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Listener para mudanças de autenticação
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
}