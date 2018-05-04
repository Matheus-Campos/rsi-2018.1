import { createServer, Socket, Server } from 'net';

const port: number = 11550;

class PTAServer extends Server {

    // define a lista de arquivos e o estado do servidor
    private files: Array<string> = ['file1.txt', 'file2.txt', 'file3.txt'];
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
    getFiles(): Array<string> {
        return this.files;
    }

    isReady(): boolean {
        return this.ready;
    }

    /**
     * retorna a data e hora atual
     */
    now(): string {
        let date = new Date();
        let dateArray: any = date.toLocaleDateString().split('-');
        dateArray = dateArray.reverse().join('/');
        return dateArray + ' ' + date.toLocaleTimeString();
    }

}

// declara a função respond
var respond: ((reply: string, args?: string) => void);

const pta = new PTAServer((connection: Socket) => {
    console.log(pta.now() + ' - Client connected [' + connection.remoteAddress + ':' + connection.remotePort + ']');

    connection.on('data', (data: Buffer) => {
        var message = data.toString().split(' ');
        var seq_num = message[0];
        var command = message[1];

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
        console.log(pta.now() + ' - Client disconnected [' + connection.remoteAddress + ':' + connection.remotePort + ']');
    });

});

// começa a escutar as requisições
pta.listen(port);
console.log('Process ' + process.pid + ' running on ' + process.platform);
console.log('Listening on port 11550...\n');