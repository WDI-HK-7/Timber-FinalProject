angular.module('starter.controllers')

.controller('YourItemProfileCtrl', function($scope,$location, $stateParams, $ionicModal, $firebaseObject, $ionicPopup, $timeout, $state) {

  var ref = new Firebase("https://project-timber.firebaseio.com/items/" + $stateParams.itemId);
  syncObject = $firebaseObject(ref);
  syncObject.$bindTo($scope, "item");
  console.log(syncObject);
  $scope.itemName = "";
  $scope.itemDescription = "";

  //edit item
  $scope.editOneItem = function(itemName, itemDescription, itemImage) {
    $scope.item.itemName = itemName;
    $scope.item.itemDescription = itemDescription; 
    $scope.item.imageUrl = itemImage; 
  }

  $ionicModal.fromTemplateUrl('templates/edit-item.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalEdit = modal;
  })

  $scope.editItem = function() {
    $scope.itemName = $scope.item.itemName;
    $scope.itemDescription = $scope.item.itemDescription;

    $scope.modalEdit.show();
  }

  $scope.closeModalEditItem = function() {
    $scope.modalEdit.hide();
  }
  //remove item
  $scope.confirmDelete = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Are you sure you want to delete this item?',
    });
    confirmPopup.then(function(res) {
      if(res) {
        ref.remove();
        $state.go('tab.profile');
      } else {
        console.log('No, no delete');
      }
    });
  };  

})