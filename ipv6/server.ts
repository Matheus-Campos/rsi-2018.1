import { Server, Socket } from 'net';

const port: number = 5000;

const handler = (connection: Socket) => {
    connection.on('data', (data: Buffer) => {
        connection.write(data.toString().toUpperCase());
    });
};

var server = new Server(handler);
var server6 = new Server(handler);

server.listen(port, '127.0.0.1');
server6.listen(port, '::1');

console.log('Listening on port ' + port + '...');