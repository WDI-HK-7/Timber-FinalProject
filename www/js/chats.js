angular.module('starter.controllers')

.controller('ChatsCtrl', function($scope, $firebaseObject, $firebaseArray, localStorageService) { 

  var currentuserId = localStorageService.get("userID");
  var userName = localStorageService.get("userName");


  var userref = new Firebase("https://project-timber.firebaseio.com/users");
  $scope.users = $firebaseArray(userref);

  var chatref = new Firebase("https://project-timber.firebaseio.com/chats");
  $scope.chats = $firebaseArray(chatref);
  

  var myChatList = [];
  //get user's chat contact
  chatref.orderByChild('fromUserId').equalTo(currentuserId).on('value', function(resources){
    console.log(resources.val());
    var newResources = resources.val();
    for (var key in newResources) {
      var newResource  = newResources[key];
      newResource.id = key;
      myChatList.push(newResource);
    }
    $scope.chats = myChatList;
    console.log(myChatList);
  });

  $scope.users.$loaded().then(function(){
    var chatUser = _.filter($scope.users, function(user){
      console.log(user.$id === currentuserId)
      return (user.$id === currentuserId);
    })


    var arrayChat = [];

    $scope.addNewChatUser = function(user){
      var chatref = new Firebase("https://project-timber.firebaseio.com/chats");
      $scope.chats = $firebaseArray(chatref);

      chatref.orderByChild('toUserId').equalTo(user.matchUserId).on('value', function(resources){
        console.log(resources.val());
        var newResources = resources.val();
        for (var key in newResources) {
          var newResource  = newResources[key];
          newResource.id = key;
          arrayChat.push(newResource);
        }

        console.log(arrayChat);

        var userIds = _.pluck(arrayChat,'toUserId');
        var Bool = userIds.indexOf(user.matchUserId);
        console.log(Bool);

        if (Bool === -1){
          $scope.chats.$add(
            {
              fromUser: userName,
              fromUserId: currentuserId,
              toUser: user.matchUserName,
              toUserId: user.matchUserId,
              toUserImage: user.userImage
            }
          )
        }
      })
    };
    $scope.addNewChatUser(chatUser[0]);

  })

})