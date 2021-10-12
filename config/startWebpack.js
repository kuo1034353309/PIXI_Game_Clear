const path = require('path');
const webpack = require('webpack');
const package = require('../package.json');
module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: ["./src/globalData.js" , "./src/soundManager.js","./src/myButton.js","./src/itemBody.js","./src/mainUI.js"],//'./src',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: [/node_modules/]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'main.js',
        //library: "vfgui",
        libraryTarget: "umd",
        path: path.resolve(__dirname, '../dist')
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(package.version),
        }),
    ],
    devServer: {
        inline: true,
        port: 8089
    }
};
webpack.mode = 'production';
// config.buildPackageName.forEach(element => {
//     module.exports.entry[element] = path.resolve(__dirname,'../packages/') + '/' +element + '/src/index.ts';
// });