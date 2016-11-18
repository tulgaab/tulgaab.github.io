var app =  angular.module('chatApp', ['firebase']);
 
	app.controller('chatController', ['$scope','Message', function($scope,Message){

			$scope.user="Guest";
 
			$scope.messages= Message.all;

			$scope.inserisci = function(message){
				Message.create(message);
			};
	}]);
 
	app.factory('Message', ['$firebase',
	function($firebase) {
		var ref = new Firebase('https://tulgapp-ba512.firebaseio.com');
		var messages = $firebase(ref.child('messages')).$asArray();

		var Message = {
			all: messages,
			create: function (message) {
				return messages.$add(message);
			},
			get: function (messageId) {
				return $firebase(ref.child('messages').child(messageId)).$asObject();
			},
			delete: function (message) {
				return messages.$remove(message);
			}
		};

		return Message;

	}
	]);


app.controller('AuthCtrl', [
  '$scope', '$rootScope', '$firebaseAuth', function($scope, $rootScope, $firebaseAuth) {
    var ref = new Firebase('https://tulgapp-ba512.firebaseio.com/');
    $rootScope.auth = $firebaseAuth(ref);
    
    $scope.signIn = function () {
      $rootScope.auth.$login('password', {
        email: $scope.email,
        password: $scope.password
      }).then(function(user) {
        $rootScope.alert.message = '';
      }, function(error) {
        if (error = 'INVALID_EMAIL') {
          console.log('email invalid or not signed up — trying to sign you up!');
          $scope.signUp();
        } else if (error = 'INVALID_PASSWORD') {
          console.log('wrong password!');
        } else {
          console.log(error);
        }
      });
    }

    $scope.signUp = function() {
      $rootScope.auth.$createUser($scope.email, $scope.password, function(error, user) {
        if (!error) {
          $rootScope.alert.message = '';
        } else {
          $rootScope.alert.class = 'danger';
          $rootScope.alert.message = 'The username and password combination you entered is invalid.';
        }
      });
    }
  }
]);

app.controller('AlertCtrl', [
  '$scope', '$rootScope', function($scope, $rootScope) {
    $rootScope.alert = {};
  }
]);
