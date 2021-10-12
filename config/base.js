const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const config = require('../config.json');

module.exports = {
    mode: 'development',//production,development
    devtool: 'source-map',
    entry: {},
    module: {
        rules: [
            {
                test: /\.(frag|vert|glsl)$/,
                use: [
                    {
                        loader: 'raw-loader',
                        options: {}
                    }
                ]
            },
            {
                test: /\.(mp3|svg|png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts','.js']
    },
    output: {
        filename: '[name].js',
        library: ['vf','gui','module'],
        libraryTarget: "umd",
        path: path.resolve(__dirname, `../dist/`),
    },
    plugins: [
        // new webpack.ProgressPlugin((percentage, message, ...args) => {
        //     // e.g. Output each progress message directly to the console:
        //     console.info(percentage, message, ...args);
        // }),
    ],
};

console.log(`当前编译包为：${config.buildPackageName},如需改变可设置config.json`);
