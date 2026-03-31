---
description: "Generate a conventional commit message from staged changes. Runs git diff, analyzes changes, and commits."
agent: "agent"
tools: ["execute", "read"]
---

# Conventional Commit

Analyze the staged changes and create a conventional commit.

## Workflow

1. Run `git diff --cached --stat` to see changed files
2. Run `git diff --cached` to inspect the actual changes
3. Determine the commit type and scope from the changes
4. Generate and execute the commit

## Commit Format

```
type(scope): concise description

Optional body with details
```

## Types

| Type | When |
|------|------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `refactor` | Code restructuring without behavior change |
| `style` | Formatting, spacing, theme changes |
| `docs` | Documentation or translations |
| `test` | Adding or updating tests |
| `chore` | Build config, dependencies, tooling |

## Scopes

Use the primary area: `ui`, `store`, `i18n`, `theme`, `nav`, `db`, `types`, `test`

## Rules

- Subject line: imperative mood, lowercase, no period, max 72 chars
- If multiple areas changed, use the most significant as scope
- Include breaking changes with `BREAKING CHANGE:` footer
