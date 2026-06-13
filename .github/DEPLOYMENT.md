# Deployment setup

One-time GitHub repository configuration for CI/CD.

## Toolchain

- **Node:** 22 LTS (see [`.nvmrc`](../.nvmrc))
- **npm:** 10.9.8 (pinned via `packageManager` in [`package.json`](../package.json); `setup-node` activates it in CI via Corepack)

```bash
nvm use
npm ci
```

## GitHub Pages (done if `build_type` is `workflow`)

**Settings → Pages → Build and deployment → Source:** GitHub Actions

Or via CLI:

```bash
gh api -X POST repos/iannics/cube-puzzle-engine/pages -f build_type=workflow
```

Live URL: https://iannics.github.io/cube-puzzle-engine/

## Branch protection (recommended)

### `main`

- Require a pull request before merging
- Require status check: **CI**
- Require branches to be up to date before merging

### `dev`

- Require status check: **CI** (optional but recommended)

## Release flow

1. Merge feature work into `dev` via PR (CI must pass).
2. Open a PR from `dev` → `main` and merge when ready.
3. **CI** runs on the `main` push → after checks pass, builds with `VITE_BASE_PATH=/cube-puzzle-engine/` and publishes to GitHub Pages (same workflow, gated by `needs: ci`).
4. **Release Please** opens/updates a bot PR (e.g. `chore(main): release 0.1.0`).
5. Merge the Release PR when you want a versioned git tag, GitHub Release, and changelog update (independent of deploy — the site is already live from step 3).

Optional: enable **auto-merge** on release-please PRs for hands-off releases.

To redeploy without a new commit, run the **CI** workflow manually via **Actions → CI → Run workflow** (branch: `main`).

## Local GitHub Pages preview

```bash
VITE_BASE_PATH=/cube-puzzle-engine/ npm run build && npm run preview
```
