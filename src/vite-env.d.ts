/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Public base URL of the inquiry API (https only in production).
   * Every VITE_* variable is compiled into the public JavaScript bundle —
   * never put secrets here. See SECURITY.md.
   */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
