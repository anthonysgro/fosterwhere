function addressNotFound({ name, address }) {
    error = Error(
        `Google Maps API was not able to parse the following address belonging to ${name}:\n ${address}. Try removing any irregularities with this address and test on https://www.google.com/maps/`,
    );
    error.status = 400;
    throw error;
}

module.exports = addressNotFound;
