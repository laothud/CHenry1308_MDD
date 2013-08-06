angular.module('chat', ['firebase'])

.controller('Core', ['$scope', 'angularFireCollection', function mtCtrl($scope, angularFireCollection){
	var url = 'https://fullsail.firebaseio.com/chat';

	//Gets the messages from firebase.
	$scope.messages = angularFireCollection(url, $scope, 'msgs', []);

	var fbUser;

	// Creates an instance of Firebase and connects to our URL
	var myConn 	= new Firebase('https://fullsail.firebaseio.com/chat');

	// instance of firebase connection to login with 
	var auth = new FirebaseSimpleLogin(myConn, function(error, user) {
	  console.log('Hey We\'re in', user);
	  fbUser = user;
	});

	$scope.addMsg = function (){
		$scope.messages.add({name: fbUser.name, text: $scope.MsgInput});
		$scope.MsgInput = "";
	}

	$scope.login = function(){
		auth.login('facebook');
	}
}])