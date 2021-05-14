const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/", async (req, res, next) => {
    try {
        const { data } = req.body;

        // Get employeees and clients
        const employees = data.filter((item) => item.type === "employee");
        const clients = data.filter((item) => item.type === "client");

        // Create an array of promises so we can process all at the same time
        let routesToProcess = [];
        for (const employee of employees) {
            for (const client of clients) {
                const routePromise = axios.get(
                    `http://dev.virtualearth.net/REST/V1/Routes?wp.0=${employee.latitude},${employee.longitude}&wp.1=${client.latitude},${client.longitude}&dateTime=12:00:00&distanceUnit=mi&output=json&key=${process.env.BING_MAPS_KEY}`,
                );

                routesToProcess.push({
                    empId: employee.id,
                    cliId: client.id,
                    routePromise,
                });
            }
        }

        // Process all promises concurrently so we don't have to wait for each
        let newData = [];
        await Promise.all(
            routesToProcess.map((entry) => entry.routePromise),
        ).then((contents) => {
            // Parse out the results we need
            newData = routesToProcess.reduce((acc, cur, i) => {
                const {
                    travelDurationTraffic,
                    travelDuration,
                    travelDistance,
                } = contents[i].data.resourceSets[0].resources[0];

                // Convert from seconds to correct format
                acc.push({
                    empId: cur.empId,
                    cliId: cur.cliId,
                    travelTime: parseFloat((travelDuration / 60).toFixed(2)),
                    travelTimeTraffic: parseFloat(
                        (travelDurationTraffic / 60).toFixed(2),
                    ),
                    travelDistance: parseFloat(travelDistance.toFixed(2)),
                });

                return acc;
            }, []);
        });

        // Change that to the format we want
        let finalObj = {};
        for (const entry of newData) {
            const {
                empId,
                cliId,
                travelTime,
                travelTimeTraffic,
                travelDistance,
            } = entry;

            if (finalObj.hasOwnProperty(empId)) {
                finalObj[empId][cliId] = {
                    travelTime,
                    travelTimeTraffic,
                    travelDistance,
                };
            } else {
                finalObj[empId] = {
                    [cliId]: {
                        travelTime,
                        travelTimeTraffic,
                        travelDistance,
                    },
                };
            }
        }

        // Send back the map of employees to clients with travel info
        res.send(finalObj);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
