angular.module('starter.controllers')

.controller('ChatDetailCtrl', function($scope, $stateParams, $firebaseArray, localStorageService) {

  var currentuserId = localStorageService.get("userID");
  var userName = localStorageService.get("userName");

  var userref = new Firebase("https://project-timber.firebaseio.com/users");
  $scope.users = $firebaseArray(userref);

  // var chatDetailRef = new Firebase("https://project-timber.firebaseio.com/chatsDetails");
  // $scope.chatsDetails = $firebaseArray(chatDetailRef);

  // var allChats = [];

  // chatDetailRef.on("value",function(resources){
  //   console.log(resources.val());
  //   var newResources = resources.val();
  //   for (var key in newResources) {
  //     var newResource  = newResources[key];
  //     newResource.id = key;
  //     allChats.push(newResource);
  //   }
  //   console.log(allChats);

  //   var cleanChats = [];
  //   var unique = {};

  //   allChats.forEach(function(chat){
  //     if (!unique[chat.timestamp]){
  //       cleanChats.push(chat);
  //       unique[chat.timestamp] = chat;
  //     }
  //   })
  //   console.log(cleanChats);
  //   $scope.chatsDetails = cleanChats;

  // });

  var chatDetailRef = new Firebase("https://project-timber.firebaseio.com/chatsDetails");
    $scope.chatsDetails = $firebaseArray(chatDetailRef);

    $scope.chatsDetails.$loaded();
  
  $scope.users.$loaded().then(function(){
    var chatUserDetail = _.filter($scope.users, function(user){
      console.log(user.$id === currentuserId);
      return (user.$id === currentuserId);
    })

    console.log(chatUserDetail);

    $scope.addNewChatDetails = function(newMessage){

    var chatDetailRef = new Firebase("https://project-timber.firebaseio.com/chatsDetails");
    $scope.chatsDetails = $firebaseArray(chatDetailRef);

      $scope.chatsDetails.$add(
        {
          fromUser: userName,
          fromUserId: currentuserId,
          toUser: chatUserDetail[0].matchUserName,
          toUserId: chatUserDetail[0].matchUserId,
          toUserImage: chatUserDetail[0].userImage,
          text: newMessage,
          timestamp: Firebase.ServerValue.TIMESTAMP
        }
      )
    }
  })
})