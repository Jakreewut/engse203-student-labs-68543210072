import { defineConfig } from "vite";

const repositoryName = "engse203-student-labs-68543210072";

export default defineConfig({
  base: './', // 👈 แก้บรรทัดนี้เป็น './' ได้เลยครับ
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});