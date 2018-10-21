"use strict";

const bus = require('./bus');

class PayU {
    constructor() {
    }

    complete() {

        bus.publish("performInnerFrameData", {
            message: "basarili"
        });
    }
}


module.exports = {
    complete: new PayU().complete
}
