import { OnboardingProgress } from './types'

const PROGRESS_KEY = 'gestorpro_onboarding_progress'

export function getOnboardingProgress(): OnboardingProgress {
  if (typeof window === 'undefined') {
    return {
      profileComplete: false,
      emailVerified: false,
      phoneAdded: false,
      firstEntry: false,
      firstGoal: false,
      firstTask: false,
      firstEmployee: false,
    }
  }
  const data = localStorage.getItem(PROGRESS_KEY)
  return data ? JSON.parse(data) : {
    profileComplete: false,
    emailVerified: false,
    phoneAdded: false,
    firstEntry: false,
    firstGoal: false,
    firstTask: false,
    firstEmployee: false,
  }
}

export function updateOnboardingProgress(updates: Partial<OnboardingProgress>): void {
  const current = getOnboardingProgress()
  const updated = { ...current, ...updates }
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated))
}

export function getOnboardingCompletion(): number {
  const progress = getOnboardingProgress()
  const completed = Object.values(progress).filter(Boolean).length
  return (completed / 5) * 100 // profileComplete, firstEntry, firstGoal, firstTask, firstEmployee
}