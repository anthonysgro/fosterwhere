const express = require("express");
const router = express.Router();
const nodeGeocoder = require("node-geocoder");
const { setDelay } = require("./helper-functions");
require("dotenv").config();

router.put("/", async (req, res, next) => {
    try {
        const { data } = req.body;

        const googleOptions = {
            provider: "google",
            apiKey: process.env.GOOGLE_KEY,
        };

        const geoCoder = nodeGeocoder(googleOptions);

        let geocodedData = [];
        let i = 0;
        for (const dataItem of data) {
            // Sets a delay so we don't bombard google with too frequent requests
            await setDelay(() => {
                // push in promises for each entry, will resolve concurrently later
                const latLngPromise = geoCoder.geocode(dataItem.address);

                geocodedData.push({
                    id: i,
                    ...dataItem,
                    latLngPromise,
                });
            }, 25);
            i++;
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
                        group: parseInt(cur.group),
                        latitude,
                        longitude,
                    });

                    return arr;
                }, []);
            })
            .catch((err) => next(err));

        res.send(newData);
    } catch (err) {
        // console.error(err);
        next(err);
    }
});

module.exports = router;
