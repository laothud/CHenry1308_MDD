var disasterRelief = angular.module('disasterRelief', ['firebase']);

disasterRelief.run(['angularFireAuth', function(angularFireAuth){
	var url = "https://chrishenry.firebaseio.com/";
	angularFireAuth.initialize(url, {'name':'user', 'path':'/'});
}]);

disasterRelief.config(function ($routeProvider){
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
		templateUrl:"view/templates/landing.html",
		authRequired: true	
	})

	.when("/adminLanding", {
		controller:"Core",
		templateUrl:"view/templates/adminLanding.html",
		authRequired: true
	})

	.otherwise({redirectTo:"/"});
})

.controller('Core', ['$scope', 'angularFireCollection', 'angularFireAuth', function mtCtrl($scope, angularFireCollection, angularFireAuth){
	var url = 'https://chrishenry.firebaseio.com/disasterRelief/survivors';

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

	$scope.logout = function(){
		console.log('user signed out');
		angularFireAuth.logout();
		$scope.user = null;
		window.location = "#/"
	};
}])

.controller('Login',['$scope', 'angularFireCollection', 'angularFireAuth','$location', function mtCtrl($scope, angularFireCollection, angularFireAuth,$location){
	var url = 'https://chrishenry.firebaseio.com/disasterRelief/users';

	var myConn 	= new Firebase('https://chrishenry.firebaseio.com/disasterRelief/users');

	//Gets the users from firebase.
	$scope.users = angularFireCollection(url, $scope, 'users', []);

	var auth = new FirebaseSimpleLogin(myConn, function(error, user) {
	});

	$scope.addUser = function(){
		//add user to database as admin and to the email databse.
		auth.createUser($scope.email, $scope.password, function(error, user) {
		  if (!error) {
		  	$scope.email="";
		  	$scope.password="";
		  }else{
		  	$scope.email="";
		  	$scope.password="";
		  	console.log(error);
		  }
		});
	}

	$scope.userlogin = function(){
		var admin = false;

		for (var i = $scope.users.length - 1; i >= 0; i--) {
			if ($scope.users[i].email == $scope.email) {
				admin=true;
			}
		};

		if (admin) {
			angularFireAuth.login('password', {
			  email: $scope.email,
			  password: $scope.password
			}).then(function(e)
			{
				// when login is successfull
				$location.path("/adminLanding");
			},function(error)
			{
				// when login fails
				$location.path("/personnellogin");
			});
			
			console.log("login clicked");
		}else{
			angularFireAuth.login('password', {
			  email: $scope.email,
			  password: $scope.password
			}).then(function(e)
			{
				// when login is successfull
				$location.path("/landing");
			},function(error)
			{
				// when login fails
				$location.path("/personnellogin");
			});
		};
	}
 }])

