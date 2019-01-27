
var app = angular.module("cuparkit", []);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol("[[");
    $interpolateProvider.endSymbol("]]");
});

app.controller("mainCtrl", ["$scope", "apiHandler", "settingsHandler",
                   function( $scope ,  apiHandler,   settingsHandler) {
    
    console.info("MAINCTRL LOADED");
    
    $scope.hour = new Date().getHours();
    // $scope.calendarOptions = {
    //     axisX: {
    //         labelInterpolationFnc: function(value) {
    //             return "Hour " + value;
    //         }
    //     }
    // };

    // $scope.calendarDataStructure = {
    //     labels : ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a',
    //               '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p',
    //               '5p', '6p', '7p', '8p', '9p', '10p', '11p'],
    //     series: [
    //         {
    //             "data": []
    //         }
    //     ]
        
    // };


    var promise = apiHandler.getData();

    promise.then(function(data) {
        $scope.lots = data;
        console.log($scope.lots)
    });

    $scope.$on("ngRepeatFinished", function(ngRepeatFinishedEvent) {

        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.collapsible');
            var instances = M.Collapsible.init(elems, options);
        });

    });

    $scope.showSection = function(mode) {
        allSections = document.querySelectorAll("section");

        for (var i=0; i<allSections.length; i++) {
            allSections[i].setAttribute("class", "hide");
        }

        document.querySelector("#" + mode).setAttribute("class", "");
    };

    $scope.lotPageInit = function(lotName) {

        console.log(lotName + " SELECTED");

        // $scope.selectedLot = $scope.lots[0];

        hour = new Date().getHours();

        // new ProgressBar.Circle("#lot-status-big", {
        //     from: { color: '#aaa', width: 1 },
        //     to: { color: '#333', width: 7 },
        //     strokeWidth: 7,
        //     text: {
        //         autoStyleContainer: true
        //     },
        //     step: function(state, circle) {
        //         circle.setText(Math.round(circle.value() * 100));
        //     }   
        // }).animate(0.6);



    }

    // $scope.$watch('apiHandler.data', function (newVal, oldVal, scope) {
    //     scope.data = newVal
    // });



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


