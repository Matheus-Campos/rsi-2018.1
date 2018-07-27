// importa os métodos necessários
import { connect } from 'net';

// define as variáveis com base nos argumentos
const port: number = 5000;
const host: string = process.argv[2];
const msg: string = process.argv[3];

// cria a conexão com o servidor
const connection = connect({
    host: host,
    port: port
});

// configura para imprimir os dados recebidos do servidor
connection.on('data', (data: Buffer) => {
    console.log(data.toString());
    process.exit();
});

// envia a mensagem obtida pelos argumentos
connection.write(msg);
