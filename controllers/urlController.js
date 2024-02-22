
const URL = require('../models/urlModel');

async function createShortUrl(req, res) {
  const { longUrl } = req.body;

  try {
    let url = await URL.findOne({ longUrl });

    if (url) {
      res.json(url);
    } else {
      let shortCode;
      let isShortCodeUnique = false;

      // Generate a unique short code
      while (!isShortCodeUnique) {
        shortCode = generateShortUrl();
        const existingUrl = await URL.findOne({ shortUrl:shortCode});
        if (!existingUrl) {
          isShortCodeUnique = true;
        }
      }
      const shortUrl = shortCode;
      url = new URL({
        longUrl,
        shortUrl
      });

      // Save the URL document
      await url.save();

      // Return both the long URL and short URL in the response
      res.json({ longUrl: url.longUrl, shortUrl: url.shortUrl });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}
function generateShortUrl(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let shortUrl = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    shortUrl += characters.charAt(randomIndex);
  }
  return shortUrl;
}

// Controller to redirect to the original URL
async function redirectToLongUrl(req, res) {
  const shortCode = req.params.shortUrl;

  try {
    // Find the URL document by short code
    const url = await URL.findOne({shortCode}); 

    if (url) {
      // Redirect to the original URL
      res.redirect(url.longUrl);
    } else {
      res.status(404).send('URL not found');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  createShortUrl,
  redirectToLongUrl
};



// http://localhost:8080/url/redirect?shortUrl=5iScaj  => check in google
// https://join.slack.com/t/slack-seo1731/shared_invite/zt-2d1lgddk5-oru~2UsSq1wpDNxWY5Ba7g
//clinet id => 6667232878499.6680119475681
// clirnt secete = >dd7a91ef90821bf7ef1c784657a5801e
// signning => 680702d82888b8a3d7afc34d64d5ba8a
//haZFMBTsAdRkDIunF8OcL1P =>  verificationtoken