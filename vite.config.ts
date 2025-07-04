import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    base: isProduction ? "/byteshutter/" : "/",
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
    },
  };
});
