## Documentation
Write JSDoc and code comments in English.

## Commands
- `lint` — eslint linter
- `lint:ts` — typescript linter

## Agent skills

### Issue tracker

Issues live as markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Rules

### playground/

- `components/`, `form/`, `composables/`, `utils/` are auto-imported & components has prefix `N`
- aliase for import from `runtime` = `@nui/` only, not `#nui`

### src

- All imports must be relative
- If you try to find component from `playground` in `runtime`, remove prefix `N` from component name
- replace imports from `#app` -> `nuxt/app`

