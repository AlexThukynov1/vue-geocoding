const express = require("express");
const cors = require("cors");
require("dotenv").config();


const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());

app.use('/api/search:query', require("./routes/searchResults.js"))

app.listen(PORT, () => console.log( `Started on port: ${PORT}`));
