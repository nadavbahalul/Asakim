const AWS = require("aws-sdk");
const MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

exports.uploadImage = (image, uploadFolderName) => {
  return new Promise((resolve, reject) => {
    if (!image || !isValidMimeType(image)) {
      reject("inavlid image type");
    } else {
      const fileName = generateFileName(image);
      const s3bucket = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
      });

      let imagesPath = "images/" + uploadFolderName;

      if (process.env.isTestEnv) {
        imagesPath = "test_images/" + uploadFolderName;
      }

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imagesPath + fileName,
        Body: image.buffer,
        ContentType: image.mimetype,
        ACL: "public-read"
      };
      s3bucket.upload(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          const s3FileURL = process.env.AWS_Uploaded_File_URL_LINK;
          resolve({ imagePath: s3FileURL + imagesPath + fileName });
        }
      });
    }
  });
};

function generateFileName(imageFile) {
  var name = imageFile.originalname
    .toLocaleLowerCase()
    .split(" ")
    .join("-");
  const ext = MIME_TYPE[imageFile.mimetype];
  return name + "-" + Date.now() + "." + ext;
}

function isValidMimeType(imageFile) {
  return MIME_TYPE[imageFile.mimetype] !== null;
}
