// importa as classes necessárias
import { Server, Socket } from 'net';

// define a porta do servidor
const port: number = 5000;

// cria o handler para o recebimento de dados por parte do cliente
const handler = (connection: Socket) => {
    connection.on('data', (data: Buffer) => {
        connection.write(data.toString().toUpperCase());
    });
};

// instancia 2 servidores com o mesmo handler (mesma lógica)
var server = new Server(handler);
var server6 = new Server(handler);

// cada servidor escuta em 1 interface diferente
server.listen(port, '127.0.0.1');
server6.listen(port, '::1');

console.log('Listening on port ' + port + '...');