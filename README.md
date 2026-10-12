# PDF form filler (GitHub Pages)

Frontend-only React app that fills AcroForm fields in a PDF entirely in the browser. Built with Vite, React Hook Form, and [pdf-lib](https://pdf-lib.js.org/).

## PDF setup

1. Copy your prepared PDF to **`public/form.pdf`**.
2. Field names in the PDF must match the mapping used by the app (see `src/lib/fieldSegments.ts` and the form in `src/components/PdfForm.tsx`).

For local testing without your PDF yet:

```bash
npm run generate-pdf
```

That writes a placeholder `public/form.pdf` with all expected field names.

## Prefilled values

Edit **`src/config/prefill.ts`** and set any fields you want filled by default (you can use full strings for CNP, cod angajat, IBAN, and CNP titular — they are split into `*_0`, `*_1`, … on export).

## Develop

```bash
npm install
npm run dev
```

Dev server uses port **4317** (see `package.json`).

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In the repository **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main` — the workflow `.github/workflows/deploy-pages.yml` builds with `VITE_BASE_PATH=/<repo-name>/` and deploys `dist`.

For a user/organization site (`username.github.io` with no project subpath), change the build env in the workflow to `VITE_BASE_PATH: /` or build locally with:

```bash
VITE_BASE_PATH=/ npm run build
```

## Field mapping (display → PDF)

| UI label | PDF field(s) |
|----------|----------------|
| Nume | `name` |
| CNP | `cnp_0` … `cnp_12` |
| Cod angajat | `ca_0` … `ca_12` |
| Adresă | `address` |
| Telefon | `phone` |
| E-mail | `email` |
| IBAN | `iban_0` … `iban_23` |
| Deschis la banca | `bank` |
| Sucursala bancii | `bank_branch` |
| Titular cont | `owner` |
| CNP titular cont | `ocnp_0` … `ocnp_12` |
| Furnizor (clinică) | `clinic_0` |
| Medic | `medic_0` |
| Specialitate | `specialty_0` |
| Data | `date` (formatted `dd.MM.yyyy` in the PDF) |
