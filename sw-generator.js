/* global require process console module */

const { lstatSync, readdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const { log } = console;

const config = require('../../src/config');

// Function to get a recursive list of files in a folder
const inflateInput = (inputDirs, parentDir = './') =>
      inputDirs.map(
          inputDir =>
              (
                  item =>
                      lstatSync(item).isDirectory()
                      ? inflateInput(readdirSync(item), item)
                      : [item]
              )(join(parentDir, inputDir))
      ).reduce(
          (a, c) => a.concat(c),
          []
      );

const generateSW = () => {
    log('Generating service-worker file...');

    // Generate list of files in 'public' directory
    const listOfFiles = inflateInput(['./public']);

    // Read sw.js template as string
    const swTemplateString = readFileSync('./assets/sw-template.js', 'utf8');

    // Get stringified list of files with static path
    const stringifiedOutputFileList = JSON.stringify(
        ['/']
            .concat(
                listOfFiles
                    .map(
                        filename => filename.replace('public', config.staticPath)
                    )
            )
    );

    // Generate output file contents post substitution
    const compiledContentOfOutputFile = swTemplateString
          .replace(/'swCacheString'/g, new Date().getTime())
          .replace(/'outputFileList'/g, stringifiedOutputFileList);

    // Write final sw.js to public directory
    writeFileSync('../../public/sw.js', compiledContentOfOutputFile);

    log('Service-worker file generated!');
};

module.exports.generateSW = generateSW;
