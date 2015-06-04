angular.module('starter.controllers', ['ionic','ionic.contrib.ui.tinderCards'])

.controller('ProfileCtrl', function($scope, Items, $location, $ionicModal) {
  $scope.items = Items.allitems();

  $scope.toYourItem = function(index){
    $location.path('/profile/'+ index);
  }

  $scope.loginData = {};

  $ionicModal.fromTemplateUrl('templates/new-item.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  })

  $scope.login = function() {
    $scope.modal.show();
  }

  $scope.closeLogin = function() {
    $scope.modal.hide();
  }
  
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  }
})

.controller('YourItemProfileCtrl', function($scope,$location, Items, $stateParams) {
  $scope.items = Items.allitems();
  $scope.matchId = $stateParams.itemsId;
  $scope.DisplayMatch = function($stateParams){
    $stateParams.itemsId
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
    $location.path('/matches/'+ index);
  }
})

.controller('MatchCtrl', function($scope,$location, Items, $stateParams) {
  $scope.items = Items.allitems();
  $scope.matchId = $stateParams.itemsId;
  $scope.DisplayMatch = function($stateParams){
    $stateParams.itemsId
  }
  $scope.ToChats = function(){
    $location.path('/chats');
  }
})

.directive('noScroll', function($document) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})

.controller('CardsCtrl', function($scope, TDCardDelegate) {
  console.log('CARDS CTRL');
  var cardTypes = [
    { image: '../../img/Wilson1.jpg' },
    { image: '../../img/Wilson2.jpg' },
    { image: '../../img/Wilson3.jpg' },
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
