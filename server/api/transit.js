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

        const origins = [
            ...employees.map(({ latitude, longitude }) => {
                return { latitude, longitude };
            }),
        ];

        const destinations = [
            ...clients.map(({ latitude, longitude }) => {
                return { latitude, longitude };
            }),
        ];

        // Make api call to bing
        let employeeMap = {};
        for (const employee of employees) {
            employeeMap[employee.id] = {};
            for (const client of clients) {
                const { data: response } = await axios.get(
                    `http://dev.virtualearth.net/REST/V1/Routes?wp.0=${employee.latitude},${employee.longitude}&wp.1=${client.latitude},${client.longitude}&dateTime=12:00:00&distanceUnit=mi&output=json&key=${process.env.BING_MAPS_KEY}`,
                );

                // Extract relevant data from request
                const {
                    travelDurationTraffic,
                    travelDuration,
                    travelDistance,
                } = response.resourceSets[0].resources[0];

                // Format our return object
                employeeMap[employee.id][client.id] = {
                    travelTime: parseFloat((travelDuration / 60).toFixed(2)),
                    travelTimeTraffic: parseFloat(
                        (travelDurationTraffic / 60).toFixed(2),
                    ),
                    travelDistance: parseFloat(travelDistance.toFixed(2)),
                };
            }
        }

        // Send back the map of employees to clients with travel info
        res.send(employeeMap);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
