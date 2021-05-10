const express = require("express");
const router = express.Router();
const nodeGeocoder = require("node-geocoder");

router.put("/", async (req, res, next) => {
    try {
        const { data } = req.body;
        console.log(data);

        // const googleOptions = {
        //     provider: "google",
        //     apiKey: "AIzaSyAg3q9ru_1Y0cao5BzS-b5PfFVVa6fUppA",
        // };

        const openCageOptions = {
            provider: "opencage",
            apiKey: "0efd946069d24aa1a8b194dc6045ebf5",
        };

        const geoCoder = nodeGeocoder(openCageOptions);

        let geocodedData = [];
        for (const dataItem of data) {
            // This now works, but we are going to use fake data for now
            const { latitude, longitude } = (
                await geoCoder.geocode(dataItem.address)
            )[0];
            geocodedData.push({ ...dataItem, latitude, longitude });
        }

        // console.log(geocodedData);
        return geocodedData;
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
