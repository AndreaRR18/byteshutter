import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    base: "/byteshutter/",
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      globals: true,
      types: ["@testing-library/jest-dom"],
    },
  };
});
