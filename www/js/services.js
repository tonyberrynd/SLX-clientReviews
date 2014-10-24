angular.module('starter.services', ['firebase'])

.constant('FIREBASE_URI', 'https://slxaccountrevenue.firebaseio.com/')
/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})


.factory('ItemsService',  function ($firebase, FIREBASE_URI) {
    var ref = {};
    var items = [];    
    
    var getItems = function (accountId){
      ref = new Firebase(FIREBASE_URI).child(accountId);
      items = $firebase(ref).$asArray();
      return items;
    };

    var addItem = function (item) {
        items.$add(item);
    };

    var updateItem = function (id) {
        items.$save(id);
    };

    var removeItem = function (id) {
        items.$remove(id);
    };

    return {
        getItems: getItems,
        addItem: addItem,
        updateItem: updateItem,
        removeItem: removeItem
    }
});

