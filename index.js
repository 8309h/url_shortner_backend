const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const { connection } = require('./configs/db');
const urlRouter = require('./routes/urlRoutes')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res)=> {
    res.send("Welcome to URL-Shortner")
})



const { RTMClient } = require('@slack/rtm-api');

// Initialize a new RTM client
const rtm = new RTMClient(process.env.SLACK_BOT_TOKEN);

// Listen for the 'message' event
rtm.on('message', async (event) => {
  try {
    // Check if the event is a message and has text
    if (event.type === 'message' && event.text) {
      // Extract long URLs from the message text
      const longUrls = extractLongUrlsFromMessage(event.text);

      // Generate short URLs for each long URL
      for (const longUrl of longUrls) {
        const shortUrl = await generateShortUrl(longUrl); // Call your URL shortening service
        // Respond back with the shortened URL
        await rtm.sendMessage(`Shortened URL for ${longUrl}: ${shortUrl}`, event.channel);
      }
    }
  } catch (error) {
    console.error('Error processing message:', error);
    // Handle errors gracefully
  }
});

// Function to extract long URLs from message text
function extractLongUrlsFromMessage(text) {
  
   
}

// Function to generate short URL from long URL
async function generateShortUrl(longUrl) {
  // Implement your logic to call your URL shortening service
   app.use('/url',urlRouter);
}

// Start the RTM client
(async () => {
  await rtm.start();
  console.log('Slack bot is running!');
})();

const Port = process.env.PORT || 8000; 

app.listen(Port, async () => {
    try {
        await connection;
        console.log("Connected to the DB");
    } catch (error) {
        console.log("Error connecting to DB:", error);
    }
    console.log(`Server running on port ${Port}`);
});
