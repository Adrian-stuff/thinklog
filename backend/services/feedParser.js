const Parser = require('rss-parser');
const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'content:encoded', 'description']
  }
});

const parseFeed = async (url) => {
  try {
    const feed = await parser.parseURL(url);
    return feed;
  } catch (error) {
    console.error(`Error parsing feed from ${url}:`, error.message);
    return null;
  }
};

module.exports = {
  parseFeed
};
