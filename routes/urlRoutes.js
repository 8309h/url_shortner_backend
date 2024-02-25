// routes/urlRoutes.js

const express = require('express');

const router = express.Router();
const urlController = require('../controllers/urlController');
const authenticate = require('../middlewares/authentication');

// Route to create a short URL
router.post('/shorten', authenticate,urlController.createShortUrl);

// Route to redirect to the original URL
router.get('/:shortUrl', urlController.redirectToLongUrl);

//QR code genrete
router.post('/generateQR',urlController.generateQRCode);

module.exports = router;
