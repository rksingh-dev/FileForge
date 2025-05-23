const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const upload = multer({ dest: os.tmpdir() });

app.use(cors());

// Ensure temp directories exist
const tempDir = path.join(os.tmpdir(), 'pdf-compression');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

app.post('/compress-pdf', upload.single('pdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    try {
        const inputPath = req.file.path;
        const outputPath = path.join(tempDir, `compressed_${Date.now()}.pdf`);
        const compressionLevel = req.body.compressionLevel || 'screen'; // screen, ebook, printer, prepress

        // Map compression levels to Ghostscript settings
        const pdfSettings = {
            'light': 'printer',    // Better quality, less compression
            'medium': 'ebook',     // Balanced
            'high': 'screen'       // Maximum compression
        };

        const setting = pdfSettings[req.body.compressionLevel] || 'ebook';

        // Run Ghostscript command
        await new Promise((resolve, reject) => {
            exec(`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${setting} -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        // Send the compressed file
        res.download(outputPath, req.file.originalname, (err) => {
            // Cleanup files after sending
            fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath);
            }
        });

    } catch (error) {
        console.error('Compression error:', error);
        res.status(500).json({ error: 'PDF compression failed' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 