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

	.when("/landing", {
		controller:"Core",
		templateUrl:"view/templates/landing.html"
	})

	.when("/adminLanding", {
		controller:"Core",
		templateUrl:"view/templates/adminLanding.html"
	})

	.when("/hours", {
		controller:"Core",
		templateUrl:"view/templates/hours.html"
	})

	.otherwise({redirectTo:"/"});
})

.controller('Core', ['$scope', 'angularFireCollection', function mtCtrl($scope, angularFireCollection){
	var url = 'https://chrishenry.firebaseio.com/disasterRelief/survivors';

	//
	//create a check login setup to ensure site security.
	//

	 //Gets the messages from firebase.
	$scope.survivors = angularFireCollection(url, $scope, 'survivors', []);
	var fbUser;
	var clicked=false;

	// Creates an instance of Firebase and connects to our URL
	var myConn 	= new Firebase('https://chrishenry.firebaseio.com/disasterRelief');

	// instance of firebase connection to login with 
	var auth = new FirebaseSimpleLogin(myConn, function(error, user) {
		fbUser = user;
		if(fbUser && clicked){
			$scope.addSurvivorFB();
		}
	});
	
	$scope.addSurvivorFB = function (){
		$scope.survivors.add({name: fbUser.name, status:"Unconfirmed"});
		$scope.SurvivorName = "";
	}

	$scope.addSurvivor = function (){
		$scope.survivors.add({name: $scope.SurvivorName, status:"Unconfirmed"});
		$scope.SurvivorName = "";
	}

	$scope.addSurvivorUser = function (){
		$scope.survivors.add({name: $scope.SurvivorName, status:"Confirmed"});
		$scope.SurvivorName = "";
	}

	$scope.login = function(){
		clicked = true;
		auth.login('facebook');
	}


	$scope.userLogout = function (){
		//delete session data and return to login.
		console.log("Logout");
		auth.logout();
		window.location = "#/"
	}
}])

.controller('Login',['$scope', 'angularFireCollection', function mtCtrl($scope, angularFireCollection){
	var url = 'https://chrishenry.firebaseio.com/disasterRelief/users';

	var myConn 	= new Firebase('https://chrishenry.firebaseio.com/disasterRelief/users');

	//Gets the users from firebase.
	$scope.users = angularFireCollection(url, $scope, 'users', []);

	var auth = new FirebaseSimpleLogin(myConn, function(error, user) {
		if (user) {
			
		};
	});

	$scope.addAdmin = function (){
		if (user.id != users[i].id) {
			$scope.users.add({id: user.id, email: user.email})
		};
	}

	$scope.addUser = function(){
		//add user to database as admin and to the email databse.
		auth.createUser($scope.email, $scope.password, function(error, user) {
		  if (!error) {
		  	if($scope.admin){
		  		console.log('User Id: ' + user.id + ', Email: ' + user.email);
		    	$scope.users.add({id: user.id, email: user.email});
		  	}else{
		  		$scope.users.add({id: user.id, email: user.email});
		  		console.log('User Id: ' + user.id + ', Email: ' + user.email);
		  	}
		  }else{
		  	console.log(error);
		  }
		});
	}

	$scope.userlogin = function (){

		for (var i = $scope.users.length - 1; i >= 0; i--) {
			if ($scope.users[i].email == $scope.email) {
				auth.login('password', {
				  email: $scope.email,
				  password: $scope.password
				});
				window.location = "#/landing";
				console.log("login clicked");
			}else{
				auth.login('password', {
				  email: $scope.email,
				  password: $scope.password
				});
				window.location = "#/landing";
				console.log("login clicked");
			};
			
		};
	}

}])

