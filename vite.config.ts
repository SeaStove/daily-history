import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { qrcode } from "vite-plugin-qrcode";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // The QR code is cool but doesnt work with WSL2
    // qrcode()
  ],
  base: "/",
});
