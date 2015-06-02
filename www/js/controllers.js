angular.module('starter.controllers', [])

.controller('ProfileCtrl', function($scope, Items) {
  $scope.items = Items.allitems();
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

.controller('MatchesCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

// angular.module('starter', ['ionic', 'ionic.contrib.ui.tinderCards'])


// .config(function($stateProvider, $urlRouterProvider) {

// })

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

// .controller('CardsCtrl', function($scope, TDCardDelegate) {
//   console.log('CARDS CTRL');
//   var cardTypes = [
//     { image: 'https://pbs.twimg.com/profile_images/546942133496995840/k7JAxvgq.jpeg' },
//     { image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png' },
//     { image: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg' },
//   ];

//   $scope.cards = Array.prototype.slice.call(cardTypes, 0);

//   $scope.cardDestroyed = function(index) {
//     $scope.cards.splice(index, 1);
//   };

//   $scope.addCard = function() {
//     var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
//     newCard.id = Math.random();
//     $scope.cards.push(angular.extend({}, newCard));
//   }
// })

// .controller('CardCtrl', function($scope, TDCardDelegate) {
//   $scope.cardSwipedLeft = function(index) {
//     console.log('LEFT SWIPE');
//     $scope.addCard();
//   };
//   $scope.cardSwipedRight = function(index) {
//     console.log('RIGHT SWIPE');
//     $scope.addCard();
//   };
// });
