const { Readable } = require('stream');
const drive = require('../config/googleDriveConfig');

// Convert buffer to readable stream
function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

// Set file permission to public
async function makeFilePublic(fileId) {
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });
}

exports.uploadToNewFolder = async (req, res) => {
  try {
    const folderName = req.body.folderName;
    if (!folderName) return res.status(400).json({ error: 'Folder name is required' });

    // 1️⃣ Create folder
    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };
    const folder = await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id',
    });
    const folderId = folder.data.id;

    // 2️⃣ Upload files to that folder (parallel upload)
    const uploadPromises = req.files.map(async (file) => {
      const fileMetadata = {
        name: file.originalname,
        parents: [folderId],
      };

      const media = {
        mimeType: file.mimetype,
        body: bufferToStream(file.buffer),
      };

      const uploadedFile = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id, name',
      });

      await makeFilePublic(uploadedFile.data.id);

      return {
        id: uploadedFile.data.id,
        name: uploadedFile.data.name,
        viewUrl: `https://drive.google.com/file/d/${uploadedFile.data.id}/view`,
        thumbnail: `https://drive.google.com/uc?export=view&id=${uploadedFile.data.id}`,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    res.status(200).json({
      message: 'Folder and files uploaded successfully',
      folderId,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('Upload to New Folder Error:', error);
    res.status(500).json({ error: 'Failed to upload to new folder', details: error.message });
  }
};

exports.uploadToExistingFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    if (!folderId) return res.status(400).json({ error: 'Folder ID is required' });

    const uploadPromises = req.files.map(async (file) => {
      const fileMetadata = {
        name: file.originalname,
        parents: [folderId],
      };

      const media = {
        mimeType: file.mimetype,
        body: bufferToStream(file.buffer),
      };

      const uploadedFile = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id, name',
      });

      await makeFilePublic(uploadedFile.data.id);

      return {
        id: uploadedFile.data.id,
        name: uploadedFile.data.name,
        viewUrl: `https://drive.google.com/file/d/${uploadedFile.data.id}/view`,
        thumbnail: `https://drive.google.com/uc?export=view&id=${uploadedFile.data.id}`,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    res.status(200).json({
      message: 'Files uploaded to existing folder successfully',
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('Upload to Existing Folder Error:', error);
    res.status(500).json({ error: 'Failed to upload to existing folder', details: error.message });
  }
};
