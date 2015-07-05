angular.module('starter.controllers', ['ionic','ionic.contrib.ui.tinderCards','firebase', 'LocalStorageModule'])

.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $ionicModal ,$ionicPopup, $timeout, localStorageService, $firebaseArray) {
  
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

            var arrayMyMatch = [];
            var matchref = new Firebase("https://project-timber.firebaseio.com/matches");
            var matches = $firebaseArray(matchref);
            console.log(matches.length);

            matchref.orderByChild("userId").equalTo(authData.uid).on('value', function(resources){
              var newResources = resources.val();
              for (var key in newResources) {
                var newResource  = newResources[key];
                newResource.id = key;
                arrayMyMatch.push(newResource);
              }
              console.log(arrayMyMatch.length);
              if (arrayMyMatch.length === 0){
                refFB.child("users").child(authData.uid).set({

                  provider: authData.provider,
                  name: authData.facebook.displayName,
                  matchUserId: "",
                  matchUserName: "",
                  userImage: "http://www.lovehkfilm.com/people/st9999/kaneshiro_takeshi_1.jpg"
                })
              }else{
                refFB.child("users").child(authData.uid).set({

                  provider: authData.provider,
                  name: authData.facebook.displayName,
                  matchUserId: arrayMyMatch[0].ownerId,
                  matchUserName: arrayMyMatch[0].ownerName,
                  userImage: "http://www.lovehkfilm.com/people/st9999/kaneshiro_takeshi_1.jpg"
                })
              }
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