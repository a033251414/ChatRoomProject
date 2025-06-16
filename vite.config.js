import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/ChatRoomProject/",
  plugins: [react()],

  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.message.includes("PURE")) return;
        warn(warning);
      },
    },
  },
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });
