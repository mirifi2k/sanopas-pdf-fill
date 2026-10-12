import { PdfForm } from './components/PdfForm'
import './App.css'

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="app-eyebrow">Formular PDF</p>
        <h1>Completează câmpurile și descarcă PDF-ul</h1>
        <p className="app-lead">
          Datele sunt completate local în browser; nu se trimite nimic pe server. Plasează fișierul tău PDF
          AcroForm ca <code>public/form.pdf</code> înainte de deploy.
        </p>
      </header>
      <main>
        <PdfForm />
      </main>
    </div>
  )
}
