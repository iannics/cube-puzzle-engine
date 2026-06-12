# Deployment setup

One-time GitHub repository configuration for CI/CD.

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
3. **Release Please** opens/updates a bot PR (e.g. `chore(main): release 0.1.0`).
4. Merge the Release PR → creates git tag + GitHub Release.
5. **Deploy** workflow runs on `release: published` → builds with `VITE_BASE_PATH=/cube-puzzle-engine/` and publishes to GitHub Pages.

Optional: enable **auto-merge** on release-please PRs for hands-off releases.

## Local GitHub Pages preview

```bash
VITE_BASE_PATH=/cube-puzzle-engine/ npm run build && npm run preview
```
