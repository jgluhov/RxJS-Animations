const path = require('path');

module.exports = {
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                loader: "ts-loader",
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ]
            }        
        ]
    },
    devtool: "inline-cheap-module-source-map",
    devServer: {
        contentBase: path.join(__dirname, "public"),
        compress: true,
        port: 9000,
        historyApiFallback: true
    }
}