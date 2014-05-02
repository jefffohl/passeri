angular.module('app', ['ngRoute']);


angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  // $routeProvider.otherwise({redirectTo:'/home'});
}]);

angular.module('app').run([function() {
  // do stuff here

}]);

angular.module('app').controller('AppCtrl', ['$scope', function($scope) {
  // main controller
  $scope.title = "Passeri";

}]);
