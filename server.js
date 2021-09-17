const express = require('express');
const app     = express();
const port    = process.env.PORT || 3000;
const server  = require('http').createServer(app);
const io      = require('socket.io')(server);

app.use(express.static('public')); // Config static folder files
app.set('view engine', 'ejs');
app.set('views', './views');

// ROUTE
app.get('/', (req, res) => {
  res.render('client');
});

var userArray = []; // Delcare Global User Register Array

io.on('connection', (socket) => {
   console.log('Has 1 person connection...' + socket.id);

   // Server listen logout from client
   socket.on('logout', () => {
      userArray.splice(userArray.indexOf(socket.username), 1);
      socket.broadcast.emit('Server-send-list-user', userArray);
   });
  
   socket.on('Client-send-data', (data) => {
      console.log(socket.id + ' just send: ' + data);
      // Kiểm tra user đã tồn tại mảng và báo về client đăng ký thất bại.
      if (userArray.indexOf(data) >= 0) {
         socket.emit('Server-send-data-fail');
      } else {
         // Thêm phần tử username đăng ký vào mảng
         userArray.push(data);
         /*****************************************************
          * Tạo thêm 1 property [username] ở biến socket
          * socket.id đã có sẵn & bg tạo thêm socket.username để 
          * hiển thị tên ra ngoài. Gán cho username = data.
          *****************************************************/ 
         socket.username = data;
         socket.emit('Server-send-data-success', data);
         // Phát cho tất cả mọi người để thấy mình online
         io.sockets.emit('Server-send-list-user', userArray);
      }
   });

   // Server listen messages from client
   socket.on('Client-send-message', (data) => {
      io.sockets.emit('Server-send-message', {un: socket.username, nd: data});
   });

   // Server listen user typing
   socket.on('typing', () => {
      var ty = socket.username;
      io.sockets.emit('who-typing', ty);
   });
   // Server listen user cancle typing
   socket.on('cancle-typing', () => {
      io.sockets.emit('who-cancle-typing');
   });

   /***************************************************
    * CREATE ROOM SECTION - CREATE ROOM FOR CHAT GROUP
    ****************************************************/
    socket.on('create-room', (data) => {
      //console.log(data);
      /***********************************************
       *  Không có hàm tạo room chỉ có hàm join room
       *  Khi tạo 1 room có trùng tên với room đã tồn tại thì sẽ 
       *  join vào luôn.
       *  Hàm log kiểm tra rooms: socket.apdater.rooms
       ************************************************/
      socket.join(data);
      socket.group = data;
      console.log(socket.adapter.rooms); // Kiểm tra log rooms

      var groupArray = [];
      for(r in socket.adapter.rooms){
         groupArray.push(r);
      }
      io.sockets.emit('Server-send-group', groupArray);

   });

});

server.listen(port, () => console.log(`listening on http://localhost:${port}`));
