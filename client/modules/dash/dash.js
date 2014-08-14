angular
  .module('app.dash', [
    'ui.router',
    'nvd3',
    'app.graphData'
  ])
  .config(function($stateProvider) {
    $stateProvider
      .state('dash', {
        url: '/',
        templateUrl: 'modules/dash/dash.html',
        controller: 'DashCtrl'
      })
  });