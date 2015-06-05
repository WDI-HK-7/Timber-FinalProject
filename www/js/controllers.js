angular.module('starter.controllers', ['ionic','ionic.contrib.ui.tinderCards','firebase'])

.controller('ProfileCtrl', function($scope, Items, $location, $ionicModal) {
  $scope.items = Items.allitems();

  $scope.toYourItem = function(index){
    $location.path('/tab/profile/'+ index);
  }

  // $scope.loginData = {};

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
  
  $scope.doSave = function() {
    // console.log('Doing login', $scope.loginData);
    // $timeout(function() {
    //   $scope.closeLogin();
    // }, 1000);
  }

})

.controller('PopupCtrl',function($scope, $ionicPopup, $timeout) {

  $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'It\'s a Match!',
     template: 'Wilson also likes one of your items!'
   });
   confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
     } else {
       console.log('You are not sure');
     }
   });
 };
})

.controller('YourItemProfileCtrl', function($scope,$location, Items, $stateParams, $ionicModal) {
  $scope.items = Items.allitems();
  $scope.matchId = $stateParams.itemsId;

  $scope.DisplayMatch = function($stateParams){
    $stateParams.itemsId
  }

  $ionicModal.fromTemplateUrl('templates/delete-item.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  })

  $scope.deleteItem = function() {
    $scope.modal.show();
  }

  $scope.closeModalDeleteItem = function() {
    $scope.modal.hide();
  }
  
  $scope.doSaveDelete = function() {
  }

  $ionicModal.fromTemplateUrl('templates/edit-item.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalEdit = modal;
  })

  $scope.editItem = function() {
    $scope.modalEdit.show();
  }

  $scope.closeModalEditItem = function() {
    $scope.modalEdit.hide();
  }
  
  $scope.doSaveEdit = function() {
  }

})

.controller('SwipeCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('MatchesCtrl', function($scope, Items, $location) {
  $scope.items = Items.allitems();
  $scope.toMatch = function(index){
    $location.path('tab/matches/'+ index);
  }
})

.controller('MatchCtrl', function($scope,$location, Items, $stateParams) {
  $scope.items = Items.allitems();
  $scope.matchId = $stateParams.itemsId;
  $scope.DisplayMatch = function($stateParams){
    $stateParams.itemsId
  }
  $scope.ToChats = function(){
    $location.path('tab/chats');
  }
})

// .directive('noScroll', function($document) {

//   return {
//     restrict: 'A',
//     link: function($scope, $element, $attr) {

//       $document.on('touchmove', function(e) {
//         e.preventDefault();
//       });
//     }
//   }
// })

.controller('CardsCtrl', function($scope, TDCardDelegate) {
  console.log('CARDS CTRL');
  var cardTypes = [
    { image: '../../img/Wilson1.jpg' },
    { image: '../../img/Wilson2.jpg' },
    { image: '../../img/Wilson3.jpg' },
    { image: '../../img/Wilson22.jpg'},
    { image: '../../img/Wilson4.jpg'}
  ];

  $scope.cards = Array.prototype.slice.call(cardTypes, 0);

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.push(angular.extend({}, newCard));
  }
})

.controller('CardCtrl', function($scope, TDCardDelegate) {
  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    $scope.addCard();
  };
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
    $scope.addCard();
  };
});
