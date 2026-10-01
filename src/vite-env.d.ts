/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_FILE_URL: string;
  readonly VITE_DEFAULTAUTH: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_COMPANYLOGO: string;
  readonly VITE_PROFILEIMAGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
