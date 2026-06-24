import { createAdminClient } from "@/lib/supabase/admin";
import { getBucketConfigWarning } from "@/constants/storage";

export class StorageService {
  private readonly client = createAdminClient();

  private async ensureBucketExists(bucket: string): Promise<void> {
    const { error } = await this.client.storage.createBucket(bucket, {
      public: false,
    });

    if (error && !error.message.toLowerCase().includes("already exists")) {
      throw error;
    }
  }

  async uploadPdf(bucket: string, path: string, file: Uint8Array | Blob): Promise<void> {
    const { error } = await this.client.storage.from(bucket).upload(path, file, {
      upsert: false,
      contentType: "application/pdf",
    });

    if (!error) return;

    if (error.message.toLowerCase().includes("bucket not found")) {
      await this.ensureBucketExists(bucket);
      const retryResult = await this.client.storage.from(bucket).upload(path, file, {
        upsert: false,
        contentType: "application/pdf",
      });

      if (!retryResult.error) return;

      const warning = getBucketConfigWarning(bucket);
      throw new Error(`Failed to upload PDF file after creating bucket: ${retryResult.error.message}. ${warning}`);
    }

    const warning = getBucketConfigWarning(bucket);
    throw new Error(`Failed to upload PDF file: ${error.message}. ${warning}`);
  }

  async deletePdf(bucket: string, path: string): Promise<void> {
    const { error } = await this.client.storage.from(bucket).remove([path]);

    if (error) {
      const warning = getBucketConfigWarning(bucket);
      throw new Error(`Failed to delete PDF file from storage: ${error.message}. ${warning}`);
    }
  }

  async getPdfUrl(bucket: string, path: string): Promise<string> {
    const expirySeconds = 60 * 60; // 1 hour
    const { data, error } = await this.client.storage.from(bucket).createSignedUrl(path, expirySeconds);

    if (error || !data?.signedUrl) {
      const warning = getBucketConfigWarning(bucket);
      throw new Error(`Failed to generate signed PDF URL: ${error?.message ?? "Unknown storage error."}. ${warning}`);
    }

    return data.signedUrl;
  }

  async downloadPdf(bucket: string, path: string): Promise<Buffer> {
    const { data, error } = await this.client.storage.from(bucket).download(path);

    if (error || !data) {
      throw new Error(`Failed to download PDF file: ${error?.message ?? "Unknown storage error."}`);
    }

    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
