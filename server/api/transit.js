const express = require("express");
const router = express.Router();
const axios = require("axios");
const cache = require("./cache");
const {
    fetchRoutes,
    checkForAPIError,
    formatTransitResponse,
} = require("./helper-functions");
require("dotenv").config();

router.post("/", async (req, res, next) => {
    try {
        const { data } = req.body;

        // Get employeees and clients
        const employees = data.filter((item) => item.type === "employee");
        const clients = data.filter((item) => item.type === "client");

        // Gets back an array of all route promises, whether they are in the cache or from Google API
        const routesToProcess = await fetchRoutes(employees, clients, cache);

        // Process all promises concurrently so we don't have to wait for each
        await Promise.all(
            routesToProcess.map((entry) => entry.routePromise),
        ).then((contents) => {
            const dataWithRouteInfo = routesToProcess.reduce(
                (acc, empCliMapping, i) => {
                    const { empId, cliId, hashKey, wasInCache } = empCliMapping;

                    let [travelTime, travelDistance] = ["", ""];

                    // If route was not in cache, we have work to do
                    if (!wasInCache) {
                        const apiData = contents[i].data;

                        // Check for errors from Google API
                        checkForAPIError(
                            apiData,
                            employees,
                            empId,
                            clients,
                            cliId,
                        );

                        // Retrieve duration and distance, parse values in correct format
                        const { duration, distance } =
                            apiData.routes[0].legs[0];

                        travelTime = parseFloat(
                            (duration.value / 60).toFixed(2),
                        );
                        travelDistance = parseFloat(distance.value.toFixed(2));

                        // Write this information to the cache
                        cache.write(
                            hashKey,
                            `${travelTime}%20${travelDistance}`,
                        );
                    } else {
                        // If we had this information in the cache, we can just pull it in the correct format
                        [travelTime, travelDistance] = contents[i]
                            .split("%20")
                            .map((val) => parseFloat(val));
                    }

                    // Push final values into return array
                    acc.push({
                        empId,
                        cliId,
                        travelTime,
                        travelDistance,
                    });

                    return acc;
                },
                [],
            );

            // Send back the map of employees to clients with travel info
            const employeeClientMap = formatTransitResponse(dataWithRouteInfo);
            res.send(employeeClientMap);
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
