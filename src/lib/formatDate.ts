import { format, isValid, parseISO } from 'date-fns'

export function formatDateForPdf(isoDate: string): string {
  if (!isoDate) return ''
  const parsed = parseISO(isoDate)
  return isValid(parsed) ? format(parsed, 'dd.MM.yyyy') : isoDate
}
