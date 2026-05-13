"use client";

/**
 * Compress an image file to a smaller base64 data URL.
 *
 * - Resizes so the longest side is at most `maxDimension` px (default 800)
 * - Converts to JPEG with `quality` (0–1, default 0.7)
 * - Preserves JPEG/PNG transparency by padding with white when needed
 *
 * Returns `null` if the file is not a valid image.
 */
export async function compressImage(
  file: File,
  opts?: {
    maxDimension?: number;
    quality?: number;
  },
): Promise<string | null> {
  const maxDim = opts?.maxDimension ?? 800;
  const quality = opts?.quality ?? 0.7;

  // Load image from file
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return null;

  const { width: w, height: h } = bitmap;

  // Calculate new dimensions (keep aspect ratio)
  let newW = w;
  let newH = h;
  if (w > h && w > maxDim) {
    newW = maxDim;
    newH = Math.round((h / w) * maxDim);
  } else if (h >= w && h > maxDim) {
    newH = maxDim;
    newW = Math.round((w / h) * maxDim);
  }

  // Draw onto canvas
  const canvas = document.createElement("canvas");
  canvas.width = newW;
  canvas.height = newH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // White background for images with transparency (PNG → JPEG)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, newW, newH);
  ctx.drawImage(bitmap, 0, 0, newW, newH);

  // Export as JPEG base64
  const dataUrl = canvas.toDataURL("image/jpeg", quality);

  // Cleanup
  bitmap.close();
  canvas.remove();

  return dataUrl;
}

/**
 * Convenience: compress and return both the data URL and approximate size in KB.
 */
export async function compressImageWithSize(
  file: File,
  opts?: { maxDimension?: number; quality?: number },
): Promise<{ dataUrl: string; sizeKb: number } | null> {
  const dataUrl = await compressImage(file, opts);
  if (!dataUrl) return null;

  // Approximate binary size from base64 length
  const base64 = dataUrl.split(",")[1] ?? "";
  const sizeBytes = (base64.length * 3) / 4;
  const sizeKb = Math.round(sizeBytes / 1024);

  return { dataUrl, sizeKb };
}
