/**
 * Dev helper: creates public/form.pdf with AcroForm text fields matching expected names.
 * Replace this file with your real PDF before production deploy.
 */
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '../public/form.pdf')

const fieldNames = [
  'name',
  'address',
  'phone',
  'email',
  'bank',
  'bank_branch',
  'owner',
  'clinic_0',
  'medic_0',
  'specialty_0',
  'date',
  ...Array.from({ length: 13 }, (_, i) => `cnp_${i}`),
  ...Array.from({ length: 13 }, (_, i) => `ca_${i}`),
  ...Array.from({ length: 24 }, (_, i) => `iban_${i}`),
  ...Array.from({ length: 13 }, (_, i) => `ocnp_${i}`),
]

const pdfDoc = await PDFDocument.create()
const page = pdfDoc.addPage([595, 842])
const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
const form = pdfDoc.getForm()

page.drawText('Placeholder PDF — replace with your form.pdf', { x: 50, y: 800, size: 12, font })

let y = 770
for (const name of fieldNames) {
  if (y < 80) {
    y = 770
    pdfDoc.addPage([595, 842])
  }
  const field = form.createTextField(name)
  field.setText('')
  field.addToPage(page, { x: 50, y, width: 200, height: 14 })
  page.drawText(name, { x: 260, y: y + 2, size: 8, font })
  y -= 18
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, await pdfDoc.save())
console.log(`Wrote ${outPath} with ${fieldNames.length} fields.`)
