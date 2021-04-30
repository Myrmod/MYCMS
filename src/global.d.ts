/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_DB_PORT: string;
  VITE_DB_NAME: string;
  VITE_DB_USERNAME: string;
  VITE_DB_PASSWORD: string;
  VITE_DB_URL: string;
}