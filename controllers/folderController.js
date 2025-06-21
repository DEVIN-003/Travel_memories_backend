const { google } = require('googleapis');
const drive = require('../config/googleDriveConfig');

exports.listFolders = async (req, res) => {
  try {
    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: 'files(id, name)',
    });

    const folders = response.data.files;
    res.json(folders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
};

exports.deleteFolder = async (req, res) => {
  const folderId = req.params.folderId;

  try {
    // Move the folder to trash (recommended) OR permanently delete using `drive.files.delete`
    await drive.files.update({
      fileId: folderId,
      requestBody: {
        trashed: true,
      },
    });

    res.json({ message: 'Folder deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete folder' });
  }
};
