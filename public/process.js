const socket = io(); // Install Socket IO on Client 

// Listen Register Fail
socket.on('Server-send-data-fail', function(){
   alert('Register Fail ! Username has existed, please choose another username.');
});
// Listen Register Success
socket.on('Server-send-data-success', function(data){
   $('#currentUser').html(data);
   $('#form-signin').hide(2000);
   $('#chatForm').show(1000);
});

// Listen User Online -> Duyệt mảng để render ra 1 list những user online
socket.on('Server-send-list-user', function(data){
   $('#boxContent').html('');
   data.forEach(e => { 
      $('#boxContent').append('<div class="chat_people mb-3"><div class="chat_img"><img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div><div class="chat_ib"><h5>' + e + '</h5></div></div>');
   });
});

socket.on('Server-send-message', function(data){
   $('#incoming_msg').append('<div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div><div class="received_msg"><div class="received_withd_msg"><h5>' + data.un + '</h5><p>' + data.nd + '</p><span class="time_date"> 11:01 AM | June 9</span></div></div>');
});

socket.on('who-typing', function(data){
   $('#typing-indicator').html(data + '<img src="typing-idi.gif" width="40"/>');
});

socket.on('who-cancle-typing', function(){
   $('#typing-indicator').html('');
});

// ROOM SECTION :::::::::::::::::::
socket.on('Server-send-group', function(data){
   data.map(function(r) { 
      $('#testGroup').append('<div class="chat_group mb-3"><div class="chat_img"><img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div><div class="chat_ib_group"><h5>' + r + '</h5></div></div>');
   });
});

$(document).ready(function () { 
   $('#form-signin').show();
   $('#chatForm').hide();

   // Listen Input Username Register
   $('#btnRegister').click(function (e) { 
      e.preventDefault();
      socket.emit('Client-send-data', $('#username').val());
   });

   $('#btnLogout').click(function (e) { 
      e.preventDefault();
      socket.emit('logout');
      $('#form-signin').show(1000);
      $('#chatForm').hide(2000);
   });

   $("#btnSendMessage").click(function () { 
      socket.emit('Client-send-message', $('#message').val());
      $('#message').val('');
   });

   $('#message').focusin(function(){             
      socket.emit('typing');
   });

   $('#message').focusout(function(){
      socket.emit('cancle-typing');
   });

   // CREATE ROOM SECTION ::::::::::::::::
   $('#btnRoom').click(function () { 
      socket.emit('create-room', $('#txtRoom').val());
   });

});

