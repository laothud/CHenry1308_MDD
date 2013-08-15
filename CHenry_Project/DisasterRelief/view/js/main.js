angular.module('disasterRelief', ['firebase'])

.controller('Core', ['$scope', 'angularFireCollection', function mtCtrl($scope, angularFireCollection){
	var url = 'https://chrishenry.firebaseio.com/disasterRelief';

	 //Gets the messages from firebase.
	 $scope.survivors = angularFireCollection(url, $scope, 'survivors', []);

	var fbUser;

	// Creates an instance of Firebase and connects to our URL
	var myConn 	= new Firebase('https://chrishenry.firebaseio.com/disasterRelief');

	// instance of firebase connection to login with 
	var auth = new FirebaseSimpleLogin(myConn, function(error, user) {
	  console.log('Hey We\'re in', user);
	  fbUser = user;
	});
	
	$scope.addSurvivorFB = function (){
		$scope.survivors.add({name: fbUser.name, status:"Unconfirmed"});
		$scope.SurvivorName = "";
	}

	$scope.addSurvivor = function (){
		$scope.survivors.add({name: $scope.SurvivorName, status:"Unconfirmed"});
		$scope.SurvivorName = "";
	}

	$scope.login = function(){
		auth.login('facebook');
		$scope.addSurvivorFB();
	}
}])
