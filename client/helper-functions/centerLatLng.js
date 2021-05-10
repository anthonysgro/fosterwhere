function centerLatLng(arr) {
    const latitudes = [...arr.map(({ latitude }) => latitude)];
    const longitudes = [...arr.map(({ longitude }) => longitude)];

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    return { lat: centerLat, lng: centerLng };
}

export default centerLatLng;
