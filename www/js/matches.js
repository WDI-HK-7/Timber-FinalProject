angular.module('starter.controllers')

.controller('MatchesCtrl', function($scope, $location, $ionicModal, $firebaseArray, $state, $stateParams, localStorageService) {
  
  var currentuserId = localStorageService.get("userID");
  var userName = localStorageService.get("userName");

  //like ref
  // var likeref = new Firebase("https://project-timber.firebaseio.com/likes");
  // var likes = $firebaseArray(likeref);
  // //keep listening to likes and store matches in matches database
  var arrayMyMatches = [];
  // likes.$loaded().then(function() {
  //   arrayMyMatches = _.filter(likes, function(){
  //     return item.userId !== currentuserId;
  //   });
  //   $scope.itemsGroups = _.chunk(matches, 3);
  // });

  //ref
  // var itemref = new Firebase("https://project-timber.firebaseio.com/items");
  // var items = $firebaseArray(itemref);

  // items.$loaded().then(function() {
  //   $scope.cards = _.filter(items, function(item) {
  //     console.log(item.userId !== currentuserId);
  //     return item.userId !== currentuserId;
  //   });
  // });

  //store arrayItemILike in database-matches

  //ref
  // var matchref = new Firebase("https://project-timber.firebaseio.com/matches");

  //   $scope.matches = $firebaseArray(matchref);
  //   $scope.addNewMatches = function(item) {
  //     $scope.matches.$add(
  //       { 
  //         userId: currentuserId,
  //         ownerId: item.userId,
  //         ownerName: item.ownerName,
  //         itemId: item.$id,
  //         itemimageUrl: item.imageUrl,
  //         itemName: item.itemName,
  //         itemDescription: item.itemDescription
  //       }
  //     )
  //   };

  //old one which get all matches
  // matches.$loaded().then(function() {
  //   $scope.itemsGroups = _.chunk(matches, 3);
  // });

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