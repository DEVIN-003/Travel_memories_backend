const express = require('express');
const { listFolders, deleteFolder } = require('../controllers/folderController');

const router = express.Router();

router.get('/', listFolders);               // GET /api/folders -> List all folders
router.delete('/:folderId', deleteFolder);  // DELETE /api/folders/:folderId -> Delete folder by ID

module.exports = router;
