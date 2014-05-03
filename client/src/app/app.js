angular.module('app', ['ngRoute','btford.socket-io']);


angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  // this is the config. this is run first, and can include dependencies from a provider, or a constant
  $locationProvider.html5Mode(true);
  // $routeProvider.otherwise({redirectTo:'/home'});
}]);

angular.module('app').run([function() {
  // this is where we can do some work that may depend on the config. this is run after the config
  // do stuff here

}]);

angular.module('app').factory('socketio', function (socketFactory) {
  return socketFactory();
});

angular.module('app').controller('AppCtrl', ['$scope', '$http', function($scope,$http) {
  // this where we interface with the view
  // main controller
  $scope.title = "Passeri";

  $scope.keyword = "";
  $scope.stream = "";

  $scope.listen = function() {
    var promise = $http.get('/twitter',{params: {"keyword":$scope.keyword}}).then(function(output){
      $scope.stream = output.data;
    });
  };

}]);
