angular.module('starter.controllers')

.controller('MatchCtrl', function($scope,$location, $stateParams, $firebaseObject, $state, localStorageService) {

  var currentuserId = localStorageService.get("userID");
  var userName = localStorageService.get("userName");

  var ref = new Firebase("https://project-timber.firebaseio.com/matches");

  var matchref = new Firebase("https://project-timber.firebaseio.com/matches/" + $stateParams.itemsId);
  syncObject = $firebaseObject(matchref);
  syncObject.$bindTo($scope, "item");
  console.log("hihi");
  console.log(syncObject);

  ref.orderByChild("ownerId").equalTo(currentuserId).on('value', function(resources){
    var arrayOtherLikesMine = [];
    var newResources = resources.val();
    console.log("Match list also like item");
    console.log(newResources);
    for (var key in newResources) {
      var newResource  = newResources[key];
      newResource.id = key;
      arrayOtherLikesMine.push(newResource);
    }
    console.log("new resources should be array of array");
    console.log(arrayOtherLikesMine);
    $scope.itemsGroups = _.chunk(arrayOtherLikesMine, 3);
  });

  $scope.ToChats = function(){
    // $state.go('tab.chats');
  }
})