angular.module('app', ['ngRoute']);


angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  // this is the config. this is run first, and can include dependencies from a provider, or a constant
  $locationProvider.html5Mode(true);
  // $routeProvider.otherwise({redirectTo:'/home'});
}]);

angular.module('app').run([function() {
  // this is where we can do some work that may depend on the config. this is run after the config
  // do stuff here

}]);

angular.module('app').controller('AppCtrl', ['$scope', function($scope) {
  // this where we interface with the view
  // main controller
  $scope.title = "Passeri";

}]);
