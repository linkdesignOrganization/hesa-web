import multer from 'multer';
import { Request } from 'express';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_PDF_TYPES = ['application/pdf'];

/** Allowed file extensions to prevent double-extension attacks */
const SAFE_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const SAFE_PDF_EXTENSIONS = ['.pdf'];

function hasAllowedExtension(filename: string, allowed: string[]): boolean {
  const ext = filename.toLowerCase().split('.').pop();
  return ext ? allowed.includes('.' + ext) : false;
}

const storage = multer.memoryStorage();

function imageFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype) && hasAllowedExtension(file.originalname, SAFE_IMAGE_EXTENSIONS)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid image type: ${file.mimetype}. Allowed: JPEG, PNG, WebP`));
  }
}

function pdfFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void {
  if (ALLOWED_PDF_TYPES.includes(file.mimetype) && hasAllowedExtension(file.originalname, SAFE_PDF_EXTENSIONS)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only PDF allowed`));
  }
}

export const uploadImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_IMAGE_SIZE, files: 6 },
}).array('images', 6);

export const uploadSingleImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_IMAGE_SIZE, files: 1 },
}).single('image');

export const uploadPdf = multer({
  storage,
  fileFilter: pdfFilter,
  limits: { fileSize: MAX_PDF_SIZE, files: 1 },
}).single('pdf');
