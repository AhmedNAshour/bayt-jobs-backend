const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const { parseString } = require('xml2js');

const port = 3000;
const app = express();
dotenv.config();

//use cors
const cors = require('cors');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const geocodeCache = {}; // Cache for storing geocodes

app.get('/api/jobs', async (req, res) => {
  try {
    const response = await axios.get(
      'https://careers.moveoneinc.com/rss/all-rss.xml'
    );
    const xmlData = response.data;

    // Parse the XML data
    const parsedData = await new Promise((resolve, reject) => {
      parseString(xmlData, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // Get job items
    const jobItems = parsedData.rss.channel[0].item;

    // Geocode job locations (countries)
    const geocodedJobData = await Promise.all(
      jobItems.map(async (item) => {
        const country = item.country[0];

        // Check if the geocode is already in the cache
        if (geocodeCache[country]) {
          // Use the cached geocode
          return {
            title: item.title[0],
            link: item.link[0],
            description: item.description[0],
            country,
            category: item.category[0],
            posted_date: item.posted_date[0],
            location: geocodeCache[country],
          };
        } else {
          // Fetch the geocode from the Google Geocoding API
          const geocodingResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              country
            )}&key=${process.env.GOOGLE_MAPS_API_KEY}`
          );
          const geocodingData = geocodingResponse.data;
          const location = geocodingData.results[0].geometry.location;

          // Cache the geocode for future use
          geocodeCache[country] = location;

          // Combine geocoding data with job data
          return {
            title: item.title[0],
            link: item.link[0],
            description: item.description[0],
            country,
            category: item.category[0],
            posted_date: item.posted_date[0],
            location,
          };
        }
      })
    );
    const currentDatetime = new Date();
    console.log(`Request received at: ${currentDatetime}`);
    res.json(geocodedJobData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch or process data.' });
  }
});

app.listen(port, () => {
  console.log(`Bayt's app listening on port: ${port}`);
});
