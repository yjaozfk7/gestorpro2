-- =====================================================
-- Configuração de Autenticação
-- =====================================================

-- Nota: A confirmação de e-mail será desabilitada via Dashboard ou CLI
-- Esta migration foca apenas na criação das tabelas de perfil

-- =====================================================
-- Tabela de Perfis de Usuário
-- =====================================================

-- Criar tabela profiles (dados pessoais do usuário)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: usuário só pode ver/editar seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- Tabela de Perfis de Negócio
-- =====================================================

-- Criar tabela business_profile (dados do negócio)
CREATE TABLE IF NOT EXISTS public.business_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL CHECK (
    business_type IN (
      'comercio_local',
      'ecommerce',
      'servicos',
      'infoprodutor',
      'restaurante',
      'agencia',
      'autonomo',
      'outro'
    )
  ),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE public.business_profile ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: usuário só pode ver/editar seu próprio negócio
CREATE POLICY "Usuários podem ver seu próprio negócio"
  ON public.business_profile
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seu próprio negócio"
  ON public.business_profile
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio negócio"
  ON public.business_profile
  FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- Função para criar perfil automaticamente após signup
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir perfil básico (será completado no onboarding)
  INSERT INTO public.profiles (id, name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- Índices para performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_business_profile_user_id ON public.business_profile(user_id);

-- =====================================================
-- Comentários para documentação
-- =====================================================

COMMENT ON TABLE public.profiles IS 'Perfil pessoal do usuário - nome e dados básicos';
COMMENT ON TABLE public.business_profile IS 'Perfil do negócio do usuário - nome e tipo de negócio';
COMMENT ON COLUMN public.business_profile.business_type IS 'Tipo de negócio: comercio_local, ecommerce, servicos, infoprodutor, restaurante, agencia, autonomo, outro';