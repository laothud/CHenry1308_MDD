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

	.when("/confirm", {
		controller:"Core",
		templateUrl:"view/templates/confirm.html"
	})

	.otherwise({redirectTo:"/"});
})

.controller('Core', ['$scope', 'angularFireCollection', 'angularFireAuth', function mtCtrl($scope, angularFireCollection, angularFireAuth){
	var url = 'https://chrishenry.firebaseio.com/disasterRelief/survivors';

	 //Gets the survivors from firebase.
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

	var url2 = 'https://chrishenry.firebaseio.com/disasterRelief/users';
	$scope.users = angularFireCollection(url2, $scope, 'users', []);
	
	$scope.addSurvivorFB = function (){
		console.log(fbUser);
		$scope.survivors.add({name: fbUser.name, status:"Confirmed", href:fbUser.link});
		$scope.SurvivorName = "";
	}

	$scope.addManuelSurvivor = function (){
		console.log("clicked manuel add")
		$scope.survivors.add({name: $scope.SurvivorName, status:"Confirmed", href:"#/confirm", dl: $scope.SurvivorDL, dob: $scope.SurvivorDOB});
		$scope.SurvivorName = "";
		$scope.SurvivorDL = "";
		$scope.SurvivorDOB = "";
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

	$scope.deleteSurvivor = function(myid){
		console.log("delete clicked and id is: "+ myid)
		$scope.survivors.remove(myid);
	};
}])

.controller('Login',['$scope', 'angularFireCollection', 'angularFireAuth','$location', function mtCtrl($scope, angularFireCollection, angularFireAuth,$location){
	var url = 'https://chrishenry.firebaseio.com/disasterRelief/users';

	var myConn 	= new Firebase('https://chrishenry.firebaseio.com/disasterRelief/users');

	//Gets the users from firebase.
	$scope.users = angularFireCollection(url, $scope, 'users', []);

	var auth = new FirebaseSimpleLogin(myConn, function(error, user) {
	});

	$scope.errordisplay = false;

	$scope.addUser = function(){
		//add user to database as admin and to the email databse.
		auth.createUser($scope.email, $scope.password, function(error, user) {
		  if (!error) {
		  	errordisplay = false;
		  	$scope.email="";
		  	$scope.password="";
		  	$scope.msg ="Added user to the database";
		  }else{
		  	$scope.email="";
		  	$scope.password="";
		  	$scope.errordisplay = true;
		  	$scope.myerror = error.code;
		  }
		});
	}

	$scope.userlogin = function(){
		//user login for the personnel page
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

