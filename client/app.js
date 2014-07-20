'use strict';

angular
  .module('app', [
  	'ui.router',
    'app.dash',
    'app.manage',
    'app.upload'
  ])

  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
 
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  });