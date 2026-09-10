import "server-only";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type StoredFile = { url: string; objectKey: string };

export interface StorageProvider {
  uploadFile(file: File): Promise<StoredFile>;
  deleteFile(objectKey: string): Promise<void>;
}

const uploadDirectory = path.join(process.cwd(), "public", "uploads");

export const localStorage: StorageProvider = {
  async uploadFile(file) {
    await mkdir(uploadDirectory, { recursive: true });
    const extension = path.extname(file.name).toLowerCase() || ".jpg";
    const objectKey = `${randomUUID()}${extension}`;
    await writeFile(path.join(uploadDirectory, objectKey), Buffer.from(await file.arrayBuffer()));
    return { objectKey, url: `/uploads/${objectKey}` };
  },
  async deleteFile(objectKey) {
    await unlink(path.join(uploadDirectory, path.basename(objectKey))).catch(() => undefined);
  },
};

export const uploadFile = (file: File) => localStorage.uploadFile(file);
export const deleteFile = (objectKey: string) => localStorage.deleteFile(objectKey);
