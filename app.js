const express = require("express");
const path = require("path")
const app = express();
const axios = require("axios")
const cookieParser = require("cookie-parser")
const {
    v4: uuidv4
} = require('uuid');
require("dotenv").config()

app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cookieParser())
async function fetchStockData(ticker, api_token) {
    const response = await fetch(`https://api.stockdata.org/v1/data/quote?symbols=${ticker}&api_token=${api_token}`);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
}

app.get("/data", async (req, res) => {
    const ticker = req.query.ticker
    const response = await axios.get(`https://api.stockdata.org/v1/data/quote?symbols=${ticker}&api_token=${process.env.API_KEY}`)

    res.send(response.data.data[0])
})

app.use("/", (req, res) => {
    let cookies = req.cookies
    let isCookie = false
    Object.keys(cookies).forEach(function (key) {
        if (key.includes("stats")) {
            isCookie = key
        }
    });
    if (isCookie) {
        console.log(cookies[isCookie])
    } else {
        res.cookie(`stats_${uuidv4()}`, "0/0", {
            expires: new Date('01 12 2040'),
        });
    }
    console.log(cookies)
    res.render("home")
})


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("Serving on port 3000");
});