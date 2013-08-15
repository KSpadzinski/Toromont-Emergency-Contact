// this global variable is where all the script goes so that
// it doesn't polute the global namespace
var CSAPP_SERVICE_URL = "http://ws.toromont.ca/touch";
var CSAPP_USER_ISAUTHENTICATED = false;
var xTOKEN = null;
var map;
var scanner;
var LATITUDE;
var LONGITUDE;
var CSAPP_ISBARCODESCANAVAILABLE = false;
var CSAPP = CSAPP || {};

CSAPP.run = (function () {
    // create the Kendo UI Mobile application
    CSAPP.app = new kendo.mobile.Application(document.body, { skin: 'flat'} );

    // get geolocation
    CSAPP.GetLocation();

    // check for authentication token
    var xTOKEN = CSAPP.ReadLocalStorage("xToken");
    if ((xTOKEN == null || xTOKEN == "" || xTOKEN == "null")) {
        /* Future Processing of login info on app load*/
    }
    else {
        CSAPP.app.navigate('#view-main');
    }
});

// this is called when the intial view shows. it prevents the flash
// of unstyled content (FOUC)
CSAPP.show = (function () {
    $(document.body).show();
});

// this function runs at startup and attaches to the 'deviceready' event
// which is fired by PhoneGap when the hardware is ready for native API
// calls. It is self invoking and will run immediately when this script file is 
// loaded.
(function () {
    if (navigator.userAgent.indexOf('Browzr') > -1) {
        // blackberry
        setTimeout(CSAPP.run, 250)
    } else {
        // attach to deviceready event, which is fired when phonegap is all good to go.
        document.addEventListener('deviceready', CSAPP.run, false);
    }
})();

CSAPP.openModalViewAlert = (function (alertMessage) {
    $("#modalview-alert-message").append('<div>' + alertMessage + '</div>');
    $("#modalview-alert").kendoMobileModalView("open");
    $("#modalview-alert").show();
});

CSAPP.closeModalViewAlert = (function () {
    $("#modalview-alert-message").text('');
    $("#modalview-alert").kendoMobileModalView("close");
    $("#modalview-alert").hide();
});

/***** Write Key/Value to local storage *********/
CSAPP.WriteLocalStorage = (function(key, value) {
    window.localStorage.setItem(key, value);
});

/***** Read from local storage *********/
CSAPP.ReadLocalStorage = (function(key) {
    var value = window.localStorage.getItem(key);
    return value;
});

/***** Get Location ********************/
CSAPP.GetLocation = (function () {
    navigator.geolocation.getCurrentPosition(handle_geolocation_query, handle_errors, { enableHighAccuracy: true });
});

/***** Get Data *************************/
// this function returns a Kendo UI DataSource
// which reads the top threads off of the programming.reddit
// datasource
   
CSAPP.Contacts = (function() {
	$("#listview-contacts").kendoMobileListView({
	    dataSource: kendo.data.DataSource.create({
			// set the data to a local array of object
			transport: {
			read: {
					url: "http://ws.toromont.ca/touch/BizInfo/Public/contact/myContact",
					crossDomain: true,
			        beforeSend: function (xhr) {
			        	xhr.setRequestHeader("AuthX", "WRAP access_token=" + xTOKEN);
			        },
			        dataType: "json"
			}
			},
			schema: {
			data: "Contacts"
			}
			}),
	    template: $("#datatemplate-contacts").html(),
	    style: "inset",
	    pullToRefresh: true,
	    fixedHeaders: false
	});
});



function listviewContactsClick(e) {
     console.log(e.item); // The clicked item as a jQuery object
 }