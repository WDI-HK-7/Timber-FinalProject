angular.module('starter.controllers')

.controller('ChatDetailCtrl', function($scope, $stateParams, $firebaseArray, localStorageService) {

  var currentuserId = localStorageService.get("userID");
  var userName = localStorageService.get("userName");

  var userref = new Firebase("https://project-timber.firebaseio.com/users");
  $scope.users = $firebaseArray(userref);

   var chatDetailRef = new Firebase("https://project-timber.firebaseio.com/chatsDetails");
  $scope.chatsDetail = $firebaseArray(chatDetailRef);
  
  $scope.users.$loaded().then(function(){
    var chatUser = _.filter($scope.users, function(user){
      console.log(user.$id === currentuserId)
      return (user.$id === currentuserId);
    })

    console.log(chatUser);

    $scope.addNewChatDetails = function(user){
      $scope.chatsDetail.$add(
        {
          fromUser: userName,
          fromUserId: currentuserId,
          toUser: user.matchUserName,
          toUserId: user.matchUserId,
          toUserImage: user.userImage,
          text:""
        }
      )
    }
  })
})