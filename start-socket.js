/* global module require __dirname setInterval */

const https = require('https');
const fs = require('fs');

const ws = require('ws');
const chokidar = require('chokidar');

const config = require('./web/config');

const noOperation = () => {};

module.exports = portNumber => {
    const clients = [];

    let server;
    let wss;

    // Check if configured with SSL
    if (config.sslCertificatePath) {
        server = https.createServer(
            {
                key: fs.readFileSync(`${config.sslCertificatePath}/privkey.pem`),
                cert: fs.readFileSync(`${config.sslCertificatePath}/fullchain.pem`)
            }
        );

        wss = new ws.Server({
            server,
            perMessageDeflate: false
        });

        server.listen(portNumber);
    } else {
        wss = new ws.Server({
            perMessageDeflate: false,
            port: portNumber
        });
    }

    // Listen to new socket connections
    wss.on(
        'connection',
        ws => {
            ws.isAlive = true;

            ws.on(
                'pong',
                () => {
                    ws.isAlive = true;
                }
            );

            // Add the client to collection
            clients.push(ws);

            ws.on(
                'error',
                () => {}
            );

            ws.on(
                'close',
                () => {
                    const currentClient = clients.filter(c => c === ws)[0];

                    // Remove the client from collection
                    clients.splice(clients.indexOf(currentClient), 1);
                }
            );
        }
    );

    const pingInterval = setInterval(
        () => {
            clients
                .forEach(
                    ws => {
                        if (!ws.isAlive) {
                            return ws.terminate();
                        }

                        ws.isAlive = false;
                        ws.ping(noOperation);
                        return true;
                    }
                );
        },
        30000
    );

    // Set up a watcher on the data directory
    chokidar
        .watch(
            config.dataDirectoryPath,
            { persistent: true }
        )
        .on(
            'all',
            event => {
                clients.forEach(
                    s => { s.send(JSON.stringify({ message: 'UPDATE' })); }
                );
            }
        );

    console.log(config.appName, 'socket server started on', portNumber);
};
