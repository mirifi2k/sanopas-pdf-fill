import type { FormValues } from '../types/form'

const FORM_VALUE_KEYS: (keyof FormValues)[] = [
  'name',
  'cnp',
  'ca',
  'address',
  'phone',
  'email',
  'iban',
  'bank',
  'bank_branch',
  'owner',
  'ocnp',
  'clinic_0',
  'medic_0',
  'specialty_0',
  'date',
]

function prefillFromEnv(): Partial<FormValues> {
  const raw = import.meta.env.VITE_PREFILL_JSON
  if (!raw?.trim()) return {}

  try {
    const parsed: unknown = JSON.parse(raw)
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      console.warn('VITE_PREFILL_JSON must be a JSON object; ignoring prefill.')
      return {}
    }

    const record = parsed as Record<string, unknown>
    const result: Partial<FormValues> = {}
    for (const key of FORM_VALUE_KEYS) {
      const value = record[key]
      if (typeof value === 'string' && value.length > 0) {
        result[key] = value
      }
    }
    return result
  } catch {
    console.warn('VITE_PREFILL_JSON is not valid JSON; ignoring prefill.')
    return {}
  }
}

/**
 * Defaults applied on load. Values come from VITE_PREFILL_JSON at build time (GitHub Actions
 * secret or local .env.local), not from committed source — so personal data stays out of git.
 * Split fields (CNP, CA, IBAN, OCNP) use full strings; they are split into segments on export.
 */
export const prefilledDefaults: Partial<FormValues> = prefillFromEnv()
