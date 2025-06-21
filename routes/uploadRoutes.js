const express = require('express');
const multer = require('multer');
const { uploadToNewFolder, uploadToExistingFolder } = require('../controllers/uploadController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Final, consistent routes matching frontend
router.post('/new-folder', upload.array('files'), uploadToNewFolder);
router.post('/existing/:folderId', upload.array('files'), uploadToExistingFolder);

module.exports = router;
