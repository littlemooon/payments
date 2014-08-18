angular
  .module('app.manage', [
    'ui.router',
    'app.entry',
    'app.category',
    'app.rule'
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
          templateUrl: 'modules/entry/entry.html',
          controller: 'EntryCtrl'
        })
        .state("manage.categories", { 
          url: '/categories',
          templateUrl: 'modules/category/category.html',
          controller: 'CategoryCtrl'
        })
        .state("manage.rules", { 
          url: "/rules",
          templateUrl: 'modules/rule/rule.html',
          controller: 'RuleCtrl'
        });

    $urlRouterProvider.when("/manage", "/manage/entries");
  });
