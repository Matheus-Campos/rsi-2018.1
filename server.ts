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
        this.ready = this.ready ? !this.ready : this.ready;
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
                    break;
                case 'PEGA':
                    break;
                case 'LIST':
                    break;
                default:
                    respond('NOK');
                    break;
            }
        } else {
            switch (command) {
                case 'CUMP':
                    let args = message[2];
                    if (args === 'client') {
                        respond('OK');
                        pta.toggleState();
                    } else {
                        respond('NOK');
                    }
                    break;
            
                default:
                    break;
            }
        }

        // switch (command) {
        //     case 'CUMP':
        //         if (pta.isReady()) {
        //             respond('NOK');
        //         } else {
                    
        //         }
        //         break;
        //     case 'LIST':
        //         if (pta.isReady()) {
        //             respond('ARQS', pta.getFiles().toString());
        //         } else {
        //             respond('NOK');
        //             connection.end();
        //         }
        //         break;
        //     case 'PEGA':
        //         let args = message[2];
        //         let files = pta.getFiles();
        //         var i: number = 0;
        //         files.forEach((value, index) => {
        //             if (args == value) {
        //                 i = index;
        //             }
        //         });
        //         respond('ARQ', files[i]);
        //         break;
        //     case 'TERM':
        //         if (pta.isReady()) {
        //             respond('OK');
        //             connection.end();
        //             pta.toggleState();
        //         } else {
        //             respond('NOK');
        //             connection.end();
        //         }
        //         break;
        //     default:
        //         if (pta.isReady()) {
        //             respond('NOK');
        //         } else {
        //             respond('NOK');
        //             connection.end();
        //         }
        //         break;
        // }
    });
    connection.on('close', (had_error) => {
        if (had_error) console.log('Error 500');
    });
});

// começa a escutar as requisições
pta.listen(port);