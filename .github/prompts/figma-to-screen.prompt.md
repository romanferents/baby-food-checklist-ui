---
description: "Convert a Figma design into a React Native screen using the Figma MCP server. Provide a Figma URL and get a production-ready Expo Router screen."
agent: "agent"
tools: ["figma/*", "read", "edit", "search"]
model: ["Claude Sonnet 4 (copilot)", "GPT-4.1 (copilot)"]
---

# Figma → React Native Screen

Convert the provided Figma design into a production-ready React Native screen for this Expo project.

## Steps

1. **Extract design** — Use `#tool:mcp_com_figma_mcp_get_design_context` with the Figma URL to retrieve the design structure, tokens, and screenshot
2. **Map tokens** — Translate Figma colors to `src/theme/colors.ts` tokens; map spacing to `src/theme/spacing.ts`
3. **Build the screen** — Create an Expo Router screen in `app/` using React Native Paper components
4. **Add translations** — Add all user-visible strings to both `src/i18n/locales/uk.json` and `en.json`
5. **Verify** — Confirm the screen follows project conventions from `copilot-instructions.md`

## Constraints

- Use ONLY React Native Paper components (`Surface`, `Text`, `Chip`, `Card`, etc.)
- Colors from `useTheme().colors` — never hardcoded hex
- Spacing from `spacing.ts` scale — never magic numbers
- Every string through `t()` — Ukrainian first, then English
- TypeScript strict mode — no `any`

## Figma URL

{{input}}
