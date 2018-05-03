import { createServer, Socket, Server } from 'net';

const port: number = 11550;

class PTAServer extends Server {

    // define a porta e a lista de arquivos
    private files: Array<string> = ['file1.txt', 'file2.txt', 'file3.txt'];
    private seq_num: number = 0; // número da sequência começa em 0
    connection: Socket = new Socket();
    
    constructor() { super(); }

    getSeq_num(): number {
        return this.seq_num;
    }

    getFiles(): Array<string> {
        return this.files;
    }

    respond(reply: string): void {
        this.connection.write(++this.seq_num + ' ' + reply);
    }

}

// cria o servidor e retorna a conexão com o client
/*const server = createServer((connection) => {
    // executa a função quando recebe algum dado
    connection.on('data', (message) => {
        let request = message.toString().split(' ');
        var seq_num = request[0];
        var command = request[1];

        // função criada para facilitar a resposta ao client
        function response(res: string): void {
            connection.write(seq_num + ' ' + res);
        }

        switch (command) {
            case 'CUMP':
                let name = request[2];
                if (name === 'client') {
                    response('OK');
                    break;
                }
                response('NOK');
                connection.end();
                break;
            case 'LIST':
                response('NOK');
                break;
            case 'PEGA':
                let fileName = request[1];
                var i: number = 0;
                files.forEach((value, index) => {
                    if (value === fileName) {
                        i = index;
                    }
                });
                if (i) response('SEND' + files[i]);              
                break;
            case 'TERM':
                response('OK');
                connection.end();
                break;
            default:
                response('NOK');
                break;
        }
    });

});

// começa a escutar requisições
server.listen(port);*/

var pta = new PTAServer();
pta.listen(port);