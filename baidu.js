const net = require('net');

const kHttpHeaderSent = 1;
const kHttpHeaderReceived = 2;

const flags = new Map(); // uuid => state

function getUuid(ctx) {
    return ctx.uuid;
}

function getAddressHost(ctx) {
    return ctx.host;
}

function getAddressPort(ctx) {
    return ctx.port;
}

function writeToContext(ctx, data) {
    ctx.socket.write(data);
}

function debug(msg) {
    console.debug(msg);
}

function freeContext(ctx) {
    // Cleanup logic if needed
    ctx.socket.destroy();
}

function onFlags(ctx) {
    return 'DIRECT_WRITE';
}

function onHandshake(ctx) {
    const uuid = getUuid(ctx);

    if (flags.get(uuid) === kHttpHeaderReceived) {
        return true;
    }

    if (flags.get(uuid) !== kHttpHeaderSent) {
        const host = getAddressHost(ctx);
        const port = getAddressPort(ctx);

        const connectRequest =
            `CONNECT ${host}:${port} HTTP/1.1\r\n` +
            `Host: 153.3.236.22:443\r\n` +
            `User-Agent: Mozilla/5.0 (Linux; Android 12; RMX3300 Build/SKQ1.211019.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/97.0.4692.98 Mobile Safari/537.36 T7/13.32 SP-engine/2.70.0 baiduboxapp/13.32.0.10 (Baidu; P1 12) NABar/1.0\r\n` +
            `Proxy-Connection: Keep-Alive\r\n` +
            `X-T5-Auth: 683556433\r\n\r\n`;

        writeToContext(ctx, connectRequest);
        flags.set(uuid, kHttpHeaderSent);
    }

    return false;
}

function onRead(ctx, buffer) {
    debug('onRead');
    const uuid = getUuid(ctx);

    if (flags.get(uuid) === kHttpHeaderSent) {
        flags.set(uuid, kHttpHeaderReceived);
        return { result: 'HANDSHAKE', data: null };
    }

    return { result: 'DIRECT', data: buffer };
}

function onWrite(ctx, buffer) {
    debug('onWrite');
    return { result: 'DIRECT', data: buffer };
}

function onClose(ctx) {
    debug('onClose');
    const uuid = getUuid(ctx);
    flags.delete(uuid);
    freeContext(ctx);
    return 'SUCCESS';
}

module.exports = {
    onFlags,
    onHandshake,
    onRead,
    onWrite,
    onClose,
};
