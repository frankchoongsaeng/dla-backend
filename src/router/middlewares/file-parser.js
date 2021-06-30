const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "temp/images" }).single('image');
const uploads = multer({ dest: "temp/images" }).single('images');

// parse single images
router.use((req, res, next) => {

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ "error": "field name for uploading images must be 'image'" });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ "error": "There was a problem with your upload, we could not process your file." });
    }

    next();

  })
})

// parse multiple images
router.use((req, res, next) => {

  uploads(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ "error": "field name for uploading images must be 'image'" });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ "error": "There was a problem with your upload, we could not process your file." });
    }

    next();
  })
})


module.exports = router;