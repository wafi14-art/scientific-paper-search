export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "papers";

export function getBucketConfigWarning(bucket: string) {
  return `Storage bucket: ${bucket}. Make sure this bucket exists in your Supabase project and matches SUPABASE_STORAGE_BUCKET.`;
}
