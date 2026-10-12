import { PDFDocument } from 'pdf-lib'
import { formValuesToPdfFields } from './fieldSegments'
import { formatDateForPdf } from './formatDate'
import type { FormValues } from '../types/form'

const PDF_ASSET = `${import.meta.env.BASE_URL}form.pdf`

function setTextField(
  form: ReturnType<PDFDocument['getForm']>,
  name: string,
  value: string,
  missing: string[],
) {
  try {
    const field = form.getTextField(name)
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
  const fieldMap = formValuesToPdfFields({
    ...values,
    date: formatDateForPdf(values.date),
  } as unknown as Record<string, string>)
  const missing: string[] = []

  for (const [name, value] of Object.entries(fieldMap)) {
    setTextField(form, name, value ?? '', missing)
  }

  if (missing.length > 0) {
    console.warn('Câmpuri PDF lipsă sau cu nume diferit:', missing)
  }

  form.updateFieldAppearances()
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
