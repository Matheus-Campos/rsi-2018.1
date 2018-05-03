import { createServer, Socket, Server } from 'net';

const port: number = 11550;

class PTAServer extends Server {

    // define a porta e a lista de arquivos
    private files: Array<string> = ['file1.txt', 'file2.txt', 'file3.txt'];
    // private seq_num: number = 0; // número da sequência começa em 0
    private ready: boolean = false;
    
    constructor(listener?: ((socket: Socket) => void)) { super(listener); }

    /**
     * alterna o estado da FSM
     */
    toggleState(): void {
        if (this.ready) {
            this.ready = false;
        } else {
            this.ready = true;
        }
    }

    // getters
    isReady(): boolean {
        return this.ready;
    }

    getFiles(): Array<string> {
        return this.files;
    }

}

// declara a função respond
var respond: ((reply: string, args?: string) => void);

const pta = new PTAServer((connection) => {
    console.log('client connected [' + connection.remoteAddress + ']');

    connection.on('data', (data: Buffer) => {
        var message = data.toString().replace('\r\n', '').split(' ');
        var seq_num = message[0];
        var command = message[1];

        // função para responder ao cliente
        respond = (reply: string, args?: string): void => {
            if (args) {
                connection.write(seq_num + ' ' + reply + ' ' + args + '\n');
            } else {
                connection.write(seq_num + ' ' + reply + '\n');
            }
        }

        if (!+seq_num || !command) {
            connection.write('500\n');
            connection.end();
            return;
        }

        if (pta.isReady()) {
            console.log('Está pronto');
            switch (command) {
                case 'TERM':
                    if (message.length > 2) {
                        respond('NOK');
                    } else {
                        respond('OK');
                        connection.end();
                        pta.toggleState();
                    }
                    break;
                case 'PEGA':
                    let args = message[2].replace('\n', '');
                    let files = pta.getFiles();
                    var i: number = -1;
                    files.forEach((value, index) => {
                        if (args === value) {
                            i = index;
                        }
                    });
                    if (i === -1) {
                        respond('NOK');
                    } else {
                        respond('ARQ', files[i]);
                    }
                    break;
                case 'LIST':
                    if (message.length > 2) {
                        respond('NOK');
                    } else {
                        let files = pta.getFiles();
                        respond('ARQS', files.length + ' ' + files.toString());
                    }
                    break;
                default:
                    respond('NOK');
                    break;
            }
        } else {
            switch (command) {
                case 'CUMP':
                    if (message.length > 2) {
                        let args = message[2].replace('\n', '');
                        if (args === 'client') {
                            respond('OK');
                            pta.toggleState();
                            break;
                        }
                    }                    
                default:
                    respond('NOK');
                    connection.end();
                    break;
            }
        }

    });

    connection.on('close', (had_error) => {
        if (had_error) {
            console.log('Error 500');
        }
        if (pta.isReady()) {
            pta.toggleState();
        }
        console.log('client disconnected [' + connection.remoteAddress + ']');
    });

});

// começa a escutar as requisições
pta.listen(port);
console.log('processo ' + process.pid + ' rodando na plataforma ' + process.platform);
console.log('Escutando na porta 11550...')