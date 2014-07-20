angular
  .module('app.manage', [
    'ui.router',
    'app.entry',
    'app.category'
  ])
  .config(function($stateProvider, $urlRouterProvider) {
 
    $stateProvider
      .state("manage", {
        url: '/manage',
        abstract: true,
        templateUrl: 'modules/manage/manage.html',
        controller: 'ManageCtrl'
      })
        .state("manage.entries", { 
          url: "", 
          templateUrl: 'modules/entry/entry.html'
        })
        .state("manage.categories", { 
          url: '/categories',
          templateUrl: 'modules/category/category.html'
        })
        .state("manage.defaults", { 
          url: "/defaults"
        });

    $urlRouterProvider.when("/manage", "/manage/entries");
  });
