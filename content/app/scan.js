$("#button-scan").click(function () {
    if (CSAPP_ISBARCODESCANAVAILABLE)
        scanQRCode();
    else
        CSAPP.openModalViewAlert("The barcode scanner is not available");
});

function scanQRCode() {
    scanner.scan(
      scanSuccess(result),
      scanFail(error)
   );
}

function scanSuccess(result) {
    //temporary output - comment out and insert own code here
    CSAPP.openModalViewAlert("We got a barcode<br/>" +
                "Result: " + result.text + "<br/>" +
                "Format: " + result.format + "<br/>" +
                "Cancelled: " + result.cancelled);
}

function scanFail(error) {
    //scan failed modal dialog
    CSAPP.openModalViewAlert("Scanning failed: " + error);
}