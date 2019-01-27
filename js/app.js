
var app = angular.module("cuparkit", ["ngRoute"]);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol("[[");
    $interpolateProvider.endSymbol("]]");
});

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "home.html",
            controller: "mainCtrl"
        })
        .when("/lot", {
            templateUrl: "lot.html",
            controller: "mainCtrl"
        })
        .when("/survey", {
            templateUrl: "survey.html",
            controller: "mainCtrl"
        })
        .when("/settings", {
            templateUrl: "settings.html",
            controller: "mainCtrl"
        });
});

app.controller("mainCtrl", ["$scope", "apiHandler", "settingsHandler",
                   function( $scope ,  apiHandler,   settingsHandler) {
    
    console.info("MAINCTRL LOADED");

    var promise = apiHandler.getData();

    promise.then(function(data) {
        $scope.lots = data;
        // console.log($scope.lots)
    });

    // $scope.$watch('apiHandler.data', function (newVal, oldVal, scope) {
    //     scope.data = newVal
    // });

    // new ProgressBar.Circle("#lot-status-big", {
    //     from: { color: '#aaa', width: 1 },
    //     to: { color: '#333', width: 7 },
    //     strokeWidth: 7,
    //     text: {
    //         autoStyleContainer: true
    //     },
    //     step: function(state, circle) {

    //           circle.setText(Math.round(circle.value() * 100));
        
    //     }
        
    // }).animate(0.6);

}]);

app.factory("timeHelper", [function() {
    console.info("TIME HELPER LOADED");
    return {
        getHour: function() { new Date().getHours(); }
    }
}]);

app.factory("apiHandler", ["$http", "$q", function($http, $q) {

    console.info("API HANDLER LOADED");

    var REQUEST_URL = "https://cuparkit.firebaseio.com/feed.json";
    var service = {};
    
    var data = $q.defer();

    service.update = function() {
        $http.get(REQUEST_URL).then(handleResponse);
    };

    var handleResponse = function(response) {
        data.resolve(response.data.lots);
        // console.log(data);
    };

    service.update();

    service.getData = function() {
        return data.promise;
    };

    service.getLot = function(name) {
        return data[name];
    };
    
    return service;

}]);

app.factory("settingsHandler", [function() {

    console.info("SETTINGSHANDLER LOADED");

    var STORAGE_KEY = "settings";

    var service = {};
    
    var default_settings = {
        "favoriteLots": [],
        "permitType": "",
        "lastUsedLot": ""
    };

    var settings = {};

    if (localStorage.getItem(STORAGE_KEY) !== null) {
        settings = JSON.parse(localStorage[STORAGE_KEY]);
    }

    for (default_key in default_settings) {
        if ( !(default_key in settings) ) {
            settings[default_key] = default_settings[default_key];
        }
    }

    service.getSetting = function(key) {
        return settings[key];
    };

    service.setSetting = function(key, value) {
        settings[key] = value;
        this.writeSettings();
    };

    service.getSettingsObject = function() {
        return settings;
    };

    service.writeSettings = function() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    };

    service.writeSettings();

    return service;

}]);


