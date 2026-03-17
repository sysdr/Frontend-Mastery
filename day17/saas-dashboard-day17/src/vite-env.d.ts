/* Stub types so the project type-checks without node_modules (no dependency on vite package). */

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string;
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.css' {
  const src: string;
  export default src;
}
