const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const linkConverter = require('../utils/linkConverter');

// @route   POST api/convert
// @desc    Convert a URL to CSSBuy format
// @access  Public
router.post('/', [
  check('url', 'Valid URL is required').isURL()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { url } = req.body;

  try {
    // Check if URL is valid for conversion
    if (!linkConverter.isValidUrl(url)) {
      return res.status(400).json({ 
        message: 'Invalid URL: Not a supported e-commerce or agent URL' 
      });
    }
    
    // Convert to CSSBuy URL
    const convertedUrl = linkConverter.toCssBuyUrl(url);
    
    if (!convertedUrl) {
      return res.status(400).json({ 
        message: 'Could not convert URL to CSSBuy format' 
      });
    }
    
    res.json({
      originalUrl: url,
      convertedUrl,
      isValid: true,
      isConvertible: true
    });
  } catch (err) {
    console.error('URL conversion error:', err.message);
    res.status(500).json({ message: 'Conversion failed', error: err.message });
  }
});

// @route   POST api/convert/bulk
// @desc    Convert multiple URLs to CSSBuy format
// @access  Public
router.post('/bulk', [
  check('urls', 'URLs array is required').isArray()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { urls } = req.body;

  try {
    // Convert all URLs
    const results = linkConverter.convertBulkUrls(urls);
    
    res.json({
      results,
      totalUrls: urls.length,
      successCount: results.filter(r => r.isConvertible).length
    });
  } catch (err) {
    console.error('Bulk URL conversion error:', err.message);
    res.status(500).json({ message: 'Bulk conversion failed', error: err.message });
  }
});

module.exports = router;