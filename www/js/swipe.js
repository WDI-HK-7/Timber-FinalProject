angular.module('starter.controllers')

.controller('CardsCtrl', function($scope, TDCardDelegate, $firebaseArray, localStorageService, $ionicPopup, $firebaseObject) {
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
  $scope.likes = [];

  var currentuserId = localStorageService.get("userID");
  var userName = localStorageService.get("userName");

  var itemref = new Firebase("https://project-timber.firebaseio.com/items");
  var items = $firebaseArray(itemref);

  var likeref = new Firebase("https://project-timber.firebaseio.com/likes");
  $scope.likes = $firebaseArray(likeref);

  items.$loaded().then(function() {
    $scope.cards = _.filter(items, function(item) {
      console.log((item.userId !== currentuserId) && (item.likeUserId !== currentuserId) && (item.dislikeUserId !== currentuserId));
      return ((item.userId !== currentuserId) && (item.likeUserId !== currentuserId) && (item.dislikeUserId !== currentuserId));
    });
  });

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  //new likes/ dislikes
  $scope.addNewLikes = function(item) {

    var itemRef = new Firebase("https://project-timber.firebaseio.com/items/" + item.$id);

      itemRef.update({
        likeUserId: currentuserId
      })

    $scope.likes.$add(
      { 
        userId: currentuserId,//current user's own id
        ownerId: item.userId,//owner's id
        itemId: item.$id,
        itemName: item.itemName,
        like: true
      }
    )
  };

  //new likes/ dislikes
  $scope.addNewDisLikes = function(item) {

    var itemRef = new Firebase("https://project-timber.firebaseio.com/items/" + item.$id);

      itemRef.update({
        dislikeUserId: currentuserId
      })

    $scope.likes.$add(
      { 
        userId: currentuserId,//current user's own id
        ownerId: item.userId,//owner's id
        itemId: item.$id,
        itemName: item.itemName,
        like: false
      }
    )
  };

  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    var item = $scope.cards[index];
    $scope.addNewDisLikes(item);
    $scope.cardDestroyed(index);
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