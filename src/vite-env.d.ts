/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_PATH?: string
  /** JSON object of FormValues keys → strings; set in CI or .env.local, not in git */
  readonly VITE_PREFILL_JSON?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
