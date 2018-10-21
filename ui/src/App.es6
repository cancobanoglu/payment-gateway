"use strict";

const bus = require('./bus');

const axios = require('axios');

const URL_ROOT = "http://localhost:9000/";

class FPayment {
    constructor() {
    }

    create(divId, types) {

        let outerDiv = document.getElementById(divId);
        console.log(outerDiv);

        createPaymentFrameDiv(outerDiv);

        document.getElementById("defaultOpen").click();

        let performInnerFrameData = function (data) {
            console.log("outer frame is working");
            console.log("Inner Frame Msg :" + data.message);
        };

        bus.subscribe("performInnerFrameData", performInnerFrameData);
    }
}

function createPaymentFrameDiv(outerDiv) {

    let containerDiv = document.createElement('div');
    containerDiv.className = 'tab';

    let ccButton = document.createElement('button');
    ccButton.className = 'tablinks';
    ccButton.innerHTML = "Kredi Karti";
    ccButton.addEventListener('click', function (evt) {
        openType(evt, 'CC');
    });
    containerDiv.appendChild(ccButton);

    let payUButton = document.createElement('button');
    payUButton.className = 'tablinks';
    payUButton.id = 'defaultOpen';
    payUButton.innerHTML = "PayU";
    payUButton.addEventListener('click', function (evt) {
        openType(evt, 'PayU');
    });

    containerDiv.appendChild(payUButton);
    outerDiv.appendChild(containerDiv);

    let ccContentDiv = document.createElement('div');
    ccContentDiv.className = 'tabcontent';
    ccContentDiv.id = 'CC';
    ccContentDiv.innerHTML = '<h3>Kredi Karti</h3>';

    let config = {
        url : "http://localhost:9000/cc.html"
    };

    let ccFrame = createFrame(config, 'ccFrameId');
    ccContentDiv.appendChild(ccFrame);

    outerDiv.appendChild(ccContentDiv);

    let payUContentDiv = document.createElement('div');

    let payuStartButton = createPaymentType("Odemeyi Baslat");
    payuStartButton.onclick = function (data) {
        console.log('payUButtonFunction clicked.');
        axios.get('/api/transactions?pType=payu')
            .then(function (response) {
                // handle success
                console.log(response.data.url);
                let iframeConfig = {
                    url: response.data.url
                };
                if (!document.getElementById("payUFrameId")) {
                    console.log("frame creating...");
                    let iframe = createFrame(iframeConfig, 'payUFrameId');
                    payUContentDiv.appendChild(iframe);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    };

    payUContentDiv.className = 'tabcontent';
    payUContentDiv.id = 'PayU';
    payUContentDiv.innerHTML = '<h3>PayU Odeme Secenegi</h3>';
    payUContentDiv.appendChild(payuStartButton);
    outerDiv.appendChild(payUContentDiv);

    return outerDiv;

}

function openType(evt, name) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");

        document.getElementById(name).style.display = "block";
        evt.currentTarget.className += " active";
    }
}

function createPaymentType(name, color, config) {
    var button = document.createElement('button');
    config = config || {};

    button.id = config.id || 'express-button';
    button.style.backgroundColor = config.backgroundColor || '#FFF';
    button.style.color = config.color || '#009CDE';
    button.style.border = config.border || '1px solid #009CDE';
    button.style.borderRadius = config.borderRadius || '4px';
    button.style.padding = config.padding || '12px';
    button.innerHTML = config.innerHTML || name;
    button.style.width = '100px';
    button.style.marginLeft = config.marginLeft || "5px";
    button.style.marginTop = config.marginTop || "5px";
    return button;
}

function createFrame(config, id) {
    var iframe = document.createElement('iframe');
    config = config || {};

    iframe.setAttribute("src", config.url || "");
    iframe.style.width = "100%";
    iframe.style.margin = "10px";
    iframe.id = id;
    iframe.style.height = "100%";
    iframe.style.frameBorder = config.frameBorder || "0";
    iframe.style.border = "0px";
    iframe.style.padding = "0px";
    iframe.style.margin = "0px";
    iframe.scrolling = config.scrolling || 'no';
    iframe.style.minHeight = config.minHeight + "px";
    //iframe.style.backgroundColor = config.backgroundColor || '#009CDE';
    return iframe;

}


module.exports = {
    create: new FPayment().create
}
