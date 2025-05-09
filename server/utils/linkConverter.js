/**
 * Link Converter Utility
 * Converts various e-commerce and agent links to CSSBuy links for scraping
 */

/**
 * Extract product ID from various URL formats
 * @param {string} url - The URL to extract ID from
 * @returns {string|null} - The extracted product ID or null if not found
 */
const extractProductId = (url) => {
  try {
    // Handle direct Taobao links
    if (url.includes('taobao.com')) {
      const idMatch = url.match(/id=(\d+)/i) || url.match(/item\/(\d+)/i);
      return idMatch ? idMatch[1] : null;
    }
    
    // Handle CSSBuy links
    if (url.includes('cssbuy.com')) {
      const idMatch = url.match(/item-(\d+)\.html/i);
      return idMatch ? idMatch[1] : null;
    }
    
    // Handle other agent links
    // CnFans, ACBuy, MuleBuy, etc.
    const idMatch = url.match(/[?&]id=(\d+)/i) || 
                   url.match(/product\/(\d+)/i) || 
                   url.match(/product_id=(\d+)/i) || 
                   url.match(/product\?id=(\d+)/i);
    
    return idMatch ? idMatch[1] : null;
  } catch (error) {
    console.error('Error extracting product ID:', error);
    return null;
  }
};

/**
 * Validate if a URL is a valid e-commerce or agent URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
const isValidUrl = (url) => {
  if (!url) return false;
  
  try {
    // Check if it's a valid URL
    new URL(url);
    
    // Check if it's from a supported platform
    const supportedDomains = [
      'taobao.com',
      'cssbuy.com',
      'cnfans.com',
      'acbuy.com',
      'mulebuy.com',
      'lovegobuy.com',
      'ponybuy.com',
      'allchinabuy.com',
      'hoobuy.com',
      'superbuy.com',
      'sugargoo.com',
      'basetao.com',
      'kameymall.com',
      'ezbuycn.com',
      'eastmallbuy.com',
      'hubbuycn.com',
      'joyagoo.com',
      'orientdig.com',
      'oopbuy.com',
      'sifubuy.com',
      'loongbuy.com',
      'kakobuy.com',
      'itaobuy.com'
    ];
    
    return supportedDomains.some(domain => url.includes(domain));
  } catch (error) {
    return false;
  }
};

/**
 * Convert any supported URL to a CSSBuy URL
 * @param {string} url - The URL to convert
 * @returns {string|null} - The converted CSSBuy URL or null if conversion failed
 */
const toCssBuyUrl = (url) => {
  const productId = extractProductId(url);
  
  if (!productId) {
    return null;
  }
  
  return `https://www.cssbuy.com/item-${productId}.html`;
};

/**
 * Convert multiple URLs to CSSBuy URLs
 * @param {Array<string>} urls - Array of URLs to convert
 * @returns {Array<Object>} - Array of conversion results with original URL, converted URL, and status
 */
const convertBulkUrls = (urls) => {
  return urls.map(url => {
    const isValid = isValidUrl(url);
    const convertedUrl = isValid ? toCssBuyUrl(url) : null;
    
    return {
      originalUrl: url,
      convertedUrl,
      isValid,
      isConvertible: !!convertedUrl
    };
  });
};

module.exports = {
  extractProductId,
  isValidUrl,
  toCssBuyUrl,
  convertBulkUrls
};