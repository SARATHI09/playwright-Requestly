---
name: ERPNext Custom App — Issue (Agent Ready)
about: High-level issue template for @claude to reproduce, fix/build safely, and raise a PR to our main branch.
title: "[Bug|Enhancement|Feature] <clear title>"
labels: ["needs-triage"]
---

## 📌 Section 1: Issue Summary

**One-liner:** <what's wrong / what's needed>

**Business impact:** <who is affected + severity + frequency + workaround (if any)>

---

## 🎯 Section 2: Scope & Safety (Must Not Break)

**In scope:** <modules/doctype/feature that must change>

**Out of scope:** <explicitly what should NOT be touched>

**Must not break flows:**
1. <flow 1>
2. <flow 2>
3. <flow 3>

---

## ✅ Section 3: Expected vs Actual

**Expected (functional contract):**
- When <trigger>, given <preconditions>, system must: <rule bullets>

**Actual:**
- <what happens today + visible symptom/error>

---

## 🔄 Section 4: Reproduction (Deterministic)

**Preconditions / Setup:** <company/site/user role/config/master data>

**Steps:**
1. <step>
2. <step>
3. <step>

**Observed result:** <…>

**Expected result:** <…>

---

## 📎 Section 5: Evidence

**Doc links/IDs:** <DocType: DocName>

**Screenshots/recording:** <attached?>

**Logs/traceback (redact secrets):**
```text
<paste here>
```

---

## 🖥️ Section 6: Environment

* ERPNext: v15.80.1 (version-15)
* Frappe: v15.83.0 (version-15)
* Custom app: kaynes

---

## ✔️ Section 7: Acceptance Criteria

* [ ] Repro now matches expected behavior
* [ ] Tests added/updated (unit/integration where applicable)
* [ ] Regression checked for "Must not break" flows
* [ ] No new errors/tracebacks; permissions remain correct

---

## 🚀 Section 8: Repo Branching & PR Policy (MANDATORY)

**Our main branch:** `feat/wo-fg-from-development`

**@claude must:**

1. Create a new branch **from** `feat/wo-fg-from-development`
2. Commit changes to the new branch only
3. Raise PR **to** `feat/wo-fg-from-development` (base branch)
4. Never open PRs to `main` / `master`

**Branch name convention:** `claude/issue-<issue_number>-<short-slug>`

**PR must include:** 
- Summary
- Root cause
- Fix approach
- Tests run + results
- Regression notes