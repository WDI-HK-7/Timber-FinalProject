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
        ownerName: item.ownerName,
        itemId: item.$id,
        itemName: item.itemName,
        itemimageUrl: item.imageUrl,
        itemDescription: item.itemDescription,
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
        ownerName: item.ownerName,
        itemId: item.$id,
        itemName: item.itemName,
        itemimageUrl: item.imageUrl,
        itemDescription: item.itemDescription,
        like: false
      }
    )
  };

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    var item = $scope.cards[index];
    $scope.addNewDisLikes(item);
    $scope.cardDestroyed(index);
  };

  var arrayItemILike = [];
  // var Import = true;

  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
    var item = $scope.cards[index];
    console.log("item i likes");
    console.log(item);//item i like
    $scope.addNewLikes(item);

    $scope.likes.$loaded().then(function() {

      var match = _.filter($scope.likes, function(like) {
        return like.ownerId === currentuserId && like.like === true;
      });

      if (match.length !== 0){
        console.log("Match!");
        console.log("should be getting item which is liked by others in return");
        console.log(match);//item which is like by other    
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
              itemDescription: item.itemDescription,
              like: true
            }
          )
        };
        $scope.addNewMatches(item);
        arrayItemILike.push(item);


        //Recipricate: update the other guy's matches collection
        var arrayMatchItemLiked = [];
        
        for (var i=0; i<match.length; i++){
          $scope.addNewMatches2 = function(match) {
            matchref.orderByChild('itemId').equalTo(match.itemId).on('value', function(resources){
              console.log(resources.val());

              var newResources = resources.val();
              for (var key in newResources) {
                var newResource  = newResources[key];
                newResource.id = key;
                arrayMatchItemLiked.push(newResource);
              }
              console.log(arrayMatchItemLiked);

              var itemIds = _.pluck(arrayMatchItemLiked, 'itemId');
              var Bool =  itemIds.indexOf(match.itemId);
              console.log(itemIds);
              console.log($scope.matches);
              console.log(match.itemId);
              console.log(Bool);
              if (Bool === -1){

                $scope.matches.$add(
                  { 
                    userId: match.userId,
                    ownerId: currentuserId,
                    ownerName: userName,
                    itemId: match.itemId,
                    itemimageUrl: match.itemimageUrl,
                    itemName: match.itemName,
                    itemDescription: match.itemDescription,
                    like: true
                  }
                )
              } 
            })
          };
          $scope.addNewMatches2(match[i]);
        };

        //update matchUserId in users collection
        var userIDRef = new Firebase("https://project-timber.firebaseio.com/users/" + currentuserId);
        userIDRef.update({
          matchUserId: item.userId,
          matchUserName: item.ownerName
        })

        //Recipricate: update the other guy's users collection

        var userID2Ref = new Firebase("https://project-timber.firebaseio.com/users/" + item.userId);

        userID2Ref.update({
          matchUserId: currentuserId,
          matchUserName: userName
        })
      }
      console.log("print the item i like array");
      console.log(arrayItemILike);

    });
    $scope.cardDestroyed(index);
  };
})