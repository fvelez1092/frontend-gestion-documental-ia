import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/document": {
        //target: 'https://5tc6z82k-5000.use2.devtunnels.ms',
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
