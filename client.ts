import { connect } from 'net';

const host: string = 'localhost';
const port: number = 11550;

let client = connect(port, host);

client.once('connect', () => client.write('CUMP client'));

client.on('data', (message) => {
    console.log(message.toString());
});