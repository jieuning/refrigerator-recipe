const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, 'views')));

app.get('/api/basic', async (req, res) => {
    const apiUrl = `	http://211.237.50.150:7080/openapi/${process.env.API_KEY}/json/Grid_20150827000000000226_1/1/5`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        res.json(data); 
    } catch (error) {
        console.error('에러', error.message);
    }
});

app.get('/api/ingredient', async (req, res) => {
    const apiUrl = `http://211.237.50.150:7080/openapi/${process.env.API_KEY}/json/Grid_20150827000000000227_1/1/5`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        res.json(data); 
    } catch (error) {
        console.error('에러', error.message);
    }
});

app.get('/api/recipe', async (req, res) => {
    const apiUrl = `http://211.237.50.150:7080/openapi/${process.env.API_KEY}/json/Grid_20150827000000000228_1/1/5`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        res.json(data); 
    } catch (error) {
        console.error('에러', error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});