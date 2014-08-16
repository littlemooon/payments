angular
  .module('app.dash', [
    'ui.router',
    'nvd3'
  ])
  .config(function($stateProvider) {
 
    $stateProvider
      .state('dash', {
        url: '/',
        views: {
          '': { 
            templateUrl: 'modules/dash/dash.html',
            controller: 'DashCtrl'
          },
          'balanceGraph@dash': { 
            templateUrl: 'modules/dash/balanceGraph/balanceGraph.html',
            controller: 'BalanceGraphCtrl'
          },
          'totalGraph@dash': { 
            templateUrl: 'modules/dash/totalGraph/totalGraph.html',
            controller: 'TotalGraphCtrl'
          },
          'timeGraph@dash': { 
            templateUrl: 'modules/dash/timeGraph/timeGraph.html',
            controller: 'TimeGraphCtrl'
          }
        }
      });
  });
