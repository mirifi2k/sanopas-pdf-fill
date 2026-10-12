export function splitToIndexedFields(
  prefix: string,
  value: string,
  length: number,
): Record<string, string> {
  const normalized = value.replace(/\s/g, '').slice(0, length)
  const out: Record<string, string> = {}
  for (let i = 0; i < length; i += 1) {
    out[`${prefix}_${i}`] = normalized[i] ?? ''
  }
  return out
}

export function formValuesToPdfFields(values: Record<string, string>): Record<string, string> {
  const { cnp, ca, iban, ocnp, ...rest } = values
  return {
    ...rest,
    ...splitToIndexedFields('cnp', cnp, 13),
    ...splitToIndexedFields('ca', ca, 13),
    ...splitToIndexedFields('iban', iban, 24),
    ...splitToIndexedFields('ocnp', ocnp, 13),
  }
}
