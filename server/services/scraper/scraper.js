const cheerio = require('cheerio');
const axios = require('axios');
const puppeteer = require('puppeteer');

/**
 * Scraper service for extracting content from websites
 * Supports both static websites (using Cheerio) and JavaScript-rendered sites (using Puppeteer)
 */
const linkConverter = require('../../utils/linkConverter');

class ScraperService {
  /**
   * Scrape content from a URL
   * @param {string} url - The URL to scrape
   * @param {boolean} useJavaScript - Whether to use Puppeteer for JavaScript-rendered content
   * @returns {Promise<Object>} - The scraped content
   */
  async scrapeUrl(url, useJavaScript = false) {
    try {
      // Check if URL is valid for conversion
      if (!linkConverter.isValidUrl(url)) {
        throw new Error('Invalid URL: Not a supported e-commerce or agent URL');
      }
      
      // Convert to CSSBuy URL if it's not already
      const cssBuyUrl = url.includes('cssbuy.com') ? url : linkConverter.toCssBuyUrl(url);
      
      if (!cssBuyUrl) {
        throw new Error('Could not convert URL to CSSBuy format');
      }
      
      let html;
      
      if (useJavaScript) {
        html = await this.getHtmlWithPuppeteer(cssBuyUrl);
      } else {
        const response = await axios.get(cssBuyUrl);
        html = response.data;
      }
      
      // Store both the original and converted URL
      const result = this.extractContent(html, cssBuyUrl);
      result.originalUrl = url;
      result.convertedUrl = cssBuyUrl;
      
      return result;
    } catch (error) {
      console.error('Error scraping URL:', error);
      throw new Error(`Failed to scrape URL: ${error.message}`);
    }
  }
  
  /**
   * Get HTML content using Puppeteer (for JavaScript-rendered websites)
   * @param {string} url - The URL to scrape
   * @returns {Promise<string>} - The HTML content
   */
  async getHtmlWithPuppeteer(url) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
      const html = await page.content();
      return html;
    } finally {
      await browser.close();
    }
  }
  
  /**
   * Extract content from HTML
   * @param {string} html - The HTML content
   * @param {string} sourceUrl - The source URL
   * @returns {Object} - The extracted content
   */
  extractContent(html, sourceUrl) {
    const $ = cheerio.load(html);
    const domain = new URL(sourceUrl).hostname;
    
    // Extract basic metadata
    const title = $('title').text().trim() || $('h1').first().text().trim();
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || 
                       this.extractDescription($);
    
    // Extract images
    const images = this.extractImages($, sourceUrl);
    
    // Extract price if available
    const price = this.extractPrice($);
    
    // Extract additional details
    const details = this.extractDetails($);
    
    return {
      title,
      description,
      images,
      price,
      details,
      sourceUrl,
      domain,
      scrapedAt: new Date().toISOString()
    };
  }
  
  /**
   * Extract description from HTML
   * @param {CheerioStatic} $ - Cheerio instance
   * @returns {string} - The extracted description
   */
  extractDescription($) {
    // Try different common selectors for description
    const possibleSelectors = [
      'p.description',
      '.product-description',
      '#description',
      'div[itemprop="description"]',
      '.summary',
      'article p:first-of-type'
    ];
    
    for (const selector of possibleSelectors) {
      const text = $(selector).text().trim();
      if (text) return text;
    }
    
    // Fallback to first paragraph with reasonable length
    const paragraphs = $('p').filter((_, el) => {
      const text = $(el).text().trim();
      return text.length > 50 && text.length < 1000;
    });
    
    return paragraphs.first().text().trim() || '';
  }
  
  /**
   * Extract images from HTML
   * @param {CheerioStatic} $ - Cheerio instance
   * @param {string} baseUrl - The base URL for resolving relative paths
   * @returns {Array<string>} - Array of image URLs
   */
  extractImages($, baseUrl) {
    const images = new Set();
    const baseUrlObj = new URL(baseUrl);
    
    // Look for product images first
    $('img.product-image, div.product-gallery img, .product img, [itemprop="image"]').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
      if (src) images.add(this.resolveUrl(src, baseUrlObj));
    });
    
    // If no product images found, get all reasonably sized images
    if (images.size === 0) {
      $('img').each((_, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src');
        if (src && !src.includes('icon') && !src.includes('logo')) {
          // Check if image has width/height attributes and they're reasonably large
          const width = parseInt($(el).attr('width') || '0', 10);
          const height = parseInt($(el).attr('height') || '0', 10);
          
          if ((width === 0 && height === 0) || (width > 100 && height > 100)) {
            images.add(this.resolveUrl(src, baseUrlObj));
          }
        }
      });
    }
    
    return Array.from(images);
  }
  
  /**
   * Extract price from HTML
   * @param {CheerioStatic} $ - Cheerio instance
   * @returns {string|null} - The extracted price or null if not found
   */
  extractPrice($) {
    const priceSelectors = [
      '[itemprop="price"]',
      '.price',
      '.product-price',
      '#price',
      '.offer-price',
      'span.amount'
    ];
    
    for (const selector of priceSelectors) {
      const priceEl = $(selector).first();
      if (priceEl.length) {
        // Get content or text
        const price = priceEl.attr('content') || priceEl.text().trim();
        if (price) return price;
      }
    }
    
    // Try to find price using regex pattern in the HTML
    const priceRegex = /\$\s?[0-9]+(\.[0-9]{2})?/;
    const bodyText = $('body').text();
    const match = bodyText.match(priceRegex);
    
    return match ? match[0] : null;
  }
  
  /**
   * Extract additional details from HTML
   * @param {CheerioStatic} $ - Cheerio instance
   * @returns {Object} - Key-value pairs of additional details
   */
  extractDetails($) {
    const details = {};
    
    // Look for specification tables
    $('table.specifications, table.product-specs, .product-details table').each((_, table) => {
      $(table).find('tr').each((_, row) => {
        const key = $(row).find('th, td:first-child').text().trim();
        const value = $(row).find('td:last-child').text().trim();
        
        if (key && value) {
          details[key] = value;
        }
      });
    });
    
    // Look for definition lists
    $('dl.product-details, .specifications dl').each((_, dl) => {
      $(dl).find('dt').each((i, dt) => {
        const key = $(dt).text().trim();
        const value = $(dt).next('dd').text().trim();
        
        if (key && value) {
          details[key] = value;
        }
      });
    });
    
    return details;
  }
  
  /**
   * Resolve relative URL to absolute URL
   * @param {string} url - The URL to resolve
   * @param {URL} baseUrl - The base URL object
   * @returns {string} - The resolved URL
   */
  resolveUrl(url, baseUrl) {
    try {
      if (url.startsWith('//')) {
        return `${baseUrl.protocol}${url}`;
      }
      if (url.startsWith('/')) {
        return `${baseUrl.origin}${url}`;
      }
      if (!url.startsWith('http')) {
        return new URL(url, baseUrl.href).href;
      }
      return url;
    } catch (error) {
      return url; // Return original if parsing fails
    }
  }
}

module.exports = new ScraperService();