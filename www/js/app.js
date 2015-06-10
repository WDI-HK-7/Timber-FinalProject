angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {

      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('intro', {
    url: '/',
    templateUrl: 'templates/intro.html',
    controller: 'IntroCtrl'
  })

  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('tab.itemprofile', {
    url: "/profile/:itemId",
    views: {
      'tab-profile':{
        templateUrl: "templates/item-profile.html",
        controller: 'YourItemProfileCtrl'
      }
    }
  })
  
  .state('tab.chats', {
    url: '/chats',
    views: {
      'tab-chats': {
        templateUrl: 'templates/tab-chats.html',
        controller: 'ChatsCtrl'
      }
    }
  })

  .state('tab.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'tab-chats': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'ChatDetailCtrl'
      }
    }
  })

  .state('tab.swipe', {
    url: '/swipe',
    views: {
      'tab-swipe': {
        templateUrl: 'templates/tab-swipe.html',
        controller: 'CardsCtrl'
      }
    }
  })

  .state('tab.matches', {
    url: '/matches',
    views: {
      'tab-matches': {
        templateUrl: 'templates/tab-matches.html',
        controller: 'MatchesCtrl'
      }
    }
  })

  .state('tab.match', {
    url: "/matches/:itemsId",
    views: {
      'tab-matches':{
        templateUrl: "templates/match.html",
        controller: 'MatchCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/');

});
