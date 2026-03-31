---
description: "Take a screenshot of the running app in Chrome and perform visual QA against the Figma design or accessibility standards."
agent: "agent"
tools: ["chrome-devtools/*", "figma/*", "read", "search"]
model: ["Claude Sonnet 4 (copilot)", "GPT-4.1 (copilot)"]
---

# Visual QA — Chrome DevTools + Figma

Perform a visual quality assurance check on the running app using Chrome DevTools MCP.

## Steps

1. **Capture screenshot** — Use `#tool:mcp_chrome-devtoo_take_screenshot` to capture the current app state in Chrome
2. **Compare with Figma** (if URL provided) — Use `#tool:mcp_com_figma_mcp_get_screenshot` to get the design reference and compare layout, spacing, colors
3. **Accessibility audit** — Run `#tool:mcp_chrome-devtoo_lighthouse_audit` to check a11y scores
4. **Report findings** — Produce a structured QA report

## QA Checklist

### Layout
- [ ] Component spacing matches design
- [ ] Typography hierarchy is correct
- [ ] Touch targets are at least 44x44pt

### Theme
- [ ] Colors match the MD3 theme tokens
- [ ] Dark mode renders correctly (if applicable)
- [ ] Elevation and shadows are consistent

### Accessibility
- [ ] Lighthouse a11y score ≥ 90
- [ ] All interactive elements have labels
- [ ] Color contrast meets WCAG AA

### i18n
- [ ] No hardcoded text visible
- [ ] Ukrainian text renders correctly (Cyrillic characters)
- [ ] Layout doesn't break with longer translations

## Output

Provide a markdown report with:
- Screenshot comparison (if Figma URL provided)
- Pass/fail for each checklist item
- Specific code fixes for any failures
