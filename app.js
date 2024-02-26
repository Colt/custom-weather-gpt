const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

// Replace 'YOUR_API_KEY' with your actual AccuWeather API key
const apiKey = process.env.key;
const autocompleteBaseUrl =
  "http://dataservice.accuweather.com/locations/v1/cities/autocomplete";
const currentConditionsBaseUrl =
  "http://dataservice.accuweather.com/currentconditions/v1";

app.get("/locations", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Query parameter q is required" });
    }

    const response = await axios.get(autocompleteBaseUrl, {
      params: {
        apikey: apiKey,
        q: q,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("API call failed:", error);
    res.status(500).json({ message: "Failed to fetch locations" });
  }
});

// New route for current weather conditions
app.get("/currentweather/:location", async (req, res) => {
  try {
    const { location } = req.params;
    if (!location) {
      return res
        .status(400)
        .json({ message: "Location parameter is required" });
    }

    const response = await axios.get(
      `${currentConditionsBaseUrl}/${location}`,
      {
        params: {
          apikey: apiKey,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("API call failed:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res
        .status(error.response.status)
        .json({ message: error.response.data.Message });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).json({ message: "No response received from the API" });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ message: "Error making request to the API" });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
