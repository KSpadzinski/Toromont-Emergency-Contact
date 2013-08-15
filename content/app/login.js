$("#button-signin").click(function () {
    var loginName = $("#input-username").val();
    var password = $("#input-password").val();
    if (loginName === "" || password === "") {
        CSAPP.openModalViewAlert("Please enter a valid username or password.");
    }
    else {
        var sec = new TIH.ToromontCAT.Web.Security(CSAPP_SERVICE_URL);
        var user = new Object();
        user.UserName = loginName;
        user.Password = password;

        sec.Login(user);
    }
});

$("#button-signout").click(function () {
    var sec = new TIH.ToromontCAT.Web.Security(CSAPP_SERVICE_URL);
    sec.ClearLogin();
});

var Web = namespace("TIH.ToromontCAT.Web");
Web.Security = function (authURL) {
    var _authURL = authURL + "/login"; ;
    var that = this;
    var tokenKeyName = "xToken";
    var userDataKeyName = "xUserData";

    this.Login = function (loginInfo) {
        var obj = new Object();
        obj.loginUser = loginInfo;

        processLogin(obj);
    };

    this.ClearLogin = function () {
        processLoginClear();
    };

    this.ProcessSlide = function () {
        processSlide();
    };

    var processSlide = function () {
        var actionUrl = _authURL + "/slide";
        $.ajax({
            url: actionUrl
                    , type: "GET"
        })
        .done(function (data) {
            $("#divRes").html(data);
        })
        .fail(function (data) {
            LoginFailed(data);
        })
    }

    var processLoginClear = function () {
        CSAPP.app.showLoading();
        var actionUrl = _authURL + "/clear";
        $.ajax({
            url: actionUrl
                    , type: "GET"
        })
        .done(function (data) {

        })
        .fail(function (data) {
            LoginFailed(data);
        })
        .always(function () {
            CSAPP.WriteLocalStorage(tokenKeyName, "");
            CSAPP.app.hideLoading();
            CSAPP.app.navigate('#view-signin', 'overlay:up');
        })
    }

    var processLogin = function (loginUser) {

        CSAPP.app.showLoading();

        var d = JSON.stringify(loginUser);
        var actionUrl = _authURL + "/";
        $.ajax({
            url: actionUrl
                    , type: "POST"
                    , contentType: "application/json"
                    , data: d

        })
        .done(function (data) {
            LoginSuccess(data);
        })
        .fail(function (data) {
            LoginFailed(data);
        })
        .always(function () {
            CSAPP.app.hideLoading();
        })
    }

    var LoginSuccess = function (data) {
        CSAPP.WriteLocalStorage(userDataKeyName, data);
        CSAPP.WriteLocalStorage(tokenKeyName, data.Token);
        that.OnLoginSuccess(data);
    };

    var LoginFailed = function (data) {
        that.OnLoginFailed(data);
    };

    this.OnLoginSuccess = function (data) {
        if (data.hasOwnProperty("IsLogin")) {
            CSAPP_USER_ISAUTHENTICATED = data.IsLogin;
            if (CSAPP_USER_ISAUTHENTICATED) {
                CSAPP.app.navigate('#view-main', 'overlay:down');
            }
            else {
                CSAPP.openModalViewAlert("Your username or password is incorrect.  Please try again.");
            }

        }
        else {
            CSAPP.openModalViewAlert("Login Failed.");
            CSAPP_USER_ISAUTHENTICATED = false;
        }
    };
    this.OnLoginFailed = function (data) {
        CSAPP.openModalViewAlert("We are unable to reach the server to check your credentials.  Please try again later.");
        CSAPP_USER_ISAUTHENTICATED = false;
    };
}
