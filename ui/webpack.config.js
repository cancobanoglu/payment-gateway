const path = require('path');
const config = require('./package.json');

const webpack = require('webpack');
require('dotenv').config();

const PROD = process.env.NODE_ENV === 'production';

let plugins = [];

PROD ? [
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
    }))
] : '';

var fpaymentConfig = Object.assign({}, config, {
    entry: path.resolve(__dirname, "src/App.es6"),
    devtool: 'source-map',
    output: {
        library: process.env.NAME,
        libraryTarget: process.env.TARGET,
        path: __dirname,
        filename: (PROD) ? 'build/fpayment.min.js' : 'build/fpayment.js'
    },
    module: {
        loaders: [
            { test: /\.es6?$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    },
    plugins: plugins
});

var fgatewayConfig = Object.assign({}, config, {
    entry: path.resolve(__dirname, "src/PayU.es6"),
    devtool: 'source-map',
    output: {
        library:"PayU",
        libraryTarget: process.env.TARGET,
        path: __dirname,
        filename: (PROD) ? 'build/payu.min.js' : 'build/payu.js'
    },
    module: {
        loaders: [
            { test: /\.es6?$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    },
    plugins: plugins
});

var ccConfig = Object.assign({}, config, {
    entry: path.resolve(__dirname, "src/cc/card.js"),
    devtool: 'source-map',
    output: {
        library:"card",
        libraryTarget: process.env.TARGET,
        path: __dirname,
        filename: (PROD) ? 'build/card.min.js' : 'build/card.js'
    },
    module: {
        loaders: [
            { test: /\.es6?$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    },
    plugins: plugins
});

module.exports = [fpaymentConfig, fgatewayConfig, ccConfig];