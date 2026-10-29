import { PDFDocument, StandardFonts, type PDFFont } from 'pdf-lib'
import type { PDFTextField } from 'pdf-lib'
import { formValuesToPdfFields } from './fieldSegments'
import { formatDateForPdf } from './formatDate'
import type { FormValues } from '../types/form'

const PDF_ASSET = `${import.meta.env.BASE_URL}form.pdf`

/** Smaller than default so one character fits IBAN segment boxes in form.pdf */
const IBAN_PDF_FONT_SIZE = 7
/** Furnizor / medic / specialitate — long labels in narrow PDF boxes */
const MEDICAL_SERVICE_PDF_FONT_SIZE = 8

const PDF_FIELD_FONT_SIZES: Record<string, number> = {
  clinic_0: MEDICAL_SERVICE_PDF_FONT_SIZE,
  medic_0: MEDICAL_SERVICE_PDF_FONT_SIZE,
  specialty_0: MEDICAL_SERVICE_PDF_FONT_SIZE,
}

function pdfFontSizeForField(name: string): number | undefined {
  const named = PDF_FIELD_FONT_SIZES[name]
  if (named !== undefined) return named
  if (/^iban_\d+$/.test(name)) return IBAN_PDF_FONT_SIZE
  return undefined
}

function applyPdfFontSize(field: PDFTextField, font: PDFFont, fontSize: number) {
  try {
    field.setFontSize(fontSize)
    return
  } catch {
    // No /DA on field — seed default appearance, then set size (see pdf-lib MissingDAEntryError).
  }
  try {
    field.acroField.setDefaultAppearance(`0 g\n/${font.name} ${fontSize} Tf`)
    field.setFontSize(fontSize)
  } catch {
    // Keep template appearance.
  }
}

function setTextField(
  form: ReturnType<PDFDocument['getForm']>,
  font: PDFFont,
  name: string,
  value: string,
  missing: string[],
) {
  try {
    const field = form.getTextField(name)
    const fontSize = pdfFontSizeForField(name)
    if (fontSize !== undefined) {
      applyPdfFontSize(field, font, fontSize)
    }
    field.setText(value)
  } catch {
    missing.push(name)
  }
}

export async function fillAndDownloadPdf(values: FormValues, fileName = 'form-completat.pdf') {
  const response = await fetch(PDF_ASSET)
  if (!response.ok) {
    throw new Error(
      `Nu am găsit PDF-ul (form.pdf). Copiază fișierul tău în folderul public/ și redeploy.`,
    )
  }

  const pdfBytes = await response.arrayBuffer()
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const form = pdfDoc.getForm()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fieldMap = formValuesToPdfFields({
    ...values,
    date: formatDateForPdf(values.date),
  } as unknown as Record<string, string>)
  const missing: string[] = []

  for (const [name, value] of Object.entries(fieldMap)) {
    setTextField(form, font, name, value ?? '', missing)
  }

  if (missing.length > 0) {
    console.warn('Câmpuri PDF lipsă sau cu nume diferit:', missing)
  }

  form.updateFieldAppearances(font)
  const filled = await pdfDoc.save()
  const blob = new Blob([new Uint8Array(filled)], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)

  return { missingFields: missing }
}
