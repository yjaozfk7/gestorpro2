// Tipos específicos do Supabase
export interface Profile {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  business_area: string
  revenue: number
  cost: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface ClientRevenueHistory {
  id: string
  client_id: string
  user_id: string
  revenue: number
  cost: number
  date: string
  notes?: string
  created_at: string
}