angular.module('app.rule').factory('RuleService', function($http) {

  return {
    get: function() {
      return $http.get('/api/rules');
    },
    add: function(rule) {
      return $http.post('/api/rules', rule);
    },
    update: function(rule) {
      return $http.put('/api/rules/' + rule.id, rule);
    },
    delete: function(rule) {
      return $http.delete('/api/rules/' + rule.id);
    },
    apply: function() {
      return $http.get('/api/rules/apply');
    }
  };
});