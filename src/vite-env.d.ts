/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VERCEL_AI_GATEWAY_API_KEY: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}