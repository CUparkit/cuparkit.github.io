
var app = angular.module("cuparkit", ["ngRoute", "$interpolateProvider"]);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol("[[");
    $interpolateProvider.endSymbol("]]");
})

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "home.html",
            controller: "mainCtrl"
        })
        .when("/lot", {
            templateUrl: "lot.html",
            controller: "lotCtrl"
        })
        .when("/survey", {
            templateUrl: "survey.html",
            controller: "surveyCtrl"
        })
        .when("/settings", {
            templateUrl: "settings.html",
            controller: "settingCtrl"
        });
});

app.controller("mainCtrl", ["$scope", "apiHandler", "settingsHandler",
                   function( $scope ,  apiHandler,   settingsHandler) {
    
    var promise = apiHandler.getData();

    promise.then(function(data) {
        $scope.lots = data;
        console.log($scope.lots)
    })

    // $scope.$watch('apiHandler.data', function (newVal, oldVal, scope) {
    //     scope.data = newVal
    // });


}]);

app.controller("settingsCtrl", [function() {

}]);

app.controller("surveyCtrl", [function(){

}]);

app.controller("lotCtrl", [function() {



}]);

app.factory("stateHandler", [function() {

    var service = {}

    var selectedLot = undefined;

    service.getSelectedLot = function() {
        return selectedLot;
    }

    service.setSelectedLot = function(newSelection) {
        selectedLot = newSelection;
    }

    return service;

}]);

app.factory("apiHandler", ["$http", "$q", function($http, $q) {

    var REQUEST_URL = "https://cuparkit.firebaseio.com/lots.json";
    var service = {};
    
    var data = $q.defer();

    service.update = function() {
        $http.get(REQUEST_URL).then(handleResponse);
    };

    var handleResponse = function(response) {
        data.resolve(response.data);
        console.log(data);
    }

    service.update();

    service.getData = function() {
        return data.promise;
    }

    service.getLot = function(name) {
        return data.lots[name];
    }

    return service;

}]);

app.factory("settingsHandler", [function() {

    var STORAGE_KEY = "settings"

    var service = {}
    
    var default_settings = {
        "favoriteLots": [],
        "permitType": "",
        "lastUsedLot": ""
    }

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
    }

    service.setSetting = function(key, value) {
        settings[key] = value;
        this.writeSettings();
    }

    service.getSettingsObject = function() {
        return settings;
    }

    service.writeSettings = function() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    service.writeSettings();

    return service;

}]);


