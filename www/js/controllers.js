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
            $state.go('tab.swipe');
            $scope.closeModalFBLogin();
            localStorageService.set("userID", authData.uid);
            localStorageService.set("userName", authData.facebook.displayName);
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
        imageUrl: "http://placehold.it/200x200"
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


.controller('YourItemProfileCtrl', function($scope,$location, $stateParams, $ionicModal, $firebaseObject, $ionicPopup, $timeout, $state) {

  var ref = new Firebase("https://project-timber.firebaseio.com/items/" + $stateParams.itemId);
  syncObject = $firebaseObject(ref);
  syncObject.$bindTo($scope, "item");
  console.log(syncObject);
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

.controller('ChatsCtrl', function($scope, Chats) {  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
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

.controller('CardsCtrl', function($scope, TDCardDelegate, $firebaseArray, localStorageService, $ionicPopup) {
  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'It\'s a Match!',
      template: 'Owner also likes one of your items!'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
      } else {
        console.log('You are not sure');
      }
    });
  };

  $scope.cards = [];
  var currentuserId = localStorageService.get("userID");
  var userName = localStorageService.get("userName");

  var itemref = new Firebase("https://project-timber.firebaseio.com/items");
  var items = $firebaseArray(itemref);

  items.$loaded().then(function() {
    $scope.cards = _.filter(items, function(item) {
      console.log(item.userId !== currentuserId);
      return item.userId !== currentuserId;
    });
  });

  // $scope.cards = Array.prototype.slice.call($scope.cards, 0);

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  var likeref = new Firebase("https://project-timber.firebaseio.com/likes");

  $scope.likes = $firebaseArray(likeref);

  //new likes/ dislikes
  $scope.addNewLikes = function(item) {
    $scope.likes.$add(
      { 
        userId: currentuserId,//current user's own id
        ownerId: item.userId,//owner's id
        itemId: item.$id,
        like: true
      }
    )
  };

  //new likes/ dislikes
  $scope.addNewDisLikes = function(item) {
    $scope.likes.$add(
      { 
        userId: currentuserId,//current user's own id
        ownerId: item.userId,//owner's id
        itemId: item.$id,
        like: false
      }
    )
  };

  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    var item = $scope.cards[index];
    $scope.addNewDisLikes(item);
    // $scope.cardDestroyed(index);
  };

  var arrayItemILike = [];

  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
    var item = $scope.cards[index];
    console.log("item i likes");
    console.log(item);//item i like
    $scope.addNewLikes(item);
    $scope.likes.$loaded().then(function() {
      var match = _.filter($scope.likes, function(like) {
        return like.ownerId === currentuserId;
      });
      console.log("should be getting item which is liked by others in return");
      console.log(match);//item which is like by other
      if (match.length !== 0){
        console.log("Match!");
        $scope.showConfirm();

        //store arrayItemILike in database-matches
        var matchref = new Firebase("https://project-timber.firebaseio.com/matches");

          $scope.matches = $firebaseArray(matchref);
          $scope.addNewMatches = function(item) {
            $scope.matches.$add(
              { 
                userId: currentuserId,
                ownerId: item.userId,
                ownerName: item.ownerName,
                itemId: item.$id,
                itemimageUrl: item.imageUrl,
                itemName: item.itemName,
                itemDescription: item.itemDescription
              }
            )
          };
          $scope.addNewMatches(item);
        arrayItemILike.push(item);
      }
        console.log("print the item i like array");
        console.log(arrayItemILike);

    });
    $scope.cardDestroyed(index);
  };
})

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