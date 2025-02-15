const express = require("express");
const cors = require("cors");
const axios = require ("axios");
require("dotenv").config();


const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());

app.get('/api/search:query',async (req, res) => {
    try {
        const query = req.params.query;
        const result = await axios (`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${process.env.API_KEY}`);

        const data = result.data
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

app.listen(PORT, () => console.log( `Started on port: ${PORT}`));