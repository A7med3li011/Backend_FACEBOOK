import multer from "multer";

export const multer4server = () => {
  const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }

  const upload = multer({
    storage: storage,
    fileFilter,
    limits: {
      fileSize: 500 * 1024 * 1024, // Limit to 500 MB (adjust as needed)
    },
  });

  return upload;
};
