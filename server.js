const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const uploadRoutes = require('./routes/uploadRoutes');
const folderRoutes = require('./routes/folderRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const imageRoutes = require('./routes/imageRoutes'); // ✅ Added

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/upload', uploadRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/image', imageRoutes); // ✅ Added

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
