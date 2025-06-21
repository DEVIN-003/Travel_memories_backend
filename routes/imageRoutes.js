const express = require('express');
const router = express.Router();
const drive = require('../config/googleDriveConfig');

router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    res.setHeader('Content-Type', 'image/jpeg'); // Adjust based on your file types

    file.data
      .on('end', () => console.log(`✅ Sent file ${fileId}`))
      .on('error', (err) => console.error(`❗ Error streaming file ${fileId}:`, err))
      .pipe(res);

  } catch (error) {
    console.error(`❗ Error fetching image ${req.params.fileId}:`, error.message);
    res.status(500).send('Failed to fetch image.');
  }
});

module.exports = router;
