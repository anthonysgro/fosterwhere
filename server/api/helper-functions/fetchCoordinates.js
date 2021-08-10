const nodeGeocoder = require("node-geocoder");
const setDelay = require("./setDelay");
const parseAddress = require("./parseAddress");

async function fetchCoordinates(data, cache) {
    const googleOptions = {
        provider: "google",
        apiKey: process.env.GOOGLE_KEY,
    };

    const geoCoder = nodeGeocoder(googleOptions);

    let geocodedData = [];

    for (let i = 0; i < data.length; i++) {
        const address = parseAddress(data[i].address);
        data[i].address = address;

        const hashKey = `${address}`;

        // Fetch Latitude and Longitude from either Google API or Cache
        let [latLngPromise, wasInCache] = [null, false];
        if (!cache.has(hashKey)) {
            await setDelay(() => {
                latLngPromise = geoCoder.geocode(address);
            }, 25);
        } else {
            latLngPromise = new Promise((res) => {
                res(cache.read(hashKey));
            });
            wasInCache = true;
        }

        // Push in data to geocoder
        geocodedData.push({
            id: i,
            ...data[i],
            latLngPromise,
            hashKey,
            wasInCache,
        });
    }

    return geocodedData;
}

module.exports = fetchCoordinates;
