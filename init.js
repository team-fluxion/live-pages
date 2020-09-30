/* global require */

const fse = require('fs-extra');

// Check if the './web' directory exists
if (!fse.pathExistsSync('./web')) {
    // Clone the './example' directory into './web'
    fse.copySync('./example', './web');
    console.log('\'./example\' directory cloned to \'./web\'.');
}
