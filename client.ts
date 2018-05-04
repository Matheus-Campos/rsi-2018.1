import { createConnection } from 'net';

const host: string = 'localhost';
const port: number = 11550;
var seq_num: number = 1;

const connection = createConnection(port, host, () => {
    process.stdin.on('readable', () => {
        var chunk = process.stdin.read();
        if (chunk != null) {
            console.log(seq_num + ' ' + chunk.toString().replace(/\n/, ''))
            connection.write(seq_num++ + ' ' + chunk.toString().replace(/\n/, ''));
        }
    });

    connection.on('data', (data: Buffer) => {
        var message = data.toString();
        console.log(message);
    });

    connection.on('close', () => {
        connection.end();
        console.log('connection closed by host.');
        process.exit(200);
    });
});