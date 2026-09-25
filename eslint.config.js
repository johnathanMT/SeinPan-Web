import js from "@eslint/js";
import globals from "globals";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "public", "coverage"] },

  // All source: accessibility + hooks correctness.
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    extends: [js.configs.recommended, jsxA11y.flatConfigs.recommended],
    plugins: { "react-hooks": reactHooks },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // TypeScript: type-aware rules (floating promises, unsafe any, etc.).
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      "@typescript-eslint/no-confusing-void-expression": ["error", { ignoreArrowShorthand: true }],
    },
  },

  // Legacy /hub JavaScript (quarantined, not type-checked). Plain ESLint cannot
  // see JSX member usage like <motion.div>, so no-unused-vars is left to review.
  {
    files: ["src/features/hub/**/*.jsx"],
    rules: { "no-unused-vars": "off" },
  },

  // Node-side config and scripts.
  {
    files: ["*.{js,mjs}", "scripts/**/*.{js,mjs}"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["vite.config.ts"],
    extends: [tseslint.configs.recommended],
    languageOptions: { globals: globals.node },
  },
);
