# Design Spec: Portfolio Duplication and Customization

This document outlines the plan to duplicate the [akashrmalhotra/3d-portfolio](https://github.com/akashrmalhotra/3d-portfolio) repository and customize it for Misbah ul Haque.

## Goals
- Duplicate the source repository's structure and functionality.
- Remove all references to the original author (Akash Malhotra).
- Update the branding to "Misbah ul Haque".
- Replace social links and external assets with placeholders.
- Exclude license and author-specific files.

## Scope
- **Source:** `https://github.com/akashrmalhotra/3d-portfolio`
- **Target:** Current workspace (`/Users/misbah.haque/IdeaProjects/untitled`)

## Proposed Changes

### 1. File Duplication
- **Included:** All source code (`src/`), assets (`public/` except resume), configuration files (`package.json`, `tsconfig.json`, `vite.config.ts`, etc.).
- **Excluded:**
    - `.git/` (New repository setup)
    - `LICENSE` (As requested)
    - `public/Akash_Malhotra.pdf` (Author's resume)
    - `.github/` (Author's workflows)

### 2. Personalization
- **Name:** Replace "Akash Malhotra" with "Misbah ul Haque" globally.
- **Short Name/Initials:** 
    - Replace "AKASH" with "MISBAH" and "MALHOTRA" with "UL HAQUE" in `Landing.tsx`.
    - Replace "AM" with "MH" in `Navbar.tsx`.
- **Metadata:**
    - Update `<title>` in `index.html`.
    - Update `name` and `description` in `package.json`.

### 3. Placeholders
- **Social Links:** Replace URLs (LinkedIn, GitHub, etc.) with `#`.
- **Social Handles:** Replace display text like `akashrmalhotra` with `misbahulhaque`.
- **Resume:** Update the resume button to a placeholder or disable the link.

## Verification Plan
- **Build Check:** Run `npm install` and `npm run build` (if dependencies allow) to ensure the project remains functional.
- **Visual Check:** Search for "Akash" globally to ensure no leaked references remain.
- **Link Check:** Verify that all social links point to `#`.
