const drive = require('../config/googleDriveConfig');

exports.getGallery = async (req, res) => {
  try {
    const response = await drive.files.list({
      q: "mimeType contains 'image/' and trashed = false",
      fields: 'files(id, name, thumbnailLink, webViewLink)',
    });

    const files = response.data.files;

    const images = files.map(file => ({
      id: file.id,
      name: file.name,
      thumbnail: file.thumbnailLink, // (optional, for small thumbnails)
      viewUrl: file.webViewLink,     // (optional, opens in Google Drive)
      directLink: `https://drive.google.com/uc?export=view&id=${file.id}`, // ✅ Use if needed elsewhere
    }));

    res.json(images); // ✅ Return the array directly here
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
};
