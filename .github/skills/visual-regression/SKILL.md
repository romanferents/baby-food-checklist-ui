---
name: visual-regression
description: "Capture app screenshots, run Lighthouse audits, and detect visual regressions using Chrome DevTools MCP. Use when verifying UI changes, checking for visual regressions, running a11y audits on the running app, or comparing before/after screenshots. Triggers: visual regression, screenshot test, UI verification, lighthouse, check app."
---

# Visual Regression Testing

Automated visual verification workflow using Chrome DevTools MCP to capture, audit, and compare the running app.

## When to Use

- After implementing UI changes — verify they render correctly
- Before a PR — capture a visual baseline
- Accessibility auditing — run Lighthouse on the live app
- Debugging layout issues — inspect the live DOM

## Prerequisites

- App must be running in Chrome via `expo start --web`
- Chrome DevTools MCP server must be connected

## Procedure

### Step 1: Navigate to Target Screen

```
Tool: mcp_chrome-devtoo_navigate_page
URL: http://localhost:8081 (or current Expo dev URL)
```

If testing a specific screen, navigate to the deep link:
- Home: `/`
- Settings: `/settings`
- Statistics: `/statistics`
- Product detail: `/product/[id]`

### Step 2: Capture Screenshot

```
Tool: mcp_chrome-devtoo_take_screenshot
```

Save the mental reference of the current state.

### Step 3: Run Lighthouse Audit

```
Tool: mcp_chrome-devtoo_lighthouse_audit
Categories: accessibility, performance, best-practices
```

Record scores and flag any below threshold:
- Accessibility: must be ≥ 90
- Performance: should be ≥ 70
- Best Practices: should be ≥ 80

### Step 4: Check Console

```
Tool: mcp_chrome-devtoo_list_console_messages
```

Flag any:
- `error` level messages
- React warnings (key props, deprecated APIs)
- Unhandled promise rejections

### Step 5: Responsive Check

Test at mobile viewport:
```
Tool: mcp_chrome-devtoo_resize_page
Width: 375, Height: 812  (iPhone size)
```

Take another screenshot and verify layout adapts.

### Step 6: Report

Generate a structured report:

```markdown
## Visual Regression Report

**Screen**: [name]
**Date**: [timestamp]
**Viewport**: [dimensions]

### Lighthouse Scores
| Category | Score | Status |
|----------|-------|--------|
| Accessibility | XX | PASS/FAIL |
| Performance | XX | PASS/FAIL |
| Best Practices | XX | PASS/FAIL |

### Console Issues
- [list any errors/warnings]

### Visual Assessment
- [layout observations]
- [any regressions detected]

### Recommendations
- [actionable fixes]
```
