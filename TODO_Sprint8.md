# TODO Sprint 8 (Production Finalization) — Scientific Paper Search

## 0) Status
- Remaining: confirm environment variables + storage/signed URL in Supabase, run final end-to-end smoke test.

## 1) Production Environment Audit (env vars)
- [ ] Check required variables:
  - [ ] Frontend: NEXT_PUBLIC_SUPABASE_URL
  - [ ] Frontend: NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] Backend: SUPABASE_SERVICE_ROLE_KEY
  - [ ] Backend: DATABASE_URL
  - [ ] Backend: DIRECT_URL
  - [ ] Backend: GEMINI_API_KEY
- [ ] Verify server-only keys are not imported into client components

## 2) Supabase Production Check
- [ ] Auth: site URL / redirect URL
- [ ] Email provider settings
- [ ] Database: migrations applied, pgvector extension enabled
- [ ] Storage:
  - [ ] bucket (papers) exists
  - [ ] privacy correct
  - [ ] signed URL access works

## 3) Deployment Preparation
- [ ] Verify scripts:
  - [ ] npm run build
  - [ ] next.config compatibility
  - [ ] prisma generation during postinstall

## 4) Final Application Testing (E2E smoke)
For each step provide:
- Test
- Result
- Evidence
- Issue (if any)

Flow:
- [ ] Register
- [ ] Login
- [ ] Dashboard
- [ ] Upload PDF
- [ ] Extraction
- [ ] Embedding
- [ ] Paper indexed
- [ ] Semantic Search
- [ ] Search History
- [ ] Dashboard analytics

## 5) UI Final Review (no redesign)
- [ ] /login
- [ ] /register
- [ ] /dashboard
- [ ] /upload
- [ ] /papers
- [ ] /search
- [ ] /papers/[id]

Checks:
- [ ] responsive layout
- [ ] loading state
- [ ] error handling
- [ ] empty state
- [ ] navigation consistency

## 6) Repository Cleanup
- [ ] Remove only confirmed unused files/imports/debug artifacts
- [ ] Ensure no required scripts are removed

## 7) Documentation Preparation
- [ ] System architecture section
- [ ] Database summary (User, Paper, PaperEmbedding, SearchHistory)
- [ ] Feature summary (Auth, PDF indexing, Semantic search, Analytics)

## 8) Final Validation (commands)
- [ ] npm run lint
- [ ] npm run build
- [ ] npx prisma validate
- [ ] npx prisma migrate deploy (or migrate status)

## Completed in this run (evidence)
- [x] npm run lint (no output captured; command finished)
- [x] npm run build (command finished)
- [x] npx prisma validate (command finished)
- [x] npx prisma generate (command finished)
- [x] npx prisma migrate deploy (command finished)

