/* global module require __dirname */

const appName = 'that-web-app';

const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');

const readFile = (basePath, filePath) => {
    try {
        return fs.readFileSync(
            `${basePath}/${filePath}`,
            'utf8'
        );
    } catch (e) {
        return '<Data couldn\'t be read>';
    }
};

module.exports = url => {
    const app = express();
    const basePath = path.join(__dirname, '../');

    // Setup statics
    app.use(express.static(path.join(basePath, 'public')));
    app.use(bodyParser.json());

    // Start the web server
    app.listen(
        url,
        () => {
            console.log(appName, 'started on', url);
        }
    );

    // Serve index page
    app.get(
        '*',
        ({ url }, res) => {
            res.send(
                readFile(basePath, 'public/index.html')
            );
        }
    );
};
