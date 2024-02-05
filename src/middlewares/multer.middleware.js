import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // we won't be using original name for the project but for understanding as of now, we are going forward with it.
  },
});

export const upload = multer({
  storage,
});
