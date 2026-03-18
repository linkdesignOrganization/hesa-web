import multer from 'multer';

/**
 * Shared multer upload configurations for admin routes.
 * Consolidates duplicated file-filter and size-limit logic from
 * products.routes, brands.routes, home.routes, content.routes, team.routes.
 *
 * NFR-019: Validates file type and size on upload (BUG-009).
 */

const ALLOWED_IMAGE_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

const ALLOWED_PDF_MIMETYPES = ['application/pdf'];

const imageFileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  if (ALLOWED_IMAGE_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only images are allowed (JPEG, PNG, WebP, GIF, SVG).`
      )
    );
  }
};

const pdfFileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  if (ALLOWED_PDF_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only PDF files are allowed.`
      )
    );
  }
};

/** Multi-image upload (up to 6 images, 5 MB each). */
export const adminUploadImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFileFilter,
});

/** Single-image upload (5 MB). */
export const adminUploadSingleImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFileFilter,
});

/** Single PDF upload (5 MB). */
export const adminUploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: pdfFileFilter,
});
