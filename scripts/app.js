/// <reference path="angular.js" />
// module
var weatherApp = angular.module('weatherApp', ["ngRoute","ngResource"]);

//routes

weatherApp.config(function ($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'Pages/home.html',
        controller:'homeController'
    })
    .when('/forecast', {
        templateUrl: 'Pages/forecast.html',
        controller:'forecastController'
    })
    .when('/forecast/:days', {
        templateUrl: 'Pages/forecast.html',
        controller: 'forecastController'
    })
    .when('/today',{
      templateUrl:'Pages/today.html',
      controller: 'todayController'
    })
});
//services
weatherApp.service('cityService', function () {
    this.city = "New York,NY";
});

//Controllers
//home controller
weatherApp.controller('homeController', ['$scope', 'cityService', function ($scope, cityService) {

    $scope.city = cityService.city;
    $scope.$watch('city', function () {
        cityService.city = $scope.city;
    });
    console.log($scope.city);
}]);

//forecast controller
weatherApp.controller('forecastController', ['$scope', 'cityService', '$resource', '$routeParams', function ($scope, cityService, $resource,$routeParams) {

    $scope.city = cityService.city;
    $scope.days = $routeParams.days || '2';

    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily");
    $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days, APPID :'2e106c81a216c61f9e11c3e704d6f880'});
    console.log($scope.weatherResult);

    $scope.convertToFaren = function(degK){
      return Math.round(degK - 273);
    };

    $scope.convertToDate = function(dt){
      return new Date(dt *1000);
    }
}]);
// Todays Weather
weatherApp.controller("todayController",['$scope', 'cityService', '$resource' ,function($scope,cityService,$resource){
  $scope.city = cityService.city;
  $scope.todayWeatherAPI = $resource("http://api.openweathermap.org/data/2.5/weather");
  $scope.todayResult = $scope.todayWeatherAPI.get({q:$scope.city,APPID:'2e106c81a216c61f9e11c3e704d6f880'});
  console.log($scope.todayResult);

  $scope.todayDate = function(dt){
    return new Date(dt*1000);
  }
}]);



////Directive
weatherApp.directive("weatherReport", function () {
    return {
        restrict :'E',
        templateUrl:'Directives/webReport.html',
        replace: true,
       // isolation of scope
        scope: {
          weatherDay: "=",
          convertToStandard: "&",
          convertToDate:"&",
          dateFormat:"@"
        }
    }
});
