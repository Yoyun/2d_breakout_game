const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const phaserModule = path.join(__dirname, 'node_modules/phaser');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');

const config = {
    entry: {
        app: path.resolve(__dirname, 'app/index.js'),
        vendor: ['pixi', 'p2', 'phaser'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {test: /\.(js|jsx)$/, exclude: '/node_modules', use: 'babel-loader'},
            {test: /pixi\.js/, use: ['expose-loader?PIXI']},
            {test: /phaser-split\.js$/, use: ['expose-loader?Phaser']},
            {test: /p2\.js/, use: ['expose-loader?p2']},
            {test: /\.(png|jpg)$/, use: 'file-loader?name=assest/images/[name].[ext]'},
            {test: /\.(mp3|ogg|wav)$/, use: 'file-loader?name=assest/audio/[name].[ext]'},
            {test:/\.json$/, use: 'file-loader?name=assest/data/[name].[ext]'}
        ]
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2
        }
    },
    devServer: {
        historyApiFallback: true
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'/* chunkName= */,
            filename: 'js/vendor.js'/* filename= */
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'app', 'index.html')
        })
    ]
};

module.exports = config;
