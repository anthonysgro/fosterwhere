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
            for (const client of clients) {
                const { method } = employee;

                await setDelay(() => {
                    let routePromise = null;

                    routePromise = axios.get(
                        `https://maps.googleapis.com/maps/api/directions/json?origin=${employee.latitude},${employee.longitude}&destination=${client.latitude},${client.longitude}&mode=${method}&departure_time=now&key=${process.env.GOOGLE_DIRECTIONS_KEY}`,
                    );

                    routesToProcess.push({
                        empId: employee.id,
                        cliId: client.id,
                        routePromise,
                    });
                }, 5);
            }
        }

        // Process all promises concurrently so we don't have to wait for each
        let newData = [];
        await Promise.all(
            routesToProcess.map((entry) => entry.routePromise),
        ).then((contents) => {
            console.log("\n################\n#############\n#############\n");

            newData = routesToProcess.reduce((acc, cur, i) => {
                const { duration, distance } =
                    contents[i].data.routes[0].legs[0];

                // Convert from seconds to correct format
                acc.push({
                    empId: cur.empId,
                    cliId: cur.cliId,
                    travelTime: parseFloat((duration.value / 60).toFixed(2)),
                    travelDistance: parseFloat(distance.value.toFixed(2)),
                });

                return acc;
            }, []);
        });

        // Change that to the format we want
        let finalObj = {};
        for (const entry of newData) {
            const { empId, cliId, travelTime, travelDistance } = entry;

            if (finalObj.hasOwnProperty(empId)) {
                finalObj[empId][cliId] = {
                    travelTime,
                    travelDistance,
                };
            } else {
                finalObj[empId] = {
                    [cliId]: {
                        travelTime,
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
