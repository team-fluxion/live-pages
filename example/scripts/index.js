/* global window */

import init from '../../assets/client-init';

const main = () => {
    // Note: This is required
    init();

    // Custom scripts follow this line...
    console.log('The app is now running...');
};

// Run 'main' when ready
window.onload = main;
