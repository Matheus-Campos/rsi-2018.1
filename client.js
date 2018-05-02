"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = require("net");
var host = 'localhost';
var port = 11550;
var client = net_1.connect(port, host);
client.once('connect', function () { return client.write('CUMP client'); });
client.on('data', function (message) {
    console.log(message.toString());
});
