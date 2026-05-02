# Products Storage Update

Date: 2026-05-02
Project: KSP (backend + frontend)

## 1) Objective
Migrate product images and bank-slip files from local disk storage (`/uploads/...`) to Cloudinary, and update MongoDB records to use Cloudinary `secure_url` values.

Cloudinary folders used:
- `ksp_uploads/products`
- `ksp_uploads/bank-slips`

## 2) What Changed

### Backend dependencies
- Added Cloudinary package in `backend/package.json`.
- Lockfile updated in `backend/package-lock.json`.

### New backend config
- Added `backend/src/config/cloudinary.js`.
- Centralized Cloudinary initialization using env variables:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

### Upload API changes
File: `backend/src/routes/uploadRoutes.js`

#### Product upload (`POST /api/upload/product-image`)
- Replaced `multer.diskStorage()` with `multer.memoryStorage()`.
- Removed local file path behavior (`/uploads/products/...`) for new uploads.
- Added stream upload to Cloudinary via `cloudinary.uploader.upload_stream`.
- Added reusable helper: `uploadBufferToCloudinary(buffer, options)`.
- Response now includes Cloudinary fields:
  - `imageUrl`
  - `secure_url`
  - `public_id`

#### Product rename endpoint
- Removed rename workflow (`/upload/rename-image`) from the active implementation path.
- No more temporary local upload + rename process.

#### Bank-slip upload (`POST /api/upload/bank-slip`)
- Replaced local disk storage with `multer.memoryStorage()`.
- Upload now goes to Cloudinary folder `ksp_uploads/bank-slips`.
- Uses `resource_type: 'auto'` to support image and PDF uploads.
- Response now returns:
  - `bankSlipUrl` (Cloudinary secure URL)
  - `filename` (Cloudinary public ID)

## 3) Frontend changes

### Admin product creation
File: `frontend/src/pages/Admin/Dashboard.js`
- Updated upload handler to store Cloudinary URL:
  - Uses `response.data.secure_url` (fallback to `imageUrl` if needed).
- Removed rename-after-create flow.
- Removed API call to `/upload/rename-image`.

### Product list image rendering
File: `frontend/src/pages/Products.js`
- Added `getImageUrl()` helper:
  - Uses absolute URL directly if value starts with `http`.
  - Otherwise prefixes backend base URL for legacy local paths.
- Updated all product cards to use `getImageUrl(product.imageUrl)`.
- Refactored `fetchProducts` to `useCallback` to satisfy hook dependency linting.

### Product detail image rendering
File: `frontend/src/pages/ProductDetail.js`
- Updated image resolution logic:
  - Absolute URLs (`http/https`) are used directly.
  - Legacy local paths are prefixed with API base URL.
- Cleaned unused icon imports.

## 4) Migration tooling added

### Script 1: File-first migration
File: `backend/scripts/migrate-uploads-to-cloudinary.js`
- Scans local folders:
  - `backend/uploads/products`
  - `backend/uploads/bank-slips`
- Attempts to find matching DB records by filename regex.
- Uploads to Cloudinary and updates MongoDB:
  - Product: `imageUrl`, `imagePublicId`
  - Order/Payment: `bankSlipUrl`, `bankSlipPublicId`
- Supports:
  - `--dry-run`
  - `--limit=<N>`
  - `--skip-existing`
- Writes logs to `backend/scripts/migration-log.jsonl`.

### Script 2: DB-first migration
File: `backend/scripts/migrate-db-urls-to-cloudinary.js`
- Finds DB records still using local URL patterns:
  - `/uploads/products/...`
  - `/uploads/bank-slips/...`
- Resolves local filename from DB URL, uploads if file exists, updates record.
- Supports:
  - `--dry-run`
  - `--limit=<N>`
- Writes logs to `backend/scripts/db-url-migration-log.jsonl`.

## 5) Commands executed and outcomes

### Dry run
Command:
`node scripts/migrate-uploads-to-cloudinary.js --dry-run --limit=5`
Outcome:
- Script ran successfully.
- Confirmed matching behavior before real updates.

### Limited live migration
Command:
`node scripts/migrate-uploads-to-cloudinary.js --limit=10`
Outcome:
- Uploaded a batch of product images and bank-slips to Cloudinary.
- Updated matching Product and Order records with Cloudinary URLs.

### Full live migration
Command:
`node scripts/migrate-uploads-to-cloudinary.js`
Outcome:
- Processed all current files in local upload folders.
- Uploaded additional matching items.
- Logged unmatched files as `no_matching_product` or `no_matching_payment_or_order`.

### DB-first migration
Command:
`node scripts/migrate-db-urls-to-cloudinary.js`
Outcome:
- Executed successfully.
- Remaining DB rows with local URLs could not be updated because referenced local files were not present.
- Summary showed `missing_local_file` entries for all remaining local URL rows.

## 6) Current status
- New uploads (product + bank-slip) are Cloudinary-based.
- Frontend supports both Cloudinary URLs and legacy local paths.
- A subset of legacy records were migrated and updated in MongoDB.
- Some records still reference `/uploads/...` because source files are missing locally.

## 7) Remaining gaps to fully complete dataset migration
1. Restore missing legacy files (from backup) into:
   - `backend/uploads/products`
   - `backend/uploads/bank-slips`
2. Re-run DB-first script:
   - `node scripts/migrate-db-urls-to-cloudinary.js`
3. Verify remaining local URL counts become zero.
4. After verification, remove static `/uploads` serving in backend if no longer needed.

## 8) Logs and evidence
- `backend/scripts/migration-log.jsonl`
- `backend/scripts/db-url-migration-log.jsonl`

These files capture each processed item, status, Cloudinary URLs/public IDs (when uploaded), and missing-file cases.
