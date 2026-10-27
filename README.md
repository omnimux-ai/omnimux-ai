# omnimux-ai

Release coordination and version lock for the OmniMux components.

This repository contains **no product source code**. It records which commits and package versions are compatible with each other, and verifies that the recorded set is still accurate.

## Why this exists

OmniMux ships as three independently versioned repositories with different toolchains, release cadences and licenses:

| Component | Repository | Stack | License |
| --- | --- | --- | --- |
| Gateway | `laozhong86/OmniMux` | Go + React | AGPL-3.0 |
| Desktop | `laozhong86/omnimux-desktop-fork` | Electron | MIT |
| Plugins | `omnimux-ai/omnimux-dsh` | Node | OmniMux Sustainable Source License 1.0 |

Because they release independently, nothing in any single repository can answer "which gateway version does desktop 2.0.18 talk to". `versions.json` is that answer, and `scripts/verify.mjs` keeps it honest.

## What is in here

| Path | Purpose |
| --- | --- |
| `versions.json` | The locked component set: repository, branch, commit, version, license |
| `versions.schema.json` | Shape of `versions.json` |
| `scripts/verify.mjs` | Fetches each recorded commit and fails when it no longer exists |
| `.github/workflows/verify.yml` | Runs the verification on a schedule and on every change |

## Open-source scope

This repository is a coordination surface. It is **not** a statement that OmniMux as a product is open source.

- `omnimux-ai/omnimux-dsh` is public.
- `omnimux-ai/OmniMux-skills` is public.
- The gateway and the desktop app are currently private.

The gateway is a fork of [QuantumNous/new-api](https://github.com/QuantumNous/new-api) and remains under AGPL-3.0 with its attribution preserved. Any public distribution of gateway source must keep the `new-api` / `QuantumNous` attribution and the additional terms recorded in that project's `NOTICE`.

## Verify

```bash
node scripts/verify.mjs
```

Requires the GitHub CLI (`gh`) authenticated with read access to the private repositories. Without authentication the private component checks are skipped and reported as skipped, not as passing.
