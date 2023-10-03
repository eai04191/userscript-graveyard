// ==UserScript==
// @name        mahjongsoul traffic viewer
// @namespace   net.mizle
// @match       https://game.mahjongsoul.com/
// @grant       none
// @version     1.0
// @author      -
// @run-at      document-start
// @require     https://cdn.jsdelivr.net/npm/protobufjs@7.2.5/dist/protobuf.min.js
// ==/UserScript==
/*global protobuf*/

let root;

// basic protobuf reader

function decodeVarint(buffer, offset) {
    let number = 0;
    let shift = 0;
    let position = offset;

    while (position < buffer.length) {
        let byte = buffer[position++];
        number |= (byte & 0x7f) << shift;
        if ((byte & 0x80) === 0) break;
        shift += 7;
    }

    return { value: number, length: position - offset };
}

/**
 * @param {ArrayBuffer | Uint8Array} buffer
 * @returns {Object}
 */
function decodeProtobuf(buffer) {
    if (buffer instanceof ArrayBuffer) {
        buffer = new Uint8Array(buffer);
    }

    let offset = 0;
    let result = {};

    while (offset < buffer.length) {
        let { value: fieldAndType, length } = decodeVarint(buffer, offset);
        let fieldType = fieldAndType & 7;
        let fieldNumber = fieldAndType >> 3;
        offset += length;

        switch (fieldType) {
            case 0: {
                // Varint
                let varint = decodeVarint(buffer, offset);
                result[fieldNumber] = varint.value;
                offset += varint.length;
                break;
            }
            case 2: {
                // Length-delimited
                let msgLength = decodeVarint(buffer, offset);
                offset += msgLength.length;

                let strValue = new TextDecoder().decode(
                    buffer.slice(offset, offset + msgLength.value),
                );
                if (strValue.includes(".")) {
                    result[fieldNumber] = strValue;
                } else {
                    result[fieldNumber] = decodeProtobuf(
                        buffer.slice(offset, offset + msgLength.value),
                    );
                }

                offset += msgLength.value;
                break;
            }
            default:
                // throw new Error(`Unsupported field type: ${fieldType}`);
                console.debug(`Unsupported field type: ${fieldType}`);
        }
    }

    return result;
}

/**
 * @callback SendCallback
 * @param {string | ArrayBufferLike | Blob | ArrayBufferView} data
 * @returns {void}
 */

/**
 * @callback ReceivedCallback
 * @param {MessageEvent} event
 * @returns {void}
 */

/**
 * @param {SendCallback} sendCallback
 * @param {ReceivedCallback} receivedCallback
 */
function addProxyToWebSocket(sendCallback, receivedCallback) {
    const originalWebSocket = window.WebSocket;

    window.WebSocket = function (url, protocols) {
        console.log("WebSocket intercepted:", url, protocols);

        const ws = new originalWebSocket(url, protocols);
        const originalSend = ws.send;

        ws.send = function (data) {
            originalSend.apply(ws, [data]);
            sendCallback(data);
        };

        ws.addEventListener("message", (event) => {
            receivedCallback(event);
        });

        return ws;
    };
}

(function () {
    /**
     * @typedef {Object} MessageEvent
     * @property {ArrayBuffer} data
     * @property {string} pbtype
     */

    /**
     * @type {Map<number, MessageEvent>}
     */
    const reqMessageRepository = new Map();

    /**
     * @type {Map<number, MessageEvent>}
     */
    const resMessageRepository = new Map();

    /**
     * @param {ArrayBuffer} ab
     * @returns {void}
     */
    function readPacket(ab) {
        const data = new DataView(ab);
        const type = data.getUint8(0);

        function log(...data) {
            const header = (() => {
                switch (type) {
                    case 1:
                        return "[🔔 NOTIFY  ]";
                    case 2:
                        return "[🛫 REQUEST ]";
                    case 3:
                        return "[🛬 RESPONSE]";
                    default:
                        return "[⚠️ UNKNOWN ]";
                }
            })();

            console.log(header, ...data);
        }

        switch (type) {
            case 1: {
                // NOTIFY
                try {
                    // NotifyにはmessageIdがないので1からデータ
                    const message = data.buffer.slice(1);
                    const messageDecoded = decodeProtobuf(message);
                    const messageTypeName = messageDecoded[1] || null;

                    if (typeof messageTypeName === "string") {
                        const pbtype = messageTypeName.replace(/^\./, "");
                        const NotifyName = pbtype.split(".")[1];

                        const messageType = root.lookupType(NotifyName);
                        log(pbtype, messageType, messageDecoded);
                        const decodedMessage = messageType.decode(new Uint8Array(message));
                        log(data, message, messageDecoded, decodedMessage);
                    } else {
                        log(data, message, messageDecoded);
                    }
                } catch (error) {
                    console.debug(error);
                }
                break;
            }
            case 2: {
                // REQUEST
                try {
                    const messageId = data.getUint16(1, true);
                    const message = data.buffer.slice(3);
                    const messageDecoded = decodeProtobuf(message);
                    const messageType = messageDecoded[1] || null;
                    log(messageId, messageType, { data, message, messageDecoded });
                    if (typeof messageType === "string") {
                        reqMessageRepository.set(messageId, {
                            data: message,
                            // remove first dot
                            pbtype: messageType.replace(/^\./, ""),
                        });
                    }
                    break;
                } catch (error) {
                    console.debug(error);
                }
                break;
            }
            case 3: {
                // RESPONSE
                try {
                    const messageId = data.getUint16(1, true);
                    const req = reqMessageRepository.get(messageId);

                    if (!req) {
                        console.warn("Request not found");
                        break;
                    }
                    const message = data.buffer.slice(3);

                    const serviceName = req.pbtype.split(".")[1];
                    console.debug(serviceName);
                    const service = root.lookupService(`lq.` + serviceName);

                    const methodName = req.pbtype.split(".")[2];
                    console.debug(methodName);
                    const method = service.methods[methodName];
                    const response = root.lookupType(method.responseType);
                    const decodedMessage = response.decode(new Uint8Array(message));

                    log(messageId, decodedMessage, {
                        message,
                        // messageHex like a ['0A', '00', '12'...]
                        messageHex: Array.from(new Uint8Array(message)),
                        serviceName,
                        service,
                        methodName,
                        method,
                        response,
                    });
                } catch (error) {
                    console.debug(error);
                }
                break;
            }
            default:
                break;
        }
    }

    /**
     * @type {ReceivedCallback}
     */
    function receivedCallback(event) {
        if (!(event.data instanceof ArrayBuffer)) {
            return;
        }
        readPacket(event.data);
    }

    /**
     * @type {SendCallback}
     */
    function sendCallback(data) {
        if (!(data instanceof ArrayBuffer)) {
            return;
        }
        readPacket(data);
    }

    addProxyToWebSocket(sendCallback, receivedCallback);

    loadProtoAsync();
})();

async function loadProtoAsync() {
    try {
        const url = `https://cdn.jsdelivr.net/gh/Cryolite/mahjongsoul_sniffer/mahjongsoul_sniffer/mahjongsoul.proto`;
        const text = await fetch(url).then((res) => res.text());
        root = protobuf.parse(text).root;
        console.log("Proto loaded");
    } catch (error) {
        console.error(`Proto load failed: ${error}`);
    }
}
