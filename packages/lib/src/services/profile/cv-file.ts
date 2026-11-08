export const CV_PROCESS_TIMEOUT_MS = 45000;
export const MAX_CV_BYTES = 3 * 1024 * 1024;
export class CvImportError extends Error {
  constructor(
    message: string,
    readonly status = 422,
  ) {
    super(message);
  }
}
export type CvFile = { bytes: Uint8Array; mime: string; filename: string };
export async function validateCvFile(file: File): Promise<CvFile> {
  if (!file.size || file.size > MAX_CV_BYTES)
    throw new CvImportError("Choose a nonempty CV up to 3 MB.", 413);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const extension = file.name.toLowerCase().split(".").at(-1);
  const signature = new TextDecoder().decode(bytes.slice(0, 5));
  if (extension === "pdf" && signature === "%PDF-")
    return { bytes, filename: "cv.pdf", mime: "application/pdf" };
  if (
    extension === "docx" &&
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    bytes[2] === 3 &&
    bytes[3] === 4
  )
    return {
      bytes,
      filename: "cv.docx",
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
  if (extension === "txt") {
    let text: string;
    try {
      text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      throw new CvImportError("Text CVs must use UTF-8 encoding.", 400);
    }
    if (text.trim().length >= 20 && !bytes.includes(0))
      return { bytes, filename: "cv.txt", mime: "text/plain" };
  }
  throw new CvImportError("Upload a PDF, DOCX or UTF-8 text CV with a matching file format.", 400);
}
