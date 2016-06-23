function ID () {
  return Math.random().toString(10).substr(2, 9);
};

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomString (length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function randomBoolean (){
    var randomNumber = Math.random() >= 0.5;
	return randomNumber;
}

var version = 3;
var names = ["A", "B", "c", "D", "e", "F", "g", "H", "i", "J", "k", "L", "m", "N", "o", "P", "r", "S", "t", "U", "v", "Z", "x", "Y", "z"];

var nickName = "";
for(var a = 1; a <= 5; a++){
	var num = Math.floor(Math.random() * (names.length - 1));
	nickName = nickName.concat(names[num]);
}

var server = io();
var chat = io();

server.emit('joinnick', nickName);
console.log(nickName);

$('form').submit(function(){
	var regName = /^\/nick ([a-zA-Z0-9]{0,20})/g;
	var ray1 = regName.exec($('#m').val());
	var mojObjekt = {
					'DATETIME' : randomDate(new Date(2012, 0, 1), new Date()),
					'USER_ID': ID(),
					'NICK' : nickName,
					'MESSAGE' : randomString(100),
					'CRITICAL_MESSAGE': randomBoolean()
					};
	chat.emit('chat', mojObjekt);
	console.log('Sending: ', JSON.stringify(mojObjekt));
	
	return false;
 });
	  	  
var sendMsgTimer;
$('#timer').click(function(){
	var timerObj = $('#timer');
	var timerState = timerObj.attr('state');
	if (timerState == 'sending'){
		clearInterval(sendMsgTimer);
		timerObj.attr('state', 'stopped');
		timerObj.text('Start sending');
		timerObj.removeClass();
		timerObj.addClass('timer-stopped');
	}else{
		timerObj.attr('state', 'sending');
		timerObj.text('Stop sending');
		timerObj.removeClass();
		timerObj.addClass('timer-started');
		// Start sending
		sendMsgTimer = setInterval(function() {
		//console.log('Sending message...');
		$('form').submit();
		}, 1000);
	}
});

chat.on('chat', function(msg){
	console.log('Recieving: ', JSON.stringify(msg));
	
	var dateTimeObj = new Date(msg.DATETIME);
	console.log('JS Datetime obj: ' + dateTimeObj);
	var dateTimeFormatted = dateTimeObj.getDate() + '.' + (dateTimeObj.getMonth()+1) + '.' +  dateTimeObj.getFullYear() + '.g. Vrijeme: ' + dateTimeObj.getHours() + ':' + dateTimeObj.getMinutes() + ':' + dateTimeObj.getSeconds();
	
	var tex =  'Datum: ' + dateTimeFormatted + ' : User ID: ' + msg.USER_ID + ' : Username: ' + msg.NICK + ' : Poruka: '+ msg.MESSAGE;

	var liClass = 'non-critical';
	// Mark critical messages
	if (msg.CRITICAL_MESSAGE){
		liClass = 'critical';
	}
	
	var appendedMessage = $('#messages').append($('<li>').text(tex).addClass(liClass));
	$('body').scrollTop($('#messages')[0].scrollHeight);
  });
  
server.on('server', function(msg){
	console.log('Server says: ', msg);
	var tex = msg;
	$('#messages').append($('<li id="server">').text(tex));
});