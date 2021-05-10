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

        // Test Data
        const anthony = employees.map(({ latitude, longitude }) => {
            return { latitude, longitude };
        });
        // .filter((emp) => emp.name === "Anthony");

        const tamanna = clients.map(({ latitude, longitude }) => {
            return { latitude, longitude };
        });
        // .filter((emp) => emp.name === "Tamanna");

        console.log(anthony, tamanna);

        // Make api call to bing
        const { data: response } = await axios.get(
            `http://dev.virtualearth.net/REST/V1/Routes?wp.0=37.779160067439079,-122.42004945874214&wp.1=32.715685218572617,-117.16172486543655&dateTime=12:00:00&distanceUnit=mi&key=${process.env.BING_MAPS_KEY}`,
        );

        console.log(response);
        res.send(response);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
