'use client'

import { useState } from 'react'
import { TrendingUp, User, Briefcase } from 'lucide-react'

interface OnboardingFormProps {
  initialEmail?: string
  onComplete: (data: OnboardingData) => void
}

export interface OnboardingData {
  name: string
  businessName: string
  businessType: 'comercio_local' | 'ecommerce' | 'servicos' | 'infoprodutor' | 'restaurante' | 'agencia' | 'autonomo' | 'outro'
}

export function OnboardingForm({ initialEmail, onComplete }: OnboardingFormProps) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState<OnboardingData['businessType']>('comercio_local')

  const handleNext = () => {
    if (step === 1 && name.trim()) {
      setStep(2)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && businessName.trim()) {
      onComplete({
        name,
        businessName,
        businessType,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-4">
            <img
              src="https://pub-c0bfb119504542e0b2e6ebc8f6b3b1df.r2.dev/user-uploads/user_36GLcQ2SgD8xGWch0nB6jyXkXpi/d6db80a0-b3c7-42cf-a34d-f91416fff23b.png"
              alt="GestorPro Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Bem-vindo ao GestorPro!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vamos configurar sua conta em apenas 2 passos
          </p>

          {/* Indicador de progresso */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`w-8 h-2 rounded-full transition-colors ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
            <div className={`w-8 h-2 rounded-full transition-colors ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
          </div>
        </div>

        {step === 1 ? (
          // Passo 1: Nome da pessoa
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4" />
                Qual é o seu nome? *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome completo"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                autoFocus
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Este é o seu nome pessoal
              </p>
            </div>

            {initialEmail && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  E-mail: <strong>{initialEmail}</strong>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </form>
        ) : (
          // Passo 2: Dados do negócio
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Briefcase className="w-4 h-4" />
                Nome do seu negócio *
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: Loja do João, Maria Serviços..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de negócio *
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as OnboardingData['businessType'])}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="comercio_local">Comércio local (loja física)</option>
                <option value="ecommerce">E-commerce / negócio online</option>
                <option value="servicos">Prestador de serviços</option>
                <option value="infoprodutor">Infoprodutor</option>
                <option value="restaurante">Restaurante / alimentação</option>
                <option value="agencia">Agência / marketing</option>
                <option value="autonomo">Autônomo / profissional liberal</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={!businessName.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Começar a usar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}