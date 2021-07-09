const axios = require("axios");
const setDelay = require("./setDelay");

async function fetchRoutes(employees, clients, cache) {
    // Create an array of promises so we can process all at the same time
    let routesToProcess = [];
    for (const employee of employees) {
        for (const client of clients) {
            const { method } = employee;

            // Create a hash key with the locations and the method of travel
            const hashKey = `${employee.latitude}-${employee.longitude}-${client.latitude}-${client.longitude}-${method}`;

            // If the cache doesn't have this information
            if (!cache.has(hashKey)) {
                await setDelay(() => {
                    let routePromise = null;

                    routePromise = axios.get(
                        `https://maps.googleapis.com/maps/api/directions/json?origin=${employee.latitude},${employee.longitude}&destination=${client.latitude},${client.longitude}&mode=${method}&departure_time=now&key=${process.env.GOOGLE_DIRECTIONS_KEY}`,
                    );

                    routesToProcess.push({
                        empId: employee.id,
                        cliId: client.id,
                        routePromise,
                        wasInCache: false,
                        hashKey,
                    });
                }, 25);
            } else {
                routesToProcess.push({
                    empId: employee.id,
                    cliId: client.id,
                    routePromise: new Promise((res) => {
                        res(cache.read(hashKey));
                    }),
                    wasInCache: true,
                    hashKey,
                });
            }
        }
    }

    return routesToProcess;
}

module.exports = fetchRoutes;
