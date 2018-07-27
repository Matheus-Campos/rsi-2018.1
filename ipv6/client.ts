// importa os métodos necessários
import { createConnection } from 'net';

// define as variáveis com base nos argumentos
const port: number = 5000;
const host: string = process.argv[2];
const msg: string = process.argv[3];

// cria a conexão com o servidor
const connection = createConnection({
    host: host,
    port: port
});

// configura para imprimir os dados recebidos do servidor
connection.on('data', (data: Buffer) => {
    console.log(data.toString());
});

// envia a mensagem obtida pelos argumentos e
// em seguida envia o pacote FIN para término da conexão
connection.end(msg);
