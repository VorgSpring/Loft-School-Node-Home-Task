const io = require('socket.io')(server);
const logger = require('../logger/index');

let clients = {};

const chat = server => {

  io.on('connection', client => {
    const clientData = {
      id: client.id,
      username: client.handshake.headers.username
    };

    logger.info(`Пользователь ${client.handshake.headers.username} вошел в чат. Общее количество пользователей в чате: ${Object.keys(clients).length + 1}`);
    client.broadcast.emit('new user', clientData);
    clients[client.id] = clientData;
    client.emit('all users', clients);

    client.on('chat message', (msg, targetClientId) => {
      logger.info('Сообщение: ', msg, 'ID пользователя: ', targetClientId);
      logger.info('ID пользователя - %s', client.id);
      client.broadcast
        .to(targetClientId)
        .emit('chat message', msg, client.id);
    });

    client.on('disconnect', () => {
      delete clients[client.id];
      client.broadcast.emit('delete user', client.id);
      logger.info(`Пользователь ${client.handshake.headers.username} покинул чат. Общее количество пользователей в чате: ${Object.keys(clients).length}`);
    });
  });
};

module.exports = chat;