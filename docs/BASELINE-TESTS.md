# BASELINE TEST EXECUTION & AUDIT LOGS
**Project:** Small Living 2026  
**Date:** 2026-11-01  
**Environment:** Windows 11, Node.js v24.22.1, npm 11.19.1

---

## 1. System & Runtime Baseline

```powershell
# Command:
node -v; npm -v

# Output:
v24.22.1
11.19.1
# Exit Code: 0
```

---

## 2. Git Status Baseline

```powershell
# Command:
git rev-parse --show-toplevel; git status --short

# Output:
D:/Project/Shop-Ecommerce
 M frontend/app/(user)/Search/page.js
 M frontend/app/(user)/about/page.js
 M frontend/app/(user)/cart/page.js
 M frontend/app/(user)/contact/page.js
 M frontend/app/(user)/info/page.js
 M frontend/app/(user)/layout.js
 M frontend/app/(user)/login/page.js
 M frontend/app/(user)/page.js
 M frontend/app/(user)/product-detail/[id]/page.js
 M frontend/app/(user)/product/page.js
 M frontend/app/(user)/register/page.js
 M frontend/app/admin/Leftbar.js
 M frontend/app/admin/category/add/page.js
 M frontend/app/admin/category/page.js
 M frontend/app/admin/category/update/[id]/page.js
 M frontend/app/admin/layout.js
 M frontend/app/admin/login/page.js
 M frontend/app/admin/page.js
 M frontend/app/admin/product/add/page.js
 M frontend/app/admin/product/page.js
 M frontend/app/admin/product/update/[id]/page.js
 M frontend/app/admin/register/page.js
 M frontend/components/Footer.js
 M frontend/components/Header.js
 M frontend/components/ProductCard.js
 M frontend/public/style/globals.css
 M frontend/tests/e2e/cart-flow.spec.js
?? docs/
?? frontend/app/(user)/cart/loading.js
?? frontend/app/(user)/error.js
?? frontend/app/(user)/loading.js
?? frontend/app/(user)/not-found.js
?? frontend/app/(user)/product-detail/[id]/loading.js
?? frontend/app/(user)/product/loading.js
?? frontend/app/apple-icon.png
?? frontend/app/favicon.ico
?? frontend/app/icon.png
?? frontend/app/icon.svg
?? frontend/app/manifest.js
?? frontend/components/ui/
?? frontend/lib/site-config.js
?? frontend/lib/store/slices/
?? frontend/public/brand/
?? frontend/public/favicon.ico
?? frontend/public/og-image.png
?? frontend/public/screenshots/
?? frontend/scripts/
?? frontend/tests/e2e/snapshot.spec.js
# Exit Code: 0
```

---

## 3. Dependency Outdated Audit

```powershell
# Command:
npm outdated

# Output:
Package             Current   Wanted   Latest  Location                         Depended by
@reduxjs/toolkit      2.2.6   2.13.0   2.13.0  node_modules/@reduxjs/toolkit    frontend
eslint               8.57.0   8.57.1  10.14.0  node_modules/eslint              frontend
eslint-config-next  14.2.35  14.2.35   16.4.3  node_modules/eslint-config-next  frontend
formik                2.4.6    2.4.9    2.4.9  node_modules/formik              frontend
next                14.2.35  14.2.35   16.4.3  node_modules/next                frontend
react                18.3.1   18.3.1   19.3.1  node_modules/react               frontend
react-dom            18.3.1   18.3.1   19.3.1  node_modules/react-dom           frontend
react-hook-form      7.52.1   7.91.0   7.91.0  node_modules/react-hook-form     frontend
react-redux           9.1.2    9.3.1    9.3.1  node_modules/react-redux         frontend
yup                   1.4.0    1.7.1    1.7.1  node_modules/yup                 frontend
# Exit Code: 1 (Outdated packages detected)
```

---

## 4. Security Audit (`npm audit --omit=dev`)

```powershell
# Command:
npm audit --omit=dev

# Output:
# npm audit report
4 vulnerabilities (3 high, 1 critical)
- next <= 16.3.0-preview.10 (CRITICAL: RCE on Windows GHSA-p293-qw3h-jr36, DoS, SSRF)
- postcss <= 8.5.22 (HIGH: XSS, arbitrary file read)
- lodash / lodash-es <= 4.17.23 (HIGH: prototype pollution, code injection)
# Exit Code: 1 (Vulnerabilities detected)
```

---

## 5. Unit Tests Baseline (`npm test`)

```powershell
# Command:
npm test

# Output:
 RUN  v5.0.5 D:/Project/Shop-Ecommerce/frontend
 ✓ tests/unit/image.test.js (3 tests) 3ms
 ✓ tests/unit/cart.test.js (15 tests) 14ms

 Test Files  2 passed (2)
      Tests  18 passed (18)
   Start at  10:31:43
   Duration  706ms (import 41%, transform 33%, worker 21%, tests 6%)
# Exit Code: 0 (PASS)
```

---

## 6. Linter Baseline (`npm run lint`)

```powershell
# Command:
npm run lint

# Output:
> frontend@0.1.0 lint
> next lint

./app/(user)/cart/page.js: Warning: Using <img> instead of next/image
./app/(user)/login/page.js: Warning: Using <img> instead of next/image
./app/(user)/page.js: Warning: Using <img> instead of next/image
./app/(user)/product-detail/[id]/page.js: Warning: Using <img> instead of next/image
./app/(user)/register/page.js: Warning: Using <img> instead of next/image
./app/admin/page.js: Warning: Using <img> instead of next/image
./app/admin/product/add/page.js: Warning: Using <img> instead of next/image
./app/admin/product/page.js: Warning: Using <img> instead of next/image
./app/admin/product/update/[id]/page.js: Warning: Using <img> instead of next/image
./components/Header.js: Warning: Using <img> instead of next/image
./components/ProductCard.js: Warning: Using <img> instead of next/image
# Result: 0 errors, 13 warnings
# Exit Code: 0 (PASS)
```

