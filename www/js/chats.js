angular.module('starter.controllers')

.controller('ChatsCtrl', function($scope, Chats, localStorageService) { 
  var currentuserId = localStorageService.get("userID");
  var userName = localStorageService.get("userName"); 
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})