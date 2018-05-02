"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = require("net");
var port = 11550;
var server = net_1.createServer(function (connection) {
    connection.write('Hello, I am the server!');
    connection.on('data', function (message) {
        console.log(message.toString());
    });
}).listen(port);
