/* global WebSocket */

import {
    alert,
    confirm
} from 'ample-alerts';

export default (config, handleRoute) => {
    const socket = new WebSocket(`${config.sslCertificatePath ? 'wss' : 'ws'}://${config.appDomain}:${config.socketPort}`);

    let isPendingUpdate = false;

    socket.onmessage = message => {
        const receivedMessage = JSON.parse(message.data);

        if (!isPendingUpdate && receivedMessage.message === 'UPDATE') {
            isPendingUpdate = true;
            confirm(
                [
                    'This page might have received an update!',
                    'Would you like to fetch the latest data?'
                ],
                {
                    onAction: response => {
                        if (response) {
                            isPendingUpdate = false;
                            handleRoute({ state: null });
                        } else {
                            alert(
                                'The content you\'re viewing may be outdated!',
                                { autoClose: 5000 }
                            );
                        }
                    },
                    labels: ['Sure', 'Ignore']
                }
            );
        }
    };
};
