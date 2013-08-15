function handle_errors(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED: CSAPP.openModalViewAlert("user did not share geolocation data");
            break;
        case error.POSITION_UNAVAILABLE: CSAPP.openModalViewAlert("could not detect current position");
            break;
        case error.TIMEOUT: CSAPP.openModalViewAlert("retrieving position timed out");
            break;
        default: CSAPP.openModalViewAlert("unknown GPS error");
            break;
    }
}

function handle_geolocation_query(position) {
    LATITUDE = position.coords.latitude;
    LONGITUDE = position.coords.longitude;

    map.setView([LATITUDE, LONGITUDE], 14);
}
