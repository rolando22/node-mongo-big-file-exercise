const express = require('express');
const multer = require('multer');
const { upload, list } = require('./controller');
const { validateFile, validateFileType } = require('./middlewares');

const router = express.Router();
const uploadFile = multer({ dest: './_temp' });

router.post('/upload', uploadFile.single('file'), validateFile, validateFileType('csv'), upload);
router.get('/records', list);

module.exports = router;
