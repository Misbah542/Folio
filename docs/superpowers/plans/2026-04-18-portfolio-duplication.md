# Portfolio Duplication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Duplicate the source 3D portfolio repository and customize it for Misbah ul Haque with placeholders for social links.

**Architecture:** Scripted duplication and global search-and-replace to ensure consistent branding while maintaining original functionality.

**Tech Stack:** React, TypeScript, Vite, GSAP, Three.js.

---

### Task 1: Project Setup and File Duplication

**Files:**
- Create: All files from source (excluding `.git`, `LICENSE`, `public/Akash_Malhotra.pdf`)
- Modify: `package.json`

- [ ] **Step 1: Clone source to temp directory**
Run: `git clone --depth 1 https://github.com/akashrmalhotra/3d-portfolio /tmp/source-portfolio`

- [ ] **Step 2: Copy files to workspace**
Exclude `.git`, `LICENSE`, and the resume PDF.
Run: `rsync -av --exclude '.git' --exclude 'LICENSE' --exclude 'public/Akash_Malhotra.pdf' /tmp/source-portfolio/ .`

- [ ] **Step 3: Update package.json name and author**
```json
{
  "name": "misbah-portfolio",
  "version": "1.0.0",
  "description": "3D Portfolio for Misbah ul Haque",
  ...
}
```

- [ ] **Step 4: Install dependencies**
Run: `npm install`

- [ ] **Step 5: Commit initial structure**
Run: `git add . && git commit -m "chore: initial project setup from source"`

---

### Task 2: Global Branding Replacement

**Files:**
- Modify: All source files containing "Akash Malhotra" or "Akash"

- [ ] **Step 1: Replace "Akash Malhotra" with "Misbah ul Haque"**
Run: `grep -rl "Akash Malhotra" . | xargs sed -i '' 's/Akash Malhotra/Misbah ul Haque/g'`

- [ ] **Step 2: Replace "Akash" with "Misbah" in Landing.tsx**
```tsx
// src/components/Landing.tsx
<h1>
  MISBAH
  <br />
  <span>UL HAQUE</span>
</h1>
```

- [ ] **Step 3: Update Navbar initials**
```tsx
// src/components/Navbar.tsx
<a href="/#" className="navbar-title" data-cursor="disable">
  MH
</a>
```

- [ ] **Step 4: Commit branding changes**
Run: `git add . && git commit -m "feat: customize branding to Misbah ul Haque"`

---

### Task 3: Metadata and Document Updates

**Files:**
- Modify: `index.html`, `README.md`

- [ ] **Step 1: Update index.html title**
```html
<title>Misbah ul Haque — Developer</title>
```

- [ ] **Step 2: Clean up README.md**
Remove original live site links and description.
```markdown
# Misbah ul Haque - 3D Portfolio
Customized version of the 3D portfolio.
```

- [ ] **Step 3: Commit metadata changes**
Run: `git add . && git commit -m "chore: update metadata and readme"`

---

### Task 4: Social Links and Placeholders

**Files:**
- Modify: `src/components/Contact.tsx`, `src/components/SocialIcons.tsx`, `src/components/Navbar.tsx`

- [ ] **Step 1: Replace social URLs with placeholders**
Replace `https://www.linkedin.com/in/akashrmalhotra/` with `#`.
Replace `https://github.com/akashrmalhotra` with `#`.
Replace other social links with `#`.

- [ ] **Step 2: Update social handle display text**
Replace `akashrmalhotra` with `misbahulhaque` or similar placeholder handles.

- [ ] **Step 3: Update Resume link**
Disable or point the resume button to `#`.
```tsx
// src/components/SocialIcons.tsx
<a
  className="resume-button"
  href="#"
  target="_blank"
  rel="noreferrer"
>
```

- [ ] **Step 4: Commit placeholder changes**
Run: `git add . && git commit -m "feat: replace social links with placeholders"`

---

### Task 5: Verification

- [ ] **Step 1: Run build**
Run: `npm run build`
Expected: Success

- [ ] **Step 2: Global search for "Akash"**
Run: `grep -ri "Akash" .`
Expected: No matches (except perhaps in this plan/spec)
