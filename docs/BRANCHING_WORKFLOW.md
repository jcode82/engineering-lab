# 🧭 Engineering-Lab Branching & Deployment Workflow

## Overview
This document defines the workflow for developing, testing, and deploying changes to the **Engineering-Lab** project.  

All commits, branches, and pull requests follow a simple, consistent convention so preview builds, Jira tickets, and production deployments stay in sync.

---

## 🧩 Branch Naming

LAB-##


Example:

LAB-39
LAB-42


Each branch maps directly to a Jira ticket (e.g. `LAB-39: Dynamic Experiment Pages`).  
No long prefixes, no slashes — keep it short and traceable.

---

## ⚙️ Workflow Summary

1. **Start from main**
   ```bash
   git checkout main
   git pull
   git checkout -b LAB-##

2. Work and commit often
   ```bash
    git add .
    git commit -m "feat: short description [LAB-##]"
    git push -u origin LAB-##

Every push creates a Vercel preview build at
https://engineering-lab-git-LAB-##-<username>.vercel.app

3. Open Pull Request
    Target branch: main
    Title: LAB-## | brief description
    Verify the automatic Vercel preview link in the PR.

4. Review & Merge
    Once approved, merge PR into main.
    Vercel automatically builds & deploys production to https://juanflores.pro

5. Clean up (optional ask before deleting)
   ```bash
    git branch -d LAB-##
    git push origin --delete LAB-##

6. Tag release (not used)
   ```bash
    git tag -a vX.Y.Z -m "Route N – description"
    git push origin vX.Y.Z


## ✏️ Commit Message Format

< type >: < short description > [LAB-##]

Types
   ```bash
    feat – new feature
    fix – bug fix
    chore – maintenance / refactor
    style – CSS or design tweaks
    docs – documentation update

Examples
   ```bash
    feat: add MDX content system [LAB-38]
    fix: correct header blur on scroll [LAB-37]
    chore: upgrade dependencies [LAB-40]

🌿 Branch Protection (recommended)
   ```bash
    Default branch: main
    Require pull request before merge
    Require Vercel build check to pass
    Optional: require 1 approving review

🧠 Notes
   ```bash
    Only main triggers production deployment.
    Preview branches auto-deploy to their own URLs.
    Never push directly to main.
    Jira smart commits ([LAB-##]) automatically link commits to tickets.

