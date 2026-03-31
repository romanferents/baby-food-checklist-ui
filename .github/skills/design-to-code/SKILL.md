---
name: design-to-code
description: "End-to-end workflow: Figma design → React Native component → visual QA. Use when implementing a full screen or component from a Figma mockup with verification. Triggers: implement design, Figma to code, design to code, build from Figma, design implementation."
---

# Design-to-Code Pipeline

A multi-stage workflow that converts Figma designs into production-ready React Native components, then verifies the result with visual QA.

## When to Use

- Implementing a new screen from a Figma mockup
- Rebuilding an existing screen to match an updated design
- Creating a component library from Figma components
- Any task that says "build this from the design"

## Pipeline Stages

### Stage 1: Design Extraction

Fetch the design context from Figma:

```
Tool: mcp_com_figma_mcp_get_design_context
Input: { fileKey, nodeId } — extracted from the Figma URL
```

Capture:
- Component tree structure
- Color tokens and their usage
- Spacing between elements
- Typography variants
- Icon references
- Any Code Connect mappings

Also take a screenshot for reference:
```
Tool: mcp_com_figma_mcp_get_screenshot
```

### Stage 2: Token Mapping

Map Figma design tokens to this project's theme system. See [token mapping reference](./references/token-mapping.md) for the complete mapping table.

Key rules:
- Every Figma color must map to a `theme.colors.*` token
- Every spacing value must map to a `spacing.*` constant
- Every text style must map to a Paper `Text` variant
- If no mapping exists, extend the theme — never hardcode

### Stage 3: Component Implementation

Build the component following project patterns. See [component patterns reference](./references/component-patterns.md) for templates.

Checklist:
- [ ] React Native Paper components used (not raw `View`/`Text`)
- [ ] `useTheme()` for all colors
- [ ] `spacing.*` for all margins/padding
- [ ] `t()` for all visible text
- [ ] TypeScript strict types (no `any`)
- [ ] `accessibilityLabel` on all interactive elements
- [ ] `StyleSheet.create()` for static styles

### Stage 4: Translation

Add all user-visible strings to both locale files:
1. `src/i18n/locales/uk.json` — Ukrainian (primary)
2. `src/i18n/locales/en.json` — English (secondary)

### Stage 5: Visual Verification

If the app is running in Chrome, verify the implementation:

```
Tool: mcp_chrome-devtoo_take_screenshot
Tool: mcp_chrome-devtoo_lighthouse_audit (category: accessibility)
```

Compare the screenshot against the Figma design for:
- Layout accuracy
- Color correctness
- Spacing consistency
- Typography match

## Output

Deliver:
1. Component file(s) in the correct directory
2. Updated translation files
3. Token mapping summary
4. Visual comparison (if app running)
5. Accessibility score
