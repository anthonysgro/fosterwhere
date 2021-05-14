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

            // push in promises for each entry, will resolve concurrently later
            const latLngPromise = geoCoder.geocode(dataItem.address);

            geocodedData.push({
                id: i,
                ...dataItem,
                latLngPromise,
            });
        }

        // Resolve all requests concurrently so it doesn't take very long!
        let newData = [];
        await Promise.all(geocodedData.map((entry) => entry.latLngPromise))
            .then((contents) => {
                newData = geocodedData.reduce((arr, cur, i) => {
                    const { latitude, longitude } = contents[i][0];

                    // Remove the promise
                    arr.push({
                        id: cur.id,
                        name: cur.name,
                        address: cur.address,
                        type: cur.type,
                        method: cur.method,
                        latitude,
                        longitude,
                    });

                    return arr;
                }, []);
            })
            .catch((err) => console.log("something happened in geocode route"));

        res.send(newData);
    } catch (err) {
        // console.error(err);
        next(err);
    }
});

module.exports = router;
