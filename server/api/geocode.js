const express = require("express");
const router = express.Router();
const { fetchCoordinates } = require("./helper-functions");
const cache = require("./cache");
require("dotenv").config();

router.put("/", async (req, res, next) => {
    try {
        const locationData = req.body.data;

        const geocodedData = await fetchCoordinates(locationData, cache);

        // Resolve all requests concurrently so it doesn't take very long!
        await Promise.all(geocodedData.map((entry) => entry.latLngPromise))
            .then((contents) => {
                const newData = geocodedData.reduce((arr, cur, i) => {
                    const { wasInCache, hashKey } = cur;

                    let [latitude, longitude] = ["", ""];

                    if (!wasInCache) {
                        [latitude, longitude] = [
                            contents[i][0].latitude,
                            contents[i][0].longitude,
                        ];

                        // Write this information to the cache
                        cache.write(hashKey, `${latitude}%20${longitude}`);
                    } else {
                        [latitude, longitude] = contents[i]
                            .split("%20")
                            .map((val) => parseFloat(val));
                    }

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

                res.send(newData);
            })
            .catch((err) => next(err));
    } catch (err) {
        // console.error(err);
        next(err);
    }
});

module.exports = router;
