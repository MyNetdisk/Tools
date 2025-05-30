import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["src/**/*.{js,jsx,ts,tsx}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["src/**/*.{js,jsx,ts,tsx}"], languageOptions: { globals: globals.browser } },
]);
