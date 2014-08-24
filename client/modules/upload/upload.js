angular
  .module('app.upload', [
    'ui.router',
    'flow'
  ])

  .config(function($stateProvider) {
    $stateProvider
      .state('upload', {
        url: '/upload',
        templateUrl: 'modules/upload/upload.html',
        controller: 'UploadCtrl'
      });
  })

  .config(['flowFactoryProvider', function (flowFactoryProvider) {
    flowFactoryProvider.defaults = {
      target: 'upload.php',
      permanentErrors: [404, 500, 501],
      maxChunkRetries: 1,
      chunkRetryInterval: 5000,
      simultaneousUploads: 4
    };
    flowFactoryProvider.on('catchAll', function (event) {
      console.log('catchAll', arguments);
    });
  }]);