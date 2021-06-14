const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const setDelay = (cb, timeout = 0) =>
    new Promise((resolve) => {
        setTimeout(() => {
            cb();
            resolve();
        }, timeout);
    });

router.post("/", async (req, res, next) => {
    try {
        const { data } = req.body;

        // Get employeees and clients
        const employees = data.filter((item) => item.type === "employee");
        const clients = data.filter((item) => item.type === "client");

        // Create an array of promises so we can process all at the same time
        let routesToProcess = [];
        for (const employee of employees) {
            const employeeAddressFormatted = employee.address.replace(
                / /g,
                "%20",
            );

            for (const client of clients) {
                const { method } = employee;
                await setDelay(() => {
                    let routePromise = null;

                    if (method === "driving" || method === "walking") {
                        routePromise = axios.get(
                            `http://dev.virtualearth.net/REST/V1/Routes/${method}?wp.0=${employee.latitude},${employee.longitude}&wp.1=${client.latitude},${client.longitude}&dateTime=12:00:00&distanceUnit=mi&output=json&key=${process.env.BING_MAPS_KEY}`,
                        );
                    } else if (method === "transit") {
                        const clientAddressFormatted = client.address.replace(
                            / /g,
                            "%20",
                        );

                        routePromise = axios.get(
                            `http://dev.virtualearth.net/REST/V1/Routes/${method}?wp.0=${employeeAddressFormatted}&wp.1=${clientAddressFormatted}&dateTime=12:00:00&distanceUnit=mi&output=json&key=${process.env.BING_MAPS_KEY}`,
                        );
                    }

                    routesToProcess.push({
                        empId: employee.id,
                        cliId: client.id,
                        routePromise,
                    });
                }, 5);
            }
        }

        // http://dev.virtualearth.net/REST/v1/Routes/{travelMode}?wayPoint.1={wayPoint1}&viaWaypoint.2={viaWaypoint2}&waypoint.3={waypoint3}&wayPoint.n={waypointN}&heading={heading}&optimize={optimize}&avoid={avoid}&distanceBeforeFirstTurn={distanceBeforeFirstTurn}&routeAttributes={routeAttributes}&timeType={timeType}&dateTime={dateTime}&maxSolutions={maxSolutions}&tolerances={tolerances}&distanceUnit={distanceUnit}&key={BingMapsKey}

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
