import { supabase } from './supabase'
import type { Profile } from './supabase-types'

// Tipo para perfil de negócio
export interface BusinessProfile {
  id?: string
  user_id: string
  business_name: string
  business_type: 'comercio_local' | 'ecommerce' | 'servicos' | 'infoprodutor' | 'restaurante' | 'agencia' | 'autonomo' | 'outro'
  created_at?: string
  updated_at?: string
}

// ====== PERFIL DE USUÁRIO ======

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Erro ao buscar perfil:', error)
    return null
  }

  return data
}

export async function createProfile(profile: Omit<Profile, 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Upsert (criar ou atualizar) perfil do usuário
 */
export async function upsertProfile(profile: Omit<Profile, 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      ...profile,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// ====== PERFIL DE NEGÓCIO ======

/**
 * Buscar perfil de negócio do usuário
 */
export async function getBusinessProfile(userId: string): Promise<BusinessProfile | null> {
  const { data, error } = await supabase
    .from('business_profile')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar perfil de negócio:', error)
    return null
  }

  return data
}

/**
 * Criar perfil de negócio
 */
export async function createBusinessProfile(profile: Omit<BusinessProfile, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('business_profile')
    .insert([profile])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Atualizar perfil de negócio
 */
export async function updateBusinessProfile(userId: string, updates: Partial<Omit<BusinessProfile, 'id' | 'user_id'>>) {
  const { data, error } = await supabase
    .from('business_profile')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Upsert (criar ou atualizar) perfil de negócio
 */
export async function upsertBusinessProfile(profile: Omit<BusinessProfile, 'id' | 'created_at' | 'updated_at'>) {
  // Verificar se já existe
  const existing = await getBusinessProfile(profile.user_id)

  if (existing) {
    return updateBusinessProfile(profile.user_id, {
      business_name: profile.business_name,
      business_type: profile.business_type,
    })
  } else {
    return createBusinessProfile(profile)
  }
}

/**
 * Verificar se usuário já completou o onboarding
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  try {
    const userProfile = await getProfile(userId)
    const businessProfile = await getBusinessProfile(userId)

    return !!(userProfile && businessProfile)
  } catch {
    return false
  }
}

/**
 * Buscar perfis completos (usuário + negócio)
 */
export async function getCompleteProfile(userId: string) {
  const userProfile = await getProfile(userId)
  const businessProfile = await getBusinessProfile(userId)

  return {
    user: userProfile,
    business: businessProfile,
  }
}