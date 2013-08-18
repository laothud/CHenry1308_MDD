var disasterRelief = angular.module('disasterRelief', ['firebase'])

.config(function ($routeProvider){
	$routeProvider
	.when("/",{
		controller:"Core",
		templateUrl:"view/templates/home.html"
	})

	.when("/personnellogin",{
		controller:"Core",
		templateUrl:"view/templates/personnelLogin.html"
	})

	.otherwise({redirectTo:"/"});
})

.controller('Core', ['$scope', 'angularFireCollection', function mtCtrl($scope, angularFireCollection){
	var url = 'https://chrishenry.firebaseio.com/disasterRelief/survivors';

	 //Gets the messages from firebase.
	$scope.survivors = angularFireCollection(url, $scope, 'survivors', []);
	var fbUser;

	// Creates an instance of Firebase and connects to our URL
	var myConn 	= new Firebase('https://chrishenry.firebaseio.com/disasterRelief/survivors');

	// instance of firebase connection to login with 
	var auth = new FirebaseSimpleLogin(myConn, function(error, user) {
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

.controller('Login',['$scope', 'angularFireCollection', function mtCtrl($scope, angularFireCollection){
	var url = 'https://chrishenry.firebaseio.com/disasterRelief/users';

	var myConn 	= new Firebase('https://chrishenry.firebaseio.com/disasterRelief/users');

	//Gets the messages from firebase.
	$scope.users = angularFireCollection(url, $scope, 'users', []);

	$scope.userlogin = function(){

		var username = $scope.username;
		var pass = $scope.password;

		$scope.users.add({name: username, password: pass});

	}

}])
