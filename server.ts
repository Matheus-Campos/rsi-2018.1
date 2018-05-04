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

const pta = new PTAServer((connection: Socket) => {
    console.log('client connected [' + connection.remoteAddress + ':' + connection.remotePort + ']');

    connection.on('data', (data: Buffer) => {
        var message = data.toString().split(' ');
        var seq_num = message[0];
        var command = message[1];

        // if (seq_num != '0' || !command) {
        //     connection.write('500\n');
        //     connection.end();
        //     return;
        // }

        // função para responder ao cliente
        respond = (reply: string, args?: string): void => {
            if (args) {
                connection.write(seq_num + ' ' + reply + ' ' + args);
            } else {
                connection.write(seq_num + ' ' + reply);
            }
        }

        if (pta.isReady()) {
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
                    let args = message[2];
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
                        let args = message[2];
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

    connection.on('close', () => {
        if (pta.isReady()) {
            pta.toggleState();
        }
        console.log('client disconnected [' + connection.remoteAddress + ':' + connection.remotePort + ']');
    });

});

// começa a escutar as requisições
pta.listen(port);
console.log('processo ' + process.pid + ' rodando na plataforma ' + process.platform);
console.log('Escutando na porta 11550...\n');