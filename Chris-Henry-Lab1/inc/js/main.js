var fbUser;

// Creates an instance of Firebase and connects to our URL
var myConn 	= new Firebase('https://fullsail.firebaseio.com/chat');

// instance of firebase connection to login with 
var auth 	= new FirebaseSimpleLogin(myConn, function(error, user) {
  console.log('Hey We\'re in', user);
  fbUser = user;
});


// Apply keypress listner
$('#messageInput').keypress(function (e) {

	// if Enter key hit
	if (e.keyCode == 13) {

		// attach value of inputs to vars
		var name = fbUser.displayName,
			text = $('#messageInput').val();

		// push vars to firebase
		myConn.push({name: name, text: text});

		// clear msg input
		$('#messageInput').val('');
	}
});


// listen for an entry using websockets
myConn.on('child_added', function(data) {

	// extract the value of the entry
	var message = data.val();

	// displays each chat msg
	displayChatMessage(message.name, message.text);
});

$('#fbLoginBtn').on('click',function(){
	auth.login('facebook');
});

// Takes params and builds display for msg
// @param name: string of a user name
// @param text: string content of message
function displayChatMessage(name, text) {
	$('<li/>').addClass('list-group-item').text(text).prepend($('<strong/>').text(name+': ')).appendTo($('#messagesDiv'));

	// scroll to bottom of display
	$('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
};

/* Database Structure
// {
// 	chat 	: [{name: "Chris Chapman", faceBookID : "123312312", text :"Message Content" }],
// 	users	: [{name: "Chris Chapman", score: 0, faceBookID : "123312312"}]
// }
*/