angular.module('starter.services', ['ionic', 'ionic.contrib.ui.tinderCards'])


// .factory('Items', function() {
//   var items = [{
//     id: 0,
//     ownerName: 'Wilson',
//     itemName: 'ABC',
//     itemDescription: 'ABC description',
//     picture: '../../img/Wilson1.jpg'
//   }, {
//     id: 1,
//     ownerName: 'Wilson',
//     itemName: 'DEF',
//     itemDescription: 'DEF description',
//     picture: '../../img/Wilson2.jpg'
//   }, {
//     id: 2,
//     ownerName: 'Wilson',
//     itemName: 'GHI',
//     itemDescription: 'GHI description',
//     picture: '../../img/Wilson14.jpg'
//   }, {
//     id: 3,
//     ownerName: 'Wilson',
//     itemName: 'JKL',
//     itemDescription: 'JKL description',
//     picture: '../../img/Wilson22.jpg'
//   }, {
//     id: 4,
//     ownerName: 'Wilson',
//     itemName: 'MNO',
//     itemDescription: 'MNO description',
//     picture: '../../img/Wilson3.jpg'
//   }, {
//     id: 5,
//     ownerName: 'Wilson',
//     itemName: 'PQR',
//     itemDescription: 'PQR description',
//     picture: '../../img/Wilson4.jpg'
//   }, {
//     id: 6,
//     ownerName: 'Wilson',
//     itemName: 'WST',
//     itemDescription: 'WST description',
//     picture: '../../img/Wilson5.jpg'
//   }];

//   return{
//     allitems: function() {
//       return items;
//     }
//   };
// })


.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
