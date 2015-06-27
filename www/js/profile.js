angular.module('starter.controllers')

.controller('ProfileCtrl', function($scope, $location, $ionicModal, $firebaseArray, $state, $stateParams, localStorageService) {

  $scope.newItemName = "";
  $scope.newItemDescription = "";

  var ref = new Firebase("https://project-timber.firebaseio.com/items");

  $scope.items = $firebaseArray(ref);


  $scope.userId = localStorageService.get("userID");
  $scope.userName = localStorageService.get("userName");
  //new items
  $scope.addNewItem = function(newItemName, newItemDescription) {

    $scope.items.$add(
      { 
        userId: $scope.userId,
        itemName: newItemName,
        itemDescription: newItemDescription,
        ownerName: $scope.userName,
        imageUrl: "http://thefancy-media-ec6.thefancy.com/1280/20150506/885221566277747406_29bd6727c6cc.jpg"
      }
    ).then(function() {
      ref.orderByChild("userId").equalTo($scope.userId).on('value', function(resources){
        console.log(resources.val());

        var arrayMyItem = [];
        var newResources = resources.val();
        for (var key in newResources) {
          var newResource  = newResources[key];
          newResource.id = key;
          arrayMyItem.push(newResource);
        }
      });
    });
  };

  //get users items
  ref.orderByChild("userId").equalTo($scope.userId).on('value', function(resources){
    console.log(resources.val());

    var arrayMyItem = [];
    var newResources = resources.val();
    for (var key in newResources) {
      var newResource  = newResources[key];
      newResource.id = key;
      arrayMyItem.push(newResource);
    }
    $scope.itemsGroups = _.chunk(arrayMyItem, 3);
    console.log(arrayMyItem);
  });

  //view each item
  $scope.toYourItem = function(item){    
    $location.path('/tab/profile/'+ item.id);
  }

  //add item modal
  $ionicModal.fromTemplateUrl('templates/new-item.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  })

  $scope.addItem = function() {
    $scope.modal.show();
  }

  $scope.closeModalNewItem = function() {
    $scope.modal.hide();
  }

})