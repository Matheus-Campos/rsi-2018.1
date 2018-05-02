import { createServer } from 'net';

const port: number = 11550;

const server = createServer((connection) => {
    connection.write('Hello, I am the server!');
    connection.on('data', (message) => {
        console.log(message.toString());
    });
}).listen(port);