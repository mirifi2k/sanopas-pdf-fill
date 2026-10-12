import type { FormValues } from '../types/form'

/**
 * Default values applied on load. Add PDF field keys here when you want fields prefilled.
 * Split fields (CNP, CA, IBAN, OCNP) can be set as full strings; they are split into segments on export.
 */
export const prefilledDefaults: Partial<FormValues> = {}
