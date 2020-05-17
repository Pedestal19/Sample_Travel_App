const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const GeoNamesAPI = 'api.geonames.org/postalCodeSearchJSON?';
const darkSkyAPI = 'api.darksky.net/forecast';
const pixabayAPI = 'pixabay.com/api';
//using axios as my promise based http client
const axios = require('axios');
const geoNamesAPIUsername = process.env.GeoNamesApiUsername;
const pixaBayAPIKey = process.env.PixaBayApiKey;
const appRunningOnPort = process.env.PORT;
const darkSkyApiKey = process.env.darkSkyApiKey;
const geonamesAPIRoute = '/geoNames';
const darkSkyAPIRoute = '/darkSky';
const pixaBayAPIRoute = '/pixabay';
const noResultsError = 'no results';
const websiteDir = 'dist';


app.use(bodyParser.json());
app.use(cors());
app.use(express.static(websiteDir));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


// search geonames using zipcode
const getDataFromGeoNamesApi = async (username, postalCodeOrCity = '07101') => {

  const cityOrPostal = getCityOrPostalCode(postalCodeOrCity);
  const url = `http://${GeoNamesAPI}${cityOrPostal}&maxRows=10&username=${username}`;
  return axios.get(url).then(response => {
    return response.data.postalCodes[0];
  });

};

// get city or postalcode
const getCityOrPostalCode = postalCodeOrCity => {
  if (/\d/.test(postalCodeOrCity.value)) {
    return 'postalcode=' + postalCodeOrCity;
  } else {
    // Otherwise we simply expect it to be a city, and as above, do validation here if you want to
    return 'placename=' + postalCodeOrCity;
  }
};

//Endpoint for geoNames 
app.get(geonamesAPIRoute, (req, res) => {
  const zip = req.query.zip;
  getDataFromGeoNamesApi(geoNamesAPIUsername, zip).then(response => {
    res.end(JSON.stringify(response));
  });
});

// search darksky using lon and lat
const getDataFromDarkSkyApi = async (key, lat, long, time) => {
  
  const url = `https://${darkSkyAPI}/${key}/${lat},${long},${time}`;

  return await axios.get(url).then(response => {
    return response.data.daily.data[0];
  });

};

//Endpoint for darkSky 
app.get(darkSkyAPIRoute, (req, res) => {
  const time = req.query.time;
  const lat = req.query.latitude;
  const long = req.query.longitude;

  getDataFromDarkSkyApi(darkSkyApiKey, lat, long, time).then(response => {
    res.end(JSON.stringify(response));
  });
});

//Pixabay API
const getDataFromPixabayApi = async (myPixabayApiKey, picture) => {
  // data to call pixabay api
  const url = `https://${pixabayAPI}/?key=${myPixabayApiKey}&q=${picture}`;

  return await axios.get(url).then(response => {
    if (response.data.totalHits != 0) {
      return response.data.hits[0].largeImageURL;
    } else {
      return { error: noResultsError };
    }
  });

};

// Endpoint for Pixabay
app.get(pixaBayAPIRoute, (req, res) => {
  const pictureFromPixabayAPI = req.query.image;

  getDataFromPixabayApi(pixaBayAPIKey, pictureFromPixabayAPI).then(response => {
    res.end(JSON.stringify(response));
  });

});


// travel agency app is listening on this port
app.listen(appRunningOnPort, () => {
  console.log(`The Travel Agency App Runnin On ${appRunningOnPort}`);
});

module.exports = app;
