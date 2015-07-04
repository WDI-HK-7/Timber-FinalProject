angular.module('starter.controllers')

.controller('ChatsCtrl', function($scope, Chats, $firebaseObject, $firebaseArray, localStorageService) { 

  var currentuserId = localStorageService.get("userID");
  var userName = localStorageService.get("userName");


  var userref = new Firebase("https://project-timber.firebaseio.com/users");
  $scope.users = $firebaseArray(userref);
  console.log($scope.users);

  $scope.users.$loaded().then(function(){
    var chatUser = _.filter($scope.users, function(user){
      console.log(user.$id === currentuserId)
      return (user.$id === currentuserId);
    })
    var chatref = new Firebase("https://project-timber.firebaseio.com/chats");
    $scope.chats = $firebaseArray(chatref);
    console.log(chatUser);

    var arrayChat = [];

    $scope.addNewChatUser = function(user){
      // chatref.orderByChild('toUserId').equalTo(user.matchUserId).on('value', function(resources){
      //   console.log(resources.val());
        // var newResources = resources.val();
        // for (var key in newResources) {
        //   var newResource  = newResources[key];
        //   newResource.id = key;
        //   arrayChat.push(newResource);
        // }

        // console.log(arrayChat);

        // var userIds = _.pluck(arrayChat,'toUserId');
        // var Bool = userIds.indexOf(chatUser.matchUserId);

        // if (Bool === -1){
          $scope.chats.$add(
            {
              fromUser: userName,
              fromUserId: currentuserId,
              toUser: user.matchUserName,
              toUserId: user.matchUserId,
              text:""
            }
          )
        // }
      // })
    };
    $scope.addNewChatUser(chatUser[0]);
    //Recipricate: the other guy should be able to start chatting as well
  })


  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})