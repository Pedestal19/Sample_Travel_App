// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors())


// Initialize the main project folder
const siteFolder = 'website';
app.use(express.static(siteFolder));

//Get Endpoint
const getUrl = '/myapi/v1';
app.get(getUrl, (request, response) => {
    response.send(projectData)
})

const postUrl = '/myapi/v1';


app.post(postUrl, (request, response) => {
    const {date, temperature, weatherResponse} = request.body
    projectData[date] = {temperature,weatherResponse,}
    response.send("resource created/record saved")
})


// Setup Server
const port = 7778;
app.listen(port, () => {
    console.log(`Running Node Server on Port: ${port}`)
})