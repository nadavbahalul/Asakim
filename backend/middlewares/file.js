// const multer = require("multer");
// const path = require("path");
// const AWS = require("aws-sdk");

// const MIME_TYPE = {
//   "image/png": "png",
//   "image/jpeg": "jpg",
//   "image/jpg": "jpg"
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let error = null;
//     if (!MIME_TYPE[file.mimetype]) {
//       error = new Error("invalid mime type");
//     }

//     cb(error, "images");
//   },
//   filename: (req, file, cb) => {
//     const name = file.originalname
//       .toLocaleLowerCase()
//       .split(" ")
//       .join("-");
//     const ext = MIME_TYPE[file.mimetype];
//     cb(null, name + "-" + Date.now() + "." + ext);
//   }
// });

// module.exports = multer({ storage: storage }).single("image");
