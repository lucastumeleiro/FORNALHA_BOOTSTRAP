interface ImportMetaEnv {
  // Opcional: o worktree nasce sem .env (AR-05).
  readonly VITE_WHATSAPP_NUMBER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
