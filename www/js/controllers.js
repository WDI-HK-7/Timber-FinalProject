angular.module('starter.controllers', ['ionic','ionic.contrib.ui.tinderCards','firebase', 'LocalStorageModule'])

.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $ionicModal ,$ionicPopup, $timeout, localStorageService) {
  
  $ionicModal.fromTemplateUrl('templates/loginwithFB.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalFB = modal;
  })

  $scope.loginModalFB = function() {
    $scope.modalFB.show();
  }

  $scope.closeModalFBLogin = function() {
    $scope.modalFB.hide();
  }

  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

  // $scope.LoginConfirm = function() {
  //   var alertPopup = $ionicPopup.alert({
  //    title: 'Hi, you are signed in',
  //    template: 'You may now close this window'
  //   });
  //   alertPopup.then(function(res) {
  //   console.log('Thank you close signin alert');
  //  });
  // };

  function routeTo() {
    window.location.href = '#/tab/swipe';
  }

  var refFB = new Firebase("https://project-timber.firebaseio.com");

  //SignIn
  $scope.signIn = function(){
    refFB.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        refFB.onAuth(function(authData) {
          if (authData) {
            refFB.child("users").child(authData.uid).set({
              provider: authData.provider,
              name: authData.facebook.displayName
            });
            // $state.go('tab.swipe');
            routeTo();
            localStorageService.set("userID", authData.uid);
          }
        });
      }
    });
  }
  
  //onAuth()
  function authDataCallback(authData) {
    if (authData) {
      console.log("User " + authData.facebook.displayName + " is logged in with " + authData.provider);
    } else {
      console.log("User is logged out");
    }
  }
  var authenticate = refFB.onAuth(authDataCallback);
  console.log(authenticate);

  //SignOut
  $scope.signOut = function(){
    refFB.unauth();
    console.log("check sign out");
    $state.go('intro');
  }

})


.controller('ProfileCtrl', function($scope, $location, $ionicModal, $firebaseArray, $state, $stateParams, localStorageService) {

  $scope.newItemName = "";
  $scope.newItemDescription = "";

  console.log("ProfileCtrl");

  var ref = new Firebase("https://project-timber.firebaseio.com/items");

  $scope.items = $firebaseArray(ref);


  var userId = localStorageService.get("userID");
  //new items
  $scope.addNewItem = function(newItemName, newItemDescription) {

    $scope.items.$add(
      { 
        userId: userId,
        itemName: newItemName,
        itemDescription: newItemDescription
      }
    ).then(function() {
      ref.orderByChild("userId").equalTo(userId).on('value', function(resources){
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
    });
  };

  //get users items
  ref.orderByChild("userId").equalTo(userId).on('value', function(resources){
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


  //OLD get items
  $scope.items.$loaded().then(function(resources) {
    console.log("old one");
    console.log(resources);
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
  
  $scope.doSave = function() {

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

.controller('YourItemProfileCtrl', function($scope,$location, $stateParams, $ionicModal, $firebaseObject, $ionicPopup, $timeout, $state) {

  var ref = new Firebase("https://project-timber.firebaseio.com/items/" + $stateParams.itemId);
  syncObject = $firebaseObject(ref);
  syncObject.$bindTo($scope, "item");

  $scope.itemName = "";
  $scope.itemDescription = "";

  //edit item
  $scope.editOneItem = function(itemName, itemDescription) {
    $scope.item.itemName = itemName;
    $scope.item.itemDescription = itemDescription; 
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

.controller('MatchCtrl', function($scope,$location, $stateParams) {

  $scope.matchId = $stateParams.itemsId;
  $scope.DisplayMatch = function($stateParams){
    $stateParams.itemsId
  }
  $scope.ToChats = function(){
    $location.path('tab/chats');
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
