const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const scraperService = require('../services/scraper/scraper');
const Item = require('../models/Item');

// @route   POST api/scrape
// @desc    Scrape a URL and save the content
// @access  Private
router.post('/', [
  auth,
  check('url', 'Valid URL is required').isURL(),
  check('collection', 'Collection name is required').not().isEmpty()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { url, collection, useJavaScript = false, tags = [] } = req.body;

  try {
    // Convert URL to CSSBuy format if needed
    const linkConverter = require('../utils/linkConverter');
    
    // Validate URL
    if (!linkConverter.isValidUrl(url)) {
      return res.status(400).json({ 
        message: 'Invalid URL: Not a supported e-commerce or agent URL' 
      });
    }
    
    // Convert to CSSBuy URL
    const convertedUrl = url.includes('cssbuy.com') ? url : linkConverter.toCssBuyUrl(url);
    
    if (!convertedUrl) {
      return res.status(400).json({ 
        message: 'Could not convert URL to CSSBuy format' 
      });
    }
    
    // Check if URL has already been scraped by this user
    const existingItem = await Item.findOne({ 
      user: req.user.id, 
      $or: [
        { sourceUrl: url },
        { originalUrl: url },
        { convertedUrl: convertedUrl }
      ],
      collection
    });

    if (existingItem) {
      return res.status(400).json({ 
        message: 'This URL has already been scraped and saved to this collection' 
      });
    }

    // Scrape the URL
    const scrapedContent = await scraperService.scrapeUrl(url, useJavaScript);

    // Create new item
    const item = new Item({
      ...scrapedContent,
      user: req.user.id,
      collection,
      tags,
      originalUrl: url,
      convertedUrl: convertedUrl
    });

    // Save to database
    await item.save();

    res.json(item);
  } catch (err) {
    console.error('Scraping error:', err.message);
    res.status(500).json({ message: 'Scraping failed', error: err.message });
  }
});

// @route   GET api/scrape
// @desc    Get all scraped items for the user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/scrape/collections/:collection
// @desc    Get all items in a specific collection
// @access  Private
router.get('/collections/:collection', auth, async (req, res) => {
  try {
    const items = await Item.find({ 
      user: req.user.id,
      collection: req.params.collection 
    }).sort({ createdAt: -1 });
    
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/scrape/:id
// @desc    Get a specific scraped item
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    // Check if item exists
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if user owns the item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(item);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/scrape/:id
// @desc    Delete a scraped item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    // Check if item exists
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if user owns the item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await item.remove();
    
    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/scrape/:id/favorite
// @desc    Toggle favorite status of an item
// @access  Private
router.put('/:id/favorite', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    // Check if item exists
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if user owns the item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Toggle favorite status
    item.isFavorite = !item.isFavorite;
    
    await item.save();
    
    res.json(item);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;