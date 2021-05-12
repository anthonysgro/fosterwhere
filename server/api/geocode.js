const express = require("express");
const router = express.Router();
const nodeGeocoder = require("node-geocoder");
require("dotenv").config();

router.put("/", async (req, res, next) => {
    try {
        const { data } = req.body;

        const googleOptions = {
            provider: "google",
            apiKey: process.env.GOOGLE_KEY,
        };

        // const openCageOptions = {
        //     provider: "opencage",
        //     apiKey: process.env.OPENCAGE_KEY,
        // };

        const geoCoder = nodeGeocoder(googleOptions);

        let geocodedData = [];
        let i = 0;
        for (const dataItem of data) {
            i++;
            // This now works, but we are going to use fake data for now
            const { latitude, longitude } = (
                await geoCoder.geocode(dataItem.address)
            )[0];

            geocodedData.push({ id: i, ...dataItem, latitude, longitude });
        }

        res.send(geocodedData);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
