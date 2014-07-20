angular
  .module('app.dash', [
    'ui.router'
  ])
  .config(function($stateProvider) {
    $stateProvider
      .state('dash', {
        url: '/',
        templateUrl: 'modules/dash/dash.html',
        controller: 'DashCtrl'
      })
  });