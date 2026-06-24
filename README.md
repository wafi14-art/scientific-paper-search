# Scientific Paper Search System

Production-ready Next.js application for uploading scientific PDFs, extracting metadata and text, generating Gemini embeddings, and searching papers with PostgreSQL pgvector.

## Architecture

```text
User
 |
Next.js App Router UI
 |
API Layer
 |
Service Layer
 |
Repository Layer
 |
Supabase PostgreSQL + Storage
 |
Gemini Embedding
 |
pgvector Search
```

## Core Features

- Authentication with Supabase Auth.
- PDF upload to private Supabase Storage.
- Metadata and text extraction from uploaded PDFs.
- Gemini `text-embedding-004` embedding generation.
- pgvector-backed semantic and hybrid search.
- Search analytics persisted to `SearchHistory`.
- Dashboard metrics for papers, embeddings, and recent searches.

## Database Summary

- `User`: application profile linked to Supabase Auth user IDs.
- `Paper`: uploaded PDF metadata, extraction status, embedding status, and storage path.
- `PaperEmbedding`: extracted text chunks with pgvector embeddings.
- `SearchHistory`: user search query analytics, filters, result counts, and average similarity.

## Required Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
GEMINI_API_KEY=
```

Optional:

```env
SUPABASE_STORAGE_BUCKET=papers
GEMINI_API_URL=
```

Keep `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`, and `GEMINI_API_KEY` server-only. Do not expose them in client components or public documentation.

## Production Checklist

- Configure Supabase Auth site URL and redirect URLs for the production domain.
- Confirm email provider settings in the Supabase dashboard.
- Apply Prisma migrations to the production database.
- Confirm the `pgvector` extension is enabled.
- Confirm the private `papers` storage bucket exists.
- Set all environment variables in the deployment provider.

## Commands

```bash
npm run lint
npm run build
npx prisma validate
npx prisma migrate status
```

`postinstall` runs `prisma generate` so fresh production installs generate Prisma Client before build/runtime.
