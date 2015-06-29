angular.module('starter.controllers')

.controller('MatchesCtrl', function($scope, $location, $ionicModal, $firebaseArray, $state, $stateParams, localStorageService) {
  
  var currentuserId = localStorageService.get("userID");
  var userName = localStorageService.get("userName");
  var arrayMyMatches = [];

  //print at match page
  var matchref = new Firebase("https://project-timber.firebaseio.com/matches");
  var matches = $firebaseArray(matchref);

  matchref.orderByChild("userId").equalTo(currentuserId).on('value', function(resources){
    var newResources = resources.val();
    for (var key in newResources) {
      var newResource  = newResources[key];
      newResource.id = key;
      arrayMyMatches.push(newResource);
    }
    console.log("new resources should be array of array");
    console.log(arrayMyMatches);
    $scope.itemsGroups = _.chunk(arrayMyMatches, 3);
  });

  $scope.toMatch = function(item){
    $location.path('tab/matches/'+ item.id);//matchid
  }
})